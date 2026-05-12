// src/domain/repositories/DriverRepository.ts

import type { Driver } from "../../drivers/Driver";

/**
 * DriverRepository defines persistence operations for Driver entities.
 * Drivers are independently queryable and may be assigned to Trips.
 */
export interface DriverRepository {
  /**
   * Persist a Driver entity.
   */
  save(driver: Driver): Promise<void>;

  /**
   * Lookup by internal UUID.
   */
  getById(id: string): Promise<Driver | undefined>;

  /**
   * Lookup by driverNumber (internal employee ID).
   * Rarely used operationally, but needed for admin tools.
   */
  getByDriverNumber(driverNumber: string): Promise<Driver | undefined>;

  /**
   * Lookup by phone number.
   * Useful for dispatcher workflows.
   */
  getByPhone(phone: string): Promise<Driver | undefined>;

  /**
   * Return all drivers.
   */
  all(): Promise<Driver[]>;
}
