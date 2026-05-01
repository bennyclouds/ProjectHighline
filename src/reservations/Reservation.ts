import { ReservationState } from "./ReservationState";
import { ReservationType } from "./ReservationType";
import type { Timestamp } from "../shared/Time";
import { Entity } from "@/shared/Entity";
import { nowUtc, Timestamp } from "@/shared/Time";
import { ReservationState } from "./ReservationState";
import { ReservationType } from "./ReservationType";
import {
  ReservationStateChangedEvent,
  ReservationPaxOnboardEvent,
  ReservationCheckedInEvent,
  ReservationCompletedEvent,
  ReservationCanceledEvent,
  ReservationAssignedToTripEvent,
} from "./ReservationEvents";

export class Reservation extends Entity {
  readonly id: string;
  readonly orgId?: string;
  readonly type: ReservationType;
  readonly paxCount: number;
  readonly pickupLocation: string;
  readonly dropoffLocation: string;
  readonly requestedWindowStart: Timestamp;
  readonly requestedWindowEnd: Timestamp;
  private state = ReservationState.Booked;
  private tripId?: string;

  constructor(params: {
    id: string;
    orgId?: string;
    type: ReservationType;
    paxCount: number;
    pickupLocation: string;
    dropoffLocation: string;
    requestedWindowStart: Timestamp;
    requestedWindowEnd: Timestamp;
  }) {
    super();
    this.id = params.id;
    this.orgId = params.orgId;
    this.type = params.type;
    this.paxCount = params.paxCount;
    this.pickupLocation = params.pickupLocation;
    this.dropoffLocation = params.dropoffLocation;
    this.requestedWindowStart = params.requestedWindowStart;
    this.requestedWindowEnd = params.requestedWindowEnd;
  }

  getState() { return this.state; }
  getTripId() { return this.tripId; }

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

  complete(actualDropoffAt?: Timestamp) {
    if (this.state !== ReservationState.PaxOnboard) throw new Error("invalid transition: must be PaxOnboard");
    const prev = this.state;
    this.state = ReservationState.Completed;
    this.addEvent(new ReservationStateChangedEvent(this.id, prev, this.state, nowUtc()));
    this.addEvent(new ReservationCompletedEvent(this.id, actualDropoffAt, nowUtc()));
  }

  cancel(reason?: string) {
    if (this.state === ReservationState.Completed) throw new Error("invalid transition: already Completed");
    const prev = this.state;
    this.state = ReservationState.Canceled;
    this.addEvent(new ReservationStateChangedEvent(this.id, prev, this.state, nowUtc()));
    this.addEvent(new ReservationCanceledEvent(this.id, reason, nowUtc()));
  }
}
