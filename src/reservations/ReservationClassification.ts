/**
 * ReservationClassification.ts
 *
 * Contains domain-level classification enums that describe
 * how a reservation is serviced and how it behaves operationally.
 *
 * These enums are intentionally orthogonal:
 * - Service type answers "how resources are shared"
 * - Trip type answers "how the reservation behaves in time and routing"
 *
 * No business logic should live in this file.
 */

/**
 * ReservationServiceType
 *
 * Describes whether the reservation exclusively consumes a vehicle
 * or may be grouped with other reservations.
 *
 * - Private: vehicle is dedicated to a single reservation
 * - Shared: reservation may coexist with others on the same vehicle
 */
export const ReservationServiceType = {
  Private: "PRIVATE",
  Shared: "SHARED",
} as const;

export type ReservationServiceType = typeof ReservationServiceType[keyof typeof ReservationServiceType];

/**
 * ReservationTripType
 *
 * Describes the operational nature of the trip.
 * This affects timing rules, buffers, routing logic,
 * and eventually pricing and simulation behavior.
 */
export const ReservationTripType = {
  /**
   * Passenger is being transported TO an airport
   * for a departing flight.
   */
  Departure: "DEPARTURE",

  /**
   * Passenger is being picked up FROM an airport
   * after an arriving flight.
   */
  Arrival: "ARRIVAL",

  /**
   * Point-to-point transportation with no airport semantics.
   */
  PTP: "PTP",

  /**
   * Time-based service where vehicle and driver
   * are reserved for a duration rather than a route.
   */
  Hourly: "HOURLY",

  /**
   * Extended or special service, possibly spanning
   * multiple hours or days, with bespoke rules.
   */
  Charter: "CHARTER",
} as const;

export type ReservationTripType = typeof ReservationTripType[keyof typeof ReservationTripType];
