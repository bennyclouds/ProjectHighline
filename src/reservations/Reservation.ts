// src/reservations/Reservation.ts
import { Entity } from "../shared/Entity";
import { nowUtc } from "../shared/Time";
import type { Timestamp } from "../shared/Time";
import { ReservationState } from "./ReservationState";
import type { ReservationType } from "./ReservationType";
import type { GroupProfile } from "../groups/GroupProfile";
import type { PaymentInfo } from "../payments/PaymentInfo";
import { validateReservationProps } from "./ReservationValidation";
import {
  ReservationStateChangedEvent,
  ReservationBookedEvent,
  ReservationCheckedInEvent,
  ReservationPaxOnboardEvent,
  ReservationRTGEvent,
  ReservationCompletedEvent,
  ReservationCanceledEvent,
  ReservationAssignedToTripEvent,
  ReservationUnassignedFromTripEvent,
  ReservationReassignedEvent,
  ReservationPaymentCapturedEvent,
  ReservationNoShowEvent,
} from "./ReservationEvents";

/**
 * Reservation aggregate 
 * * - Emits both specific lifecycle events and a generic ReservationStateChangedEvent where appropriate.
 * - Constructor validates input via validateReservationProps (keeps creation rules centralized).
 * - Uses `paxCount` as the passenger count field.
 */

export class Reservation extends Entity {
  readonly id: string;

  // --- Organization / basic reservation info (existing)
  readonly orgId?: string;
  readonly type: ReservationType;
  readonly paxCount: number;

  // --- Locations / windows (existing)
  readonly pickupLocation: string;
  readonly dropoffLocation: string;
  readonly requestedWindowStart: Timestamp;
  readonly requestedWindowEnd: Timestamp;

  // --- Optional confirmation / brand (expanded)
  confirmationNumber?: string;
  brandCode?: string;

  // --- Contact & Passenger Info (expanded, optional to preserve compatibility)
  callerPhone?: string;
  passengerName?: string; // "LastName, FirstName"
  passengerEmail?: string;
  passengerSmsNumber?: string;
  reservationAgent?: string;

  // --- Group / billing (expanded)
  isGroupReservation?: boolean;
  groupProfile?: GroupProfile;
  groupContactName?: string;
  groupContactPhone?: string;
  groupContactEmail?: string;

  // --- Flight / charter fields (expanded)
  direction?: "ARRIVAL" | "DEPARTURE" | "POINT_TO_POINT";
  airportCode?: "ORD" | "MDW" | "RFD" | "DPA";
  charterStory?: string;
  flightDate?: Timestamp;
  airline?: string;
  flightNumber?: string;
  flightCity?: string;
  flightTerminal?: string;
  flightScheduledTime?: Timestamp;

  // --- Luggage / extras (expanded)
  checkedBagCount: number = 0;
  serviceExtras: ServiceExtra[] = [];
  extraStops: ExtraStop[] = [];

  // --- Fare & availability (expanded)
  availableServiceLevels?: ServiceLevel[];
  selectedServiceLevel?: ServiceLevel;
  baseFare?: number;
  fareCalculationTimestamp?: Timestamp;

  // --- Payment (expanded)
  paymentInfo?: PaymentInfo;

  // --- Lifecycle & system fields
  private state: typeof ReservationState[keyof typeof ReservationState] = ReservationState.Booked;
  private tripId?: string;
  readonly createdAt: Timestamp;
  readonly createdBy: string;

