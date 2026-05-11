// src/trips/TripEvents.ts
import { DomainEvent } from "../shared/DomainEvent";
import type { Timestamp } from "../shared/Time";
import { TripState } from "../domain/TripState";

/** Emitted when a Trip changes state (audit + UI). */
export class TripStateChangedEvent extends DomainEvent {
  readonly tripId: string;
  readonly previousState: TripState;
  readonly newState: TripState;

  constructor(tripId: string, previousState: TripState, newState: TripState, occurredAt: Timestamp) {
    super("trip.state_changed", occurredAt);
    this.tripId = tripId;
    this.previousState = previousState;
    this.newState = newState;
  }
}

/** Emitted when a Trip is assigned to a vehicle/driver. */
export class TripAssignedEvent extends DomainEvent {
  readonly tripId: string;
  readonly vehicleId: string;
  readonly driverId: string;

  constructor(tripId: string, vehicleId: string, driverId: string, occurredAt: Timestamp) {
    super("trip.assigned", occurredAt);
    this.tripId = tripId;
    this.vehicleId = vehicleId;
    this.driverId = driverId;
  }
}

/** Emitted when a dispatcher overrides grouping rules to combine a private reservation into a Trip. */
export class ReservationOverrideEvent extends DomainEvent {
  readonly reservationId: string;
  readonly tripId: string;
  readonly overriddenBy: string; // three-character initials
  readonly overriddenAt: Timestamp;
  readonly reason: string;

  constructor(
    reservationId: string,
    tripId: string,
    overriddenBy: string,
    overriddenAt: Timestamp,
    reason: string
  ) {
    super("reservation.override", overriddenAt);
    this.reservationId = reservationId;
    this.tripId = tripId;
    this.overriddenBy = overriddenBy;
    this.overriddenAt = overriddenAt;
    this.reason = reason;
  }
}
