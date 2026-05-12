// src/infrastructure/persistence/DriverRepositoryMemory.ts

import type { DriverRepository } from "../../domain/repositories/DriverRepository";
import { Driver } from "../../drivers/Driver";

export class DriverRepositoryMemory implements DriverRepository {
  private byId = new Map<string, any>();
  private byDriverNumber = new Map<string, any>();
  private byPhone = new Map<string, any>();

  async save(driver: Driver): Promise<void> {
    const snap = this.serialize(driver);

    this.byId.set(snap.id, snap);
    if (snap.driverNumber) this.byDriverNumber.set(snap.driverNumber, snap);
    if (snap.phone) this.byPhone.set(snap.phone, snap);
  }

  async getById(id: string): Promise<Driver | undefined> {
    const snap = this.byId.get(id);
    return snap ? this.deserialize(snap) : undefined;
  }

  async getByDriverNumber(driverNumber: string): Promise<Driver | undefined> {
    const snap = this.byDriverNumber.get(driverNumber);
    return snap ? this.deserialize(snap) : undefined;
  }

  async getByPhone(phone: string): Promise<Driver | undefined> {
    const snap = this.byPhone.get(phone);
    return snap ? this.deserialize(snap) : undefined;
  }

  async all(): Promise<Driver[]> {
    return [...this.byId.values()].map(s => this.deserialize(s));
  }

  private serialize(d: Driver): any {
    return {
      id: d.id,
      name: d.name,
      phone: d.phone,
      driverNumber: d.driverNumber,
      realId: d.realId,
      address: d.address,
      rating: d.rating,
    };
  }

  private deserialize(snap: any): Driver {
    const d = new Driver(snap.id, snap.name);
    d.phone = snap.phone;
    d.driverNumber = snap.driverNumber;
    d.realId = snap.realId;
    d.address = snap.address;
    d.rating = snap.rating;
    return d;
  }
}
