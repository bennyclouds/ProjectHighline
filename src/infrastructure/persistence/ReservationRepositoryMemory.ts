// src/infrastructure/persistence/ReservationRepositoryMemory.ts

import type { ReservationRepository } from "../../domain/repositories/ReservationRepository";
import { Reservation } from "../../reservations/Reservation";
import type { ReservationState } from "../../reservations/ReservationState";
import type { TimeWindow } from "../../shared/TimeWindow";
import type { DomainEvent } from "../../shared/DomainEvent";

export class ReservationRepositoryMemory implements ReservationRepository {
  private byId = new Map<string, any>();
  private byConfirmation = new Map<string, any>();
  private events: DomainEvent[] = [];

  async save(res: Reservation): Promise<void> {
    const snapshot = this.serialize(res);

    this.byId.set(snapshot.id, snapshot);
    if (snapshot.confirmationNumber) {
      this.byConfirmation.set(snapshot.confirmationNumber, snapshot);
    }

    const emitted = res.pullEvents();
    this.events.push(...emitted);
  }

  async getById(id: string): Promise<Reservation | undefined> {
    const snap = this.byId.get(id);
    return snap ? this.deserialize(snap) : undefined;
  }

  async getByConfirmationNumber(num: string): Promise<Reservation | undefined> {
    const snap = this.byConfirmation.get(num);
    return snap ? this.deserialize(snap) : undefined;
  }

  async findByTrip(tripId: string): Promise<Reservation[]> {
    const results: Reservation[] = [];
    for (const snap of this.byId.values()) {
      if (snap.tripId === tripId) results.push(this.deserialize(snap));
    }
    return results;
  }

  async findByState(state: ReservationState): Promise<Reservation[]> {
    const results: Reservation[] = [];
    for (const snap of this.byId.values()) {
      if (snap.state === state) results.push(this.deserialize(snap));
    }
    return results;
  }

  async findOverlapping(window: TimeWindow): Promise<Reservation[]> {
    const results: Reservation[] = [];
    for (const snap of this.byId.values()) {
      const start = snap.requestedWindowStart;
      const end = snap.requestedWindowEnd;
      if (window.overlaps({ start, end } as any)) {
        results.push(this.deserialize(snap));
      }
    }
    return results;
  }

  async all(): Promise<Reservation[]> {
    return [...this.byId.values()].map(s => this.deserialize(s));
  }

  private serialize(res: Reservation): any {
    return {
      id: res.id,
      confirmationNumber: res.confirmationNumber,
      state: res.getState(),
      tripId: (res as any).tripId,
      requestedWindowStart: res.requestedWindowStart,
      requestedWindowEnd: res.requestedWindowEnd,
    };
  }

  private deserialize(snap: any): Reservation {
    const r = new Reservation({ id: snap.id } as any);
    (r as any).confirmationNumber = snap.confirmationNumber;
    (r as any).state = snap.state;
    (r as any).tripId = snap.tripId;
    return r;
  }
}