  constructor(params: {
    id: string;
    orgId?: string;
    type: ReservationType;
    paxCount: number;
    pickupLocation: string;
    dropoffLocation: string;
    requestedWindowStart: Timestamp;
    requestedWindowEnd: Timestamp;

    // optional expanded fields
    confirmationNumber?: string;
    brandCode?: string;
    callerPhone?: string;
    passengerName?: string;
    passengerEmail?: string;
    passengerSmsNumber?: string;
    reservationAgent?: string;
    isGroupReservation?: boolean;
    groupProfile?: GroupProfile;
    groupContactName?: string;
    groupContactPhone?: string;
    groupContactEmail?: string;
    direction?: "ARRIVAL" | "DEPARTURE" | "POINT_TO_POINT";
    airportCode?: "ORD" | "MDW" | "RFD" | "DPA";
    charterStory?: string;
    flightDate?: Timestamp;
    airline?: string;
    flightNumber?: string;
    flightCity?: string;
    flightTerminal?: string;
    flightScheduledTime?: Timestamp;
    checkedBagCount?: number;
    serviceExtras?: ServiceExtra[];
    extraStops?: ExtraStop[];
    availableServiceLevels?: ServiceLevel[];
    selectedServiceLevel?: ServiceLevel;
    baseFare?: number;
    fareCalculationTimestamp?: Timestamp;
    paymentInfo?: PaymentInfo;
    createdAt: Timestamp;
    createdBy: string;
    tripId?: string;
  }) {
    super();

    // Basic assignment for required fields
    this.id = params.id;
    this.orgId = params.orgId;
    this.type = params.type;
    this.paxCount = params.paxCount;
    this.pickupLocation = params.pickupLocation;
    this.dropoffLocation = params.dropoffLocation;
    this.requestedWindowStart = params.requestedWindowStart;
    this.requestedWindowEnd = params.requestedWindowEnd;

    // Optional/expanded assignments
    this.confirmationNumber = params.confirmationNumber;
    this.brandCode = params.brandCode;
    this.callerPhone = params.callerPhone;
    this.passengerName = params.passengerName;
    this.passengerEmail = params.passengerEmail;
    this.passengerSmsNumber = params.passengerSmsNumber;
    this.reservationAgent = params.reservationAgent;
    this.isGroupReservation = params.isGroupReservation;
    this.groupProfile = params.groupProfile;
    this.groupContactName = params.groupContactName;
    this.groupContactPhone = params.groupContactPhone;
    this.groupContactEmail = params.groupContactEmail;
    this.direction = params.direction;
    this.airportCode = params.airportCode;
    this.charterStory = params.charterStory;
    this.flightDate = params.flightDate;
    this.airline = params.airline;
    this.flightNumber = params.flightNumber;
    this.flightCity = params.flightCity;
    this.flightTerminal = params.flightTerminal;
    this.flightScheduledTime = params.flightScheduledTime;
    this.checkedBagCount = params.checkedBagCount ?? 0;
    this.serviceExtras = params.serviceExtras ?? [];
    this.extraStops = params.extraStops ?? [];
    this.availableServiceLevels = params.availableServiceLevels;
    this.selectedServiceLevel = params.selectedServiceLevel;
    this.baseFare = params.baseFare;
    this.fareCalculationTimestamp = params.fareCalculationTimestamp;
    this.paymentInfo = params.paymentInfo;
    this.createdAt = params.createdAt;
    this.createdBy = params.createdBy;
    this.tripId = params.tripId;

    // Validate creation rules (centralized)
    // If you prefer not to validate here, move this call to a factory or repository.
    try {
      // validateReservationProps expects the expanded ReservationProps shape;
      // we pass a compatible object where possible. If your validation function
      // requires a stricter shape, adapt accordingly.
      validateReservationProps({
        id: this.id,
        callerPhone: this.callerPhone ?? "",
        passengerName: this.passengerName ?? "",
        passengerEmail: this.passengerEmail ?? "",
        passengerSmsNumber: this.passengerSmsNumber ?? "",
        reservationAgent: this.reservationAgent ?? "",
        isGroupReservation: !!this.isGroupReservation,
        groupProfile: this.groupProfile,
        direction: this.direction ?? "POINT_TO_POINT",
        airportCode: this.airportCode,
        dropoffAddress: this.dropoffLocation,
        pickupAddress: this.pickupLocation,
        charterStory: this.charterStory,
        flightDate: this.flightDate,
        airline: this.airline,
        flightNumber: this.flightNumber,
        flightCity: this.flightCity,
        flightTerminal: this.flightTerminal,
        flightScheduledTime: this.flightScheduledTime,
        passengerCount: this.paxCount,
        checkedBagCount: this.checkedBagCount,
        serviceExtras: this.serviceExtras,
        extraStops: this.extraStops,
        availableServiceLevels: this.availableServiceLevels,
        selectedServiceLevel: this.selectedServiceLevel,
        baseFare: this.baseFare,
        fareCalculationTimestamp: this.fareCalculationTimestamp,
        paymentInfo: this.paymentInfo,
        createdAt: this.createdAt,
        createdBy: this.createdBy,
        tripId: this.tripId,
        organizationId: this.orgId,
      });
    } catch (err) {
      // Re-throw validation errors so callers can handle creation failures.
      throw err;
    }

    // Emit booked event if confirmation number exists (creation persisted)
    if (this.confirmationNumber) {
      this.addEvent(
        new ReservationBookedEvent(this.id, this.confirmationNumber, this.brandCode, nowUtc())
      );
      // also emit a generic state-changed event for Booked (previous state is undefined)
      this.addEvent(new ReservationStateChangedEvent(this.id, "UNSET", this.state, nowUtc()));
    }
  }

