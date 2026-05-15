import { invoke } from "@tauri-apps/api/core";
import type {
  TripSummary,
  ReservationSummary,
  VehicleSummary,
  DriverSummary,
} from "../types/domain";

export async function getAllTrips(): Promise<TripSummary[]> {
  return invoke("get_all_trips");
}

export async function getAllReservations(): Promise<ReservationSummary[]> {
  return invoke("get_all_reservations");
}

export async function getAllVehicles(): Promise<VehicleSummary[]> {
  return invoke("get_all_vehicles");
}

export async function getAllDrivers(): Promise<DriverSummary[]> {
  return invoke("get_all_drivers");
}

export async function createReservation(payload: {
  passengerName: string;
  pickupTimeMs: number;
  pickupLocation: string;
  dropoffLocation: string;
}): Promise<ReservationSummary> {
  return invoke("create_reservation", payload);
}

export async function createTrip(): Promise<TripSummary> {
  return invoke("create_trip");
}

export async function addReservationToTrip(payload: {
  confirmationNumber: string;
  tripNumber: string;
}): Promise<void> {
  return invoke("add_reservation_to_trip", payload);
}

export async function assignTrip(payload: {
  tripNumber: string;
  carNumber: string;
  driverId: string;
}): Promise<void> {
  return invoke("assign_trip", payload);
}

export async function markReservationPaxOnboard(payload: {
  confirmationNumber: string;
}): Promise<void> {
  return invoke("mark_reservation_pax_onboard", payload);
}

export async function completeTrip(payload: {
  tripNumber: string;
}): Promise<void> {
  return invoke("complete_trip", payload);
}
