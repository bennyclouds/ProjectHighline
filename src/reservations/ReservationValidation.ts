// src/reservations/ReservationValidation.ts

export interface ReservationValidationInput {
  id: string;
  callerPhone: string;
  passengerName: string;
  passengerEmail: string;
  passengerSmsNumber: string;
  reservationAgent: string;

  isGroupReservation: boolean;
  groupProfile?: any;

  direction: string;
  airportCode?: string;

  pickupAddress: string;
  dropoffAddress: string;

  charterStory?: string;
  flightDate?: number;
  airline?: string;
  flightNumber?: string;
  flightCity?: string;
  flightTerminal?: string;
  flightScheduledTime?: number;

  passengerCount: number;
  checkedBagCount: number;

  serviceExtras?: any[];
  extraStops?: any[];

  availableServiceLevels?: any[];
  selectedServiceLevel?: any;

  baseFare?: number;
  fareCalculationTimestamp?: number;

  paymentInfo?: any;

  createdAt: number;
  createdBy: string;
  tripId?: string;
  organizationId?: string;
}

export function validateReservationProps(input: ReservationValidationInput): void {
  if (!input.id) throw new Error("Reservation must have an id");
  if (!input.pickupAddress) throw new Error("pickupAddress is required");
  if (!input.dropoffAddress) throw new Error("dropoffAddress is required");
  if (input.passengerCount < 1) throw new Error("passengerCount must be >= 1");
  if (input.passengerCount > 5) throw new Error("passengerCount must be <= 5");
  if (input.checkedBagCount < 0) throw new Error("checkedBagCount cannot be negative");

  // Optional: validate email format
  if (input.passengerEmail && !input.passengerEmail.includes("@")) {
    throw new Error("Invalid passengerEmail");
  }

  if (input.callerPhone && !isValidPhone(input.callerPhone)) {
  throw new Error("Invalid callerPhone format");
}

if (input.passengerSmsNumber && !isValidPhone(input.passengerSmsNumber)) {
  throw new Error("Invalid passengerSmsNumber format");
}

  // Validate phone
  // Accepts international, WhatsApp, and US formats
function isValidPhone(input: string): boolean {
  if (!input) return false;

  // Strip common formatting
  const cleaned = input
    .replace(/[\s\-().]/g, "")
    .replace(/ext/gi, "")
    .replace(/x/gi, "");

  // Must contain at least one digit
  if (!/\d/.test(cleaned)) return false;

  // Allow leading + for international/E.164
  if (!/^\+?\d{6,20}$/.test(cleaned)) return false;

  return true;
}
}
