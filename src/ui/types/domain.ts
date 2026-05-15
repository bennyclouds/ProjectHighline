export interface ReservationSummary {
  id: string;
  confirmationNumber: string;
  passengerName: string;
  pickupTimeMs: number;
  pickupTimeIso: string;
  pickupLocation: string;
  dropoffLocation: string;
  state: string;
  tripId: string | null;
}

export interface TripReservationSummary {
  id: string;
  confirmationNumber: string;
}

export interface TripSummary {
  id: string;
  tripNumber: string;
  vehicleId: string;
  driverId: string | null;
  state: string;
  startMs: number;
  endMs: number;
  startIso: string;
  endIso: string;
  reservations: TripReservationSummary[];
}

export interface VehicleSummary {
  id: string;
  carNumber: string;
  plate: string;
  make: string;
  model: string;
  color: string;
  capacity: number;
}

export interface DriverSummary {
  id: string;
  name: string;
  phone: string | null;
  homeCity: string | null;
  languages: string[];
  realId: boolean;
  chicagoLicense: boolean;
  rating: number | null;
}
