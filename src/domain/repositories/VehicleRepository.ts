// src/domain/repositories/VehicleRepository.ts

import type { Vehicle } from "../../vehicles/Vehicle";

/**
 * VehicleRepository defines persistence operations for Vehicle entities.
 * Vehicles are referenced operationally by their carNumber.
 */
export interface VehicleRepository {
  /**
   * Persist a Vehicle entity.
   */
  save(vehicle: Vehicle): Promise<void>;

  /**
   * Lookup by internal UUID.
   */
  getById(id: string): Promise<Vehicle | undefined>;

  /**
   * Lookup by dispatcher-facing carNumber.
   */
  getByCarNumber(carNumber: string): Promise<Vehicle | undefined>;

  /**
   * Lookup by license plate.
   */
  getByPlate(plate: string): Promise<Vehicle | undefined>;

  /**
   * Return all vehicles.
   */
  all(): Promise<Vehicle[]>;
}
