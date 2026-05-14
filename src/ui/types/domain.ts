// src/ui/types/domain.ts
export type TripNumber = string; // "00001"
export type ConfirmationNumber = string; // "000001"
export type CarNumber = string; // "101"

export interface TimeWindow { start: string; end: string; } // ISO strings

export interface TripSummary {
  id: string;
  tripNumber: TripNumber;
  vehicleId: string;
  vehicleCarNumber?: CarNumber;
  driverId?: string;
  state: string;
  start: string; // ISO
  end: string;   // ISO
  reservations: string[]; // confirmationNumbers
}

export interface ReservationSummary {
  id: string;
  confirmationNumber: ConfirmationNumber;
  passengerName: string;
  pickupTime: string; // ISO
  flightStatus?: string;
  pickupLocation: string;
  dropoffLocation: string;
  state: string;
  tripId?: string;
}

export interface VehicleSummary {
  id: string;
  carNumber: CarNumber;
  plate?: string;
  make?: string;
  model?: string;
  color?: string;
  capacity?: number;
}

export interface DriverSummary {
  id: string;
  name: string;
  phone?: string;
  homeCity?: string;
  languages?: string[];
  realId?: boolean;
  chicagoLicense?: boolean;
  rating?: number;
}
