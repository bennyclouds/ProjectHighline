// src/infrastructure/persistence/TripRepositoryMemory.ts

import type { TripRepository } from "../../domain/repositories/TripRepository";
import { Trip } from "../../domain/Trip";
import type { TripState } from "../../domain/TripState";
import type { TimeWindow } from "../../shared/TimeWindow";
import type { DomainEvent } from "../../shared/DomainEvent";

export class TripRepositoryMemory implements TripRepository {
  private byId = new Map<string, any>();
  private byTripNumber = new Map<string, any>();
  private events: DomainEvent[] = [];

  async save(trip: Trip): Promise<void> {
    const snapshot = this.serialize(trip);

    this.byId.set(snapshot.id, snapshot);
    this.byTripNumber.set(snapshot.tripNumber, snapshot);

    const emitted = trip.pullEvents();
    this.events.push(...emitted);
  }

  async getById(id: string): Promise<Trip | undefined> {
    const snap = this.byId.get(id);
    return snap ? this.deserialize(snap) : undefined;
  }

  async getByTripNumber(tripNumber: string): Promise<Trip | undefined> {
    const snap = this.byTripNumber.get(tripNumber);
    return snap ? this.deserialize(snap) : undefined;
  }

  async findByState(state: TripState): Promise<Trip[]> {
    const results: Trip[] = [];
    for (const snap of this.byId.values()) {
      if (snap.state === state) results.push(this.deserialize(snap));
    }
    return results;
  }

  async findByVehicle(vehicleId: string): Promise<Trip[]> {
    const results: Trip[] = [];
    for (const snap of this.byId.values()) {
      if (snap.vehicleId === vehicleId) results.push(this.deserialize(snap));
    }
    return results;
  }

  async findByDriver(driverId: string): Promise<Trip[]> {
    const results: Trip[] = [];
    for (const snap of this.byId.values()) {
      if (snap.driverId === driverId) results.push(this.deserialize(snap));
    }
    return results;
  }

  async findOverlapping(window: TimeWindow): Promise<Trip[]> {
    const results: Trip[] = [];
    for (const snap of this.byId.values()) {
      const trip = this.deserialize(snap);
      const occ = trip.occupancyWindow();
      if (occ.overlaps(window)) results.push(trip);
    }
    return results;
  }

  async all(): Promise<Trip[]> {
    return [...this.byId.values()].map(s => this.deserialize(s));
  }

  private serialize(trip: Trip): any {
    return {
      id: trip.id,
      tripNumber: (trip as any).tripNumber,
      state: trip.getState(),
      vehicleId: trip.getVehicleId(),
      driverId: trip.getDriverId(),
      reservations: trip.getReservations().map(r => r.id),
      overrideRecords: [...(trip as any).overrideRecords.entries()],
    };
  }

  private deserialize(snap: any): Trip {
    const trip = new Trip(snap.id, snap.tripNumber);

    (trip as any).state = snap.state;
    (trip as any).vehicleId = snap.vehicleId;
    (trip as any).driverId = snap.driverId;
    (trip as any).reservations = [];
    (trip as any).overrideRecords = new Map(snap.overrideRecords);

    return trip;
  }
}
