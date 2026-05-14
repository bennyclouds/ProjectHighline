// src/ui/services/api.ts
//
// UI → Tauri backend boundary.
// Every function here calls a Tauri command implemented in commands.rs.

import { invoke } from "src-tauri/src/summaries";

import type {
  TripSummary,
  ReservationSummary,
  VehicleSummary,
  DriverSummary,
} from "../types/domain";

// ---------------------------------------------------------
// Trips
// ---------------------------------------------------------

export async function fetchTrips(params: {
  start: string;
  end: string;
}): Promise<TripSummary[]> {
  return await invoke("fetch_trips", params);
}

export async function fetchTripByNumber(
  tripNumber: string
): Promise<TripSummary | null> {
  return await invoke("fetch_trip_by_number", { tripNumber });
}

export async function createTripAssignAndAddReservations(payload: {
  confirmationNumbers: string[];
  carNumber: string;
  driverId: string;
}): Promise<{ tripNumber: string }> {
  return await invoke("create_trip_assign_and_add_reservations", payload);
}

export async function assignReservationToTrip(payload: {
  confirmationNumber: string;
  tripNumber: string;
}): Promise<void> {
  return await invoke("assign_reservation_to_trip", payload);
}

// ---------------------------------------------------------
// Reservations
// ---------------------------------------------------------

export async function fetchUnassignedReservations(): Promise<
  ReservationSummary[]
> {
  return await invoke("fetch_unassigned_reservations");
}

export async function fetchReservationByConfirmation(
  confirmationNumber: string
): Promise<ReservationSummary | null> {
  return await invoke("fetch_reservation_by_confirmation", {
    confirmationNumber,
  });
}

// ---------------------------------------------------------
// Vehicles
// ---------------------------------------------------------

export async function fetchVehicles(): Promise<VehicleSummary[]> {
  return await invoke("fetch_vehicles");
}

export async function fetchVehicleByCarNumber(
  carNumber: string
): Promise<VehicleSummary | null> {
  return await invoke("fetch_vehicle_by_car_number", { carNumber });
}

// ---------------------------------------------------------
// Drivers
// ---------------------------------------------------------

export async function fetchDrivers(): Promise<DriverSummary[]> {
  return await invoke("fetch_drivers");
}

export async function fetchDriverById(
  driverId: string
): Promise<DriverSummary | null> {
  return await invoke("fetch_driver_by_id", { driverId });
}

// ---------------------------------------------------------
// Utility
// ---------------------------------------------------------

export async function ping(): Promise<string> {
  return await invoke("ping");
}
