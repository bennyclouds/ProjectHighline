// src/reservations/ReservationEvents.ts
import { DomainEvent } from "../shared/DomainEvent";
import type { Timestamp } from "../shared/Time";

/**
 * Typed, immutable domain events for Reservation lifecycle.
 * Keep these events small and focused — they are plain data carriers.
 */

/** Emitted when a reservation is first booked and persisted */
export class ReservationBookedEvent extends DomainEvent {
  readonly reservationId: string;
  readonly confirmationNumber: string;
  readonly brandCode?: string;

  constructor(reservationId: string, confirmationNumber: string, brandCode: string | undefined, occurredAt: Timestamp) {
    super("reservation.booked", occurredAt);
    this.reservationId = reservationId;
    this.confirmationNumber = confirmationNumber;
    this.brandCode = brandCode;
  }
}

/** Emitted when a reservation is checked in at the pickup point (agent or driver action) */
export class ReservationCheckedInEvent extends DomainEvent {
  readonly reservationId: string;
  readonly readyLocation?: string;

  constructor(reservationId: string, readyLocation: string | undefined, occurredAt: Timestamp) {
    super("reservation.checked_in", occurredAt);
    this.reservationId = reservationId;
    this.readyLocation = readyLocation;
  }
}

/** Emitted when passengers are marked onboard (10-2) */
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
 * Emitted when a reservation signals "ready to go" (RTG) at pickup
 * (distinct from checked-in; RTG can carry a readyLocation or other driver-specific context)
 */
export class ReservationRTGEvent extends DomainEvent {
  readonly reservationId: string;
  readonly readyLocation?: string;

  constructor(reservationId: string, readyLocation: string | undefined, occurredAt: Timestamp) {
    super("reservation.rtg", occurredAt);
    this.reservationId = reservationId;
    this.readyLocation = readyLocation;
  }
}

/** Emitted when a passenger is dropped off and the reservation is completed */
export class ReservationCompletedEvent extends DomainEvent {
  readonly reservationId: string;
  readonly actualDropoffAt?: Timestamp;
  readonly tripId?: string;

  constructor(reservationId: string, actualDropoffAt: Timestamp | undefined, tripId: string | undefined, occurredAt: Timestamp) {
    super("reservation.completed", occurredAt);
    this.reservationId = reservationId;
    this.actualDropoffAt = actualDropoffAt;
    this.tripId = tripId;
  }
}

/** Emitted when a reservation is canceled */
export class ReservationCanceledEvent extends DomainEvent {
  readonly reservationId: string;
  readonly reason?: string;
  readonly canceledBy?: string;

  constructor(reservationId: string, reason: string | undefined, canceledBy: string | undefined, occurredAt: Timestamp) {
    super("reservation.canceled", occurredAt);
    this.reservationId = reservationId;
    this.reason = reason;
    this.canceledBy = canceledBy;
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

/** Emitted when a reservation is unassigned from a Trip */
export class ReservationUnassignedFromTripEvent extends DomainEvent {
  readonly reservationId: string;
  readonly previousTripId?: string;

  constructor(reservationId: string, previousTripId: string | undefined, occurredAt: Timestamp) {
    super("reservation.unassigned_from_trip", occurredAt);
    this.reservationId = reservationId;
    this.previousTripId = previousTripId;
  }
}

/** Emitted when a reservation is moved from one trip to another */
export class ReservationReassignedEvent extends DomainEvent {
  readonly reservationId: string;
  readonly fromTripId?: string;
  readonly toTripId: string;

  constructor(reservationId: string, fromTripId: string | undefined, toTripId: string, occurredAt: Timestamp) {
    super("reservation.reassigned", occurredAt);
    this.reservationId = reservationId;
    this.fromTripId = fromTripId;
    this.toTripId = toTripId;
  }
}

/** Emitted when payment for the reservation is captured */
export class ReservationPaymentCapturedEvent extends DomainEvent {
  readonly reservationId: string;
  readonly amount: number;
  readonly currency?: string;
  readonly paymentMethod?: string;
  readonly transactionId?: string;

  constructor(
    reservationId: string,
    amount: number,
    currency: string | undefined,
    paymentMethod: string | undefined,
    transactionId: string | undefined,
    occurredAt: Timestamp
  ) {
    super("reservation.payment_captured", occurredAt);
    this.reservationId = reservationId;
    this.amount = amount;
    this.currency = currency;
    this.paymentMethod = paymentMethod;
    this.transactionId = transactionId;
  }
}

/** Emitted when a passenger fails to board (no-show) */
export class ReservationNoShowEvent extends DomainEvent {
  readonly reservationId: string;
  readonly notes?: string;

  constructor(reservationId: string, notes: string | undefined, occurredAt: Timestamp) {
    super("reservation.no_show", occurredAt);
    this.reservationId = reservationId;
    this.notes = notes;
  }
}

/** Emitted when a reservation state changes */
export class ReservationStateChangedEvent extends DomainEvent {
  readonly reservationId: string;
  readonly previousState: string;
  readonly newState: string;

  constructor(reservationId: string, previousState: string, newState: string, occurredAt: Timestamp) {
    super("reservation.state_changed", occurredAt);
    this.reservationId = reservationId;
    this.previousState = previousState;
    this.newState = newState;
  }
}

/*
  Future events to consider:
  - ReservationPaymentFailedEvent
  - ReservationRefundedEvent
  - ReservationReminderSentEvent
  - ReservationCheckInReminderEvent
*/