  /* ------------------------------
     Accessors
  ------------------------------ */

  getState() {
    return this.state;
  }

  getTripId() {
    return this.tripId;
  }

  /* ------------------------------
     Lifecycle Methods (emit events)
  ------------------------------ */

  attachToTrip(tripId: string, vehicleId?: string, driverId?: string) {
    const prev = this.state;
    this.tripId = tripId;
    this.addEvent(new ReservationAssignedToTripEvent(this.id, tripId, vehicleId, driverId, nowUtc()));
    this.addEvent(new ReservationStateChangedEvent(this.id, prev, this.state, nowUtc()));
  }

  markCheckedIn(checkInLocation?: string) {
    if (this.state !== ReservationState.Booked) throw new Error("invalid transition: must be Booked");
    const prev = this.state;
    this.state = ReservationState.CheckedIn;
    this.addEvent(new ReservationStateChangedEvent(this.id, prev, this.state, nowUtc()));
    this.addEvent(new ReservationCheckedInEvent(this.id, checkInLocation, nowUtc()));
  }

  markPaxOnboard() {
    if (this.state !== ReservationState.CheckedIn) throw new Error("invalid transition: must be CheckedIn");
    const prev = this.state;
    this.state = ReservationState.PaxOnboard;
    this.addEvent(new ReservationStateChangedEvent(this.id, prev, this.state, nowUtc()));
    this.addEvent(new ReservationPaxOnboardEvent(this.id, this.tripId, nowUtc()));
  }

  markRTG(readyLocation?: string) {
    // RTG is a driver/dispatch signal; it does not necessarily change reservation state.
    this.addEvent(new ReservationRTGEvent(this.id, readyLocation, nowUtc()));
  }

  complete(actualDropoffAt?: Timestamp) {
    if (this.state !== ReservationState.PaxOnboard) throw new Error("invalid transition: must be PaxOnboard");
    const prev = this.state;
    this.state = ReservationState.Completed;
    this.addEvent(new ReservationStateChangedEvent(this.id, prev, this.state, nowUtc()));
    this.addEvent(new ReservationCompletedEvent(this.id, actualDropoffAt, this.tripId, nowUtc()));
  }

  cancel(reason?: string) {
    if (this.state === ReservationState.Completed) throw new Error("invalid transition: already Completed");
    if (this.state === ReservationState.Canceled) {
      // idempotent cancel
      return;
    }
    const prev = this.state;
    this.state = ReservationState.Canceled;
    this.addEvent(new ReservationStateChangedEvent(this.id, prev, this.state, nowUtc()));
    this.addEvent(new ReservationCanceledEvent(this.id, reason, undefined, nowUtc()));
  }

  noShow(notes?: string) {
    // Record a no-show; business rules may also cancel or apply fees elsewhere.
    this.addEvent(new ReservationNoShowEvent(this.id, notes, nowUtc()));
  }

