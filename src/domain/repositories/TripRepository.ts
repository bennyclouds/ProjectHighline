// src/domain/repositories/TripRepository.ts

import type { Trip } from "../Trip";
import type { TripState } from "../TripState";
import type { TimeWindow } from "../../shared/TimeWindow";

/**
 * TripRepository defines all persistence operations for Trip aggregates.
 * 
 * Trips are primarily identified by their sequential 5‑digit tripNumber,
 * which is the dispatcher-facing operational identifier.
 * 
 * The internal UUID `id` remains supported for internal references,
 * but tripNumber is the main lookup key for UI and dispatcher workflows.
 */
export interface TripRepository {
  /**
   * Persist a Trip aggregate.
   * This stores the full snapshot and collects emitted domain events.
   */
  save(trip: Trip): Promise<void>;

  /**
   * Lookup by internal UUID.
   * Rarely used in dispatcher workflows.
   */
  getById(id: string): Promise<Trip | undefined>;

  /**
   * Lookup by dispatcher-facing trip number (e.g., "04217").
   * This is the primary lookup method for operational use.
   */
  getByTripNumber(tripNumber: string): Promise<Trip | undefined>;

  /**
   * Find all trips currently in a given state.
   * Useful for dispatcher dashboards.
   */
  findByState(state: TripState): Promise<Trip[]>;

  /**
   * Find all trips assigned to a specific vehicle.
   * Vehicle is identified by its internal vehicleId.
   */
  findByVehicle(vehicleId: string): Promise<Trip[]>;

  /**
   * Find all trips assigned to a specific driver.
   * Driver is identified by its internal driverId.
   */
  findByDriver(driverId: string): Promise<Trip[]>;

  /**
   * Find all trips whose occupancy windows overlap a given time window.
   * Used for conflict detection and scheduling.
   */
  findOverlapping(window: TimeWindow): Promise<Trip[]>;

  /**
   * Return all trips in the system.
   * Useful for admin tools and debugging.
   */
  all(): Promise<Trip[]>;
}
