// src/domain/Trip.ts

import { Entity } from "../shared/Entity";
import { nowUtc, type Timestamp } from "../shared/Time";
import { TimeWindow } from "../shared/TimeWindow";

import { Reservation } from "../reservations/Reservation";
import { ReservationState } from "../reservations/ReservationState";

import { TripState } from "../domain/TripState";
import {
  CapacityExceededError,
  GroupingError,
  InvalidTransitionError
} from "../trips/TripErrors";

import {
  TripAssignedEvent,
  TripStateChangedEvent,
  ReservationOverrideEvent
} from "../trips/TripEvents";

/**
 * Canonical Trip aggregate root.
 * This is the ONLY Trip.ts you should keep.
 */
export class Trip extends Entity {
  readonly id: string;

  private state: TripState = TripState.Draft;
  private reservations: Reservation[] = [];

  private vehicleId?: string;
  private driverId?: string;

  // reservationId -> override metadata
  private overrideRecords: Map<
    string,
    { by: string; at: Timestamp; reason: string }
  > = new Map();

  constructor(id: string) {
    super();
    this.id = id;
  }

  // ---------- Read accessors ----------
  getState(): TripState {
    return this.state;
  }

  getReservations(): readonly Reservation[] {
    return [...this.reservations];
  }

  getVehicleId(): string | undefined {
    return this.vehicleId;
  }

  getDriverId(): string | undefined {
    return this.driverId;
  }

  getOverrideRecordForReservation(reservationId: string) {
    return this.overrideRecords.get(reservationId);
  }

  // ---------- Reservation management ----------
  addReservation(
    res: Reservation,
    options?: {
      allowPrivateOverride?: boolean;
      overriddenBy?: string;
      overriddenAt?: Timestamp;
      overrideReason?: string;
    }
  ): void {
    if (this.state !== TripState.Draft && this.state !== TripState.Ready) {
      throw new InvalidTransitionError("cannot add reservation in current state");
    }

    // Private reservation combining logic
    if (res.type === ReservationType.Private && this.reservations.length > 0) {
      const allow = options?.allowPrivateOverride === true;
      const by = options?.overriddenBy;
      const at = options?.overriddenAt ?? nowUtc();
      const reason = options?.overrideReason;

      if (!allow) {
        throw new GroupingError(
          "private reservation must be alone; override required to combine"
        );
      }

      if (!by || typeof by !== "string" || !/^[A-Za-z0-9]{3}$/.test(by)) {
        throw new GroupingError(
          "override requires a valid 3-character login initials (alphanumeric)"
        );
      }

      if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
        throw new GroupingError("override requires a non-empty overrideReason");
      }

      const trimmedReason = reason.trim();
      if (trimmedReason.length > 1024) {
        throw new GroupingError("overrideReason too long");
      }

      const normalized = by.toUpperCase();

      this.overrideRecords.set(res.id, { by: normalized, at, reason: trimmedReason });

      this.addEvent(
        new ReservationOverrideEvent(res.id, this.id, normalized, at, trimmedReason)
      );
    }

    // Shared reservation grouping rules
    if (res.type === ReservationType.Shared && this.reservations.length > 0) {
      const existing = this.reservations[0];
      if (existing.orgId !== res.orgId) {
        throw new GroupingError("shared reservations must be same organization");
      }
      if (
        existing.pickupLocation !== res.pickupLocation ||
        existing.dropoffLocation !== res.dropoffLocation
      ) {
        throw new GroupingError(
          "shared reservations must have identical pickup/dropoff"
        );
      }
    }

    this.reservations.push(res);
  }

  removeReservation(reservationId: string): void {
    if (this.state !== TripState.Draft && this.state !== TripState.Ready) {
      throw new InvalidTransitionError("cannot remove reservation in current state");
    }
    this.reservations = this.reservations.filter(r => r.id !== reservationId);
    this.overrideRecords.delete(reservationId);
  }

  totalPax(): number {
    return this.reservations.reduce((s, r) => s + r.paxCount, 0);
  }

  // ---------- Trip lifecycle ----------
  markReady(): void {
    if (this.state !== TripState.Draft) {
      throw new InvalidTransitionError("trip not in draft");
    }
    this.transition(TripState.Ready);
  }

  assign(vehicleId: string, driverId: string, vehicleCapacity: number): void {
    if (this.state !== TripState.Ready) {
      throw new InvalidTransitionError("trip not ready");
    }
    if (this.totalPax() > vehicleCapacity) {
      throw new CapacityExceededError("capacity exceeded");
    }

    this.vehicleId = vehicleId;
    this.driverId = driverId;

    this.addEvent(new TripAssignedEvent(this.id, vehicleId, driverId, nowUtc()));
    this.transition(TripState.Assigned);
  }

  /**
   * Called when a reservation is marked PaxOnboard.
   * Auto-advances to EnRoute when ALL reservations are PaxOnboard.
   */
  onReservationPaxOnboard(reservationId: string): void {
    const res = this.reservations.find(r => r.id === reservationId);
    if (!res) throw new Error("reservation not found in trip");

    const allOnboard =
      this.reservations.length > 0 &&
      this.reservations.every(r => r.getState() === ReservationState.PaxOnboard);

    if (allOnboard) {
      this.transition(TripState.EnRoute);
    }
  }

  markReservationPaxOnboard(reservationId: string): void {
    const res = this.reservations.find(r => r.id === reservationId);
    if (!res) throw new Error("reservation not found in trip");

    res.markPaxOnboard();
    this.onReservationPaxOnboard(reservationId);
  }

  complete(): void {
    if (
      this.state !== TripState.InProgress &&
      this.state !== TripState.EnRoute
    ) {
      throw new InvalidTransitionError("trip not in progress or en route");
    }
    this.transition(TripState.Completed);
  }

  cancel(_reason?: string): void {
    if (this.state === TripState.Completed) {
      throw new InvalidTransitionError("cannot cancel completed trip");
    }
    this.transition(TripState.Canceled);
  }

  // ---------- Occupancy ----------
  occupancyWindow(preBufferMs = 0, postBufferMs = 0): TimeWindow {
    if (this.reservations.length === 0) {
      throw new Error("no reservations");
    }

    const windows = this.reservations.map(
      r =>
        new TimeWindow(
          r.requestedWindowStart - preBufferMs,
          r.requestedWindowEnd + postBufferMs
        )
    );

    const start = Math.min(...windows.map(w => w.start));
    const end = Math.max(...windows.map(w => w.end));

    return new TimeWindow(start, end);
  }

  // ---------- Internal helpers ----------
  private transition(newState: TripState): void {
    const previous = this.state;
    this.state = newState;
    this.addEvent(
      new TripStateChangedEvent(this.id, previous, newState, nowUtc())
    );
  }
}