  /* ------------------------------
     Trip Assignment / Reassignment
  ------------------------------ */

  assignToTrip(tripId: string, vehicleId?: string, driverId?: string) {
    if (this.tripId && this.tripId !== tripId) {
      const previous = this.tripId;
      this.tripId = tripId;
      this.addEvent(new ReservationReassignedEvent(this.id, previous, tripId, nowUtc()));
      this.addEvent(new ReservationAssignedToTripEvent(this.id, tripId, vehicleId, driverId, nowUtc()));
      return;
    }
    this.tripId = tripId;
    this.addEvent(new ReservationAssignedToTripEvent(this.id, tripId, vehicleId, driverId, nowUtc()));
  }

  unassignFromTrip() {
    const previous = this.tripId;
    this.tripId = undefined;
    this.addEvent(new ReservationUnassignedFromTripEvent(this.id, previous, nowUtc()));
  }

  reassignToTrip(toTripId: string, vehicleId?: string, driverId?: string) {
    const fromTripId = this.tripId;
    if (!fromTripId) {
      throw new Error("Reservation is not currently assigned to a trip");
    }
    this.tripId = toTripId;
    this.addEvent(new ReservationReassignedEvent(this.id, fromTripId, toTripId, nowUtc()));
    this.addEvent(new ReservationAssignedToTripEvent(this.id, toTripId, vehicleId, driverId, nowUtc()));
  }

  /* ------------------------------
     Payment events
  ------------------------------ */

  capturePayment(amount: number, currency?: string, paymentMethod?: string, transactionId?: string) {
    // Payment capture should be performed by a payment service; this method records the domain event.
    this.addEvent(new ReservationPaymentCapturedEvent(this.id, amount, currency, paymentMethod, transactionId, nowUtc()));
  }

  /* ------------------------------
     Operational Updates
  ------------------------------ */

  updatePaxCount(count: number) {
    if (count < 1) throw new Error("paxCount must be at least 1");
    this.paxCount = count;
  }

  updateCheckedBagCount(count: number) {
    if (count < 0) throw new Error("checked bag count cannot be negative");
    this.checkedBagCount = count;
  }

  updateFlightInfo(info: {
    flightDate?: Timestamp;
    airline?: string;
    flightNumber?: string;
    flightCity?: string;
    flightTerminal?: string;
    flightScheduledTime?: Timestamp;
  }) {
    Object.assign(this, info);
  }

  updateServiceLevel(level: ServiceLevel) {
    this.selectedServiceLevel = level;
    this.baseFare = level.baseRate;
    this.fareCalculationTimestamp = nowUtc();
  }

  updatePaymentInfo(info: PaymentInfo) {
    this.paymentInfo = info;
  }

  addExtraStop(stop: ExtraStop) {
    this.extraStops.push(stop);
  }

  removeExtraStop(index: number) {
    if (index < 0 || index >= this.extraStops.length) return;
    this.extraStops.splice(index, 1);
  }

  addServiceExtra(extra: ServiceExtra) {
    this.serviceExtras.push(extra);
  }

  removeServiceExtra(code: string) {
    this.serviceExtras = this.serviceExtras.filter(e => e.code !== code);
  }

  /* ------------------------------
     Internal Helpers
  ------------------------------ */

  private checkForCancelOrComplete(): void {
    if (this.state === ReservationState.Canceled) {
      throw new Error("Cannot modify a canceled reservation");
    }
    if (this.state === ReservationState.Completed) {
      throw new Error("Cannot modify a completed reservation");
    }
  }
}

/* ---------- Supporting Types (kept local for convenience) ---------- */

export type ServiceExtra = {
  code: string; // e.g., "LUGGAGE_MEET", "CAR_SEAT"
  description: string;
  fee: number;
};

export type ExtraStop = {
  address: string;
  name?: string;
  distanceMiles: number;
  surcharge: number;
};

export type ServiceLevel = {
  code: string; // e.g., "SEDAN", "SUV", "VAN"
  description: string;
  baseRate: number;
  capacity: number;
};
