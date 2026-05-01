// src/reservations/ReservationEvents.ts
import { DomainEvent } from "../shared/DomainEvent";
import type { Timestamp } from "../shared/Time";

/**
 * Typed, immutable domain events for Reservation lifecycle.
 * Add new event classes below for any additional reservation transitions you want to emit.
 */

/** Generic state change event template */
/** 
*export class ReservationStateChangedEvent extends DomainEvent {
  readonly reservationId: string;
  readonly previousState: ReservationState | string;
  readonly newState: ReservationState | string;

  constructor(
    reservationId: string,
    previousState: ReservationState | string,
    newState: ReservationState | string,
    occurredAt: Timestamp
  ) {
    super("reservation.state_changed", occurredAt);
    this.reservationId = reservationId;
    this.previousState = previousState;
    this.newState = newState;
  }
}
**/

/** 
 * Emitted when passengers are marked onboard (10-2)
 **/
export class ReservationPaxOnboardEvent extends DomainEvent {
  readonly reservationId: string;
  readonly tripId?: string;

  constructor(reservationId: string, tripId: string | undefined, occurredAt: Timestamp) {
    super("reservation.pax_onboard", occurredAt);
    this.reservationId = reservationId;
    this.tripId = tripId;
  }
}

/**
 * Emitted when a reservation is checked in at the pickup point
 **/
export class ReservationRTGEvent extends DomainEvent {
  readonly reservationId: string;
  readonly readyLocation?: string;

  constructor(reservationId: string, readyLocation: string | undefined, occurredAt: Timestamp) {
    super("reservation.rtg", occurredAt);
    this.reservationId = reservationId;
    this.readyLocation = readyLocation;
  }
}

/** 
 * Emitted when a passenger is dropped off 
 **/
export class ReservationCompletedEvent extends DomainEvent {
  readonly reservationId: string;
  readonly actualDropoffAt?: Timestamp;

  constructor(reservationId: string, actualDropoffAt: Timestamp | undefined, occurredAt: Timestamp) {
    super("reservation.completed", occurredAt);
    this.reservationId = reservationId;
    this.actualDropoffAt = actualDropoffAt;
  }
}

/** Emitted when a reservation is canceled */
export class ReservationCanceledEvent extends DomainEvent {
  readonly reservationId: string;
  readonly reason?: string;

  constructor(reservationId: string, reason: string | undefined, occurredAt: Timestamp) {
    super("reservation.canceled", occurredAt);
    this.reservationId = reservationId;
    this.reason = reason;
  }
}

/** Emitted when a reservation is attached to a Trip (assignment) */
export class ReservationAssignedToTripEvent extends DomainEvent {
  readonly reservationId: string;
  readonly tripId: string;
  readonly vehicleId?: string;
  readonly driverId?: string;

  constructor(
    reservationId: string,
    tripId: string,
    vehicleId: string | undefined,
    driverId: string | undefined,
    occurredAt: Timestamp
  ) {
    super("reservation.assigned_to_trip", occurredAt);
    this.reservationId = reservationId;
    this.tripId = tripId;
    this.vehicleId = vehicleId;
    this.driverId = driverId;
  }
}

/*
  add later:
  - ReservationNoShowEvent (when pax fail to board)
  - ReservationReassignedEvent (if moved between trips)
  - ReservationPaymentCapturedEvent (billing)
*/
