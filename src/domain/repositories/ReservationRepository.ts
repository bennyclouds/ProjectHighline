// src/domain/repositories/ReservationRepository.ts

import type { Reservation } from "../../reservations/Reservation";
import type { ReservationState } from "../../reservations/ReservationState";
import type { TimeWindow } from "../../shared/TimeWindow";

/**
 * ReservationRepository defines persistence operations for Reservation aggregates.
 * Reservations have sequential confirmation numbers and may be assigned to Trips.
 */
export interface ReservationRepository {
  /**
   * Persist a Reservation aggregate.
   * Stores full snapshot and collects emitted domain events.
   */
  save(reservation: Reservation): Promise<void>;

  /**
   * Lookup by internal UUID.
   */
  getById(id: string): Promise<Reservation | undefined>;

  /**
   * Lookup by dispatcher-facing confirmation number (e.g., "000217").
   */
  getByConfirmationNumber(confirmationNumber: string): Promise<Reservation | undefined>;

  /**
   * Find all reservations assigned to a specific Trip.
   */
  findByTrip(tripId: string): Promise<Reservation[]>;

  /**
   * Find all reservations in a given state.
   */
  findByState(state: ReservationState): Promise<Reservation[]>;

  /**
   * Find all reservations whose pickup/dropoff windows overlap a given time window.
   */
  findOverlapping(window: TimeWindow): Promise<Reservation[]>;

  /**
   * Return all reservations.
   */
  all(): Promise<Reservation[]>;
}
