// src/infrastructure/persistence/VehicleRepositoryMemory.ts

import type { VehicleRepository } from "../../domain/repositories/VehicleRepository";
import { Vehicle } from "../../vehicles/Vehicle";

export class VehicleRepositoryMemory implements VehicleRepository {
  private byId = new Map<string, any>();
  private byCarNumber = new Map<string, any>();
  private byPlate = new Map<string, any>();

  async save(vehicle: Vehicle): Promise<void> {
    const snap = this.serialize(vehicle);

    this.byId.set(snap.id, snap);
    this.byCarNumber.set(snap.carNumber, snap);
    this.byPlate.set(snap.plate, snap);
  }

  async getById(id: string): Promise<Vehicle | undefined> {
    const snap = this.byId.get(id);
    return snap ? this.deserialize(snap) : undefined;
  }

  async getByCarNumber(carNumber: string): Promise<Vehicle | undefined> {
    const snap = this.byCarNumber.get(carNumber);
    return snap ? this.deserialize(snap) : undefined;
  }

  async getByPlate(plate: string): Promise<Vehicle | undefined> {
    const snap = this.byPlate.get(plate);
    return snap ? this.deserialize(snap) : undefined;
  }

  async all(): Promise<Vehicle[]> {
    return [...this.byId.values()].map(s => this.deserialize(s));
  }

  private serialize(v: Vehicle): any {
    return {
      id: v.id,
      carNumber: (v as any).carNumber,
      plate: v.plate,
      make: (v as any).make,
      model: (v as any).model,
      color: (v as any).color,
      capacity: (v as any).capacity,
    };
  }

  private deserialize(snap: any): Vehicle {
    const v = new Vehicle(snap.id, snap.plate, snap.make, snap.model, snap.color, snap.capacity);
    (v as any).carNumber = snap.carNumber;
    return v;
  }
}
