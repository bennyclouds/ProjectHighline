// src/fare/FareEngine.ts
import type { Timestamp } from "../shared/Time";

export type FareReservationInput = {
  direction?: "ARRIVAL" | "DEPARTURE" | "POINT_TO_POINT" | "HOURLY" | "CHARTER";
  airportCode?: string;
  flightTerminal?: string | undefined;
  checkedBagCount?: number;
  extraStopsCount?: number;
  requestedHours?: number;
  includeGratuity?: boolean;
};

export const ServiceType = {
  ArrivalOrDeparture: "ARRIVAL_DEPARTURE",
  PointToPoint: "POINT_TO_POINT",
  Hourly: "HOURLY",
  Charter: "CHARTER",
} as const;
export type ServiceTypeKey = (typeof ServiceType)[keyof typeof ServiceType];

export type FareBreakdown = {
  serviceType: ServiceTypeKey;
  description: string;
  baseFare: number;
  distanceMiles?: number;
  mileageCharge?: number;
  hours?: number;
  hourlyCharge?: number;
  luggageFee: number;
  extraStopsFee: number;
  fuelCharge: number;
  stampFee: number;
  gratuityAmount?: number;
  subtotal: number;
  total: number;
  currency: string;
};

/* Config */
const BASE_ARRIVAL_DEPARTURE = 88;
const BASE_PTP = 78;
const PTP_PER_MILE = 2.5;
const HOURLY_RATE = 200;
const HOURLY_MIN_HOURS = 2;
const CHARTER_MIN_HOURS = 6;
const FUEL_FLAT_DEFAULT = 5;
const LUGGAGE_FEE_PER_ITEM = 5;
const EXTRA_STOP_FEE = 8;
const DEFAULT_CURRENCY = "USD";
const MINIMUM_FARE = 81;

/* ORD stamp map per your rule */
const OHARE_STAMP_BY_TERMINAL: Record<string, number> = {
  "1": 4,
  "2": 4,
  "3": 4,
  "5": 6,
  A: 4,
  B: 4,
  C: 4,
  D: 6,
  E: 6,
};

/* Distance service interface (pure contract) */
export type DistanceResult = { distanceMiles: number; durationMinutes?: number };
export interface DistanceService {
  /* returns distance between origin and destination */
  computeDistance(origin: string, destination: string): Promise<DistanceResult>;
}

/* Simple mock for tests (deterministic) */
export class MockDistanceService implements DistanceService {
  async computeDistance(origin: string, destination: string): Promise<DistanceResult> {
    // deterministic placeholder: Haversine or simple lookup could be used in tests
    // For now return a fixed value for unit tests
    return { distanceMiles: 10, durationMinutes: 20 };
  }
}

/* Pure fare computation that accepts a distance value (caller may use DistanceService) */
export function computeFares(
  r: FareReservationInput,
  distanceMiles: number,
  opts?: { fuelFlat?: number; fuelPercent?: number; gratuityPercent?: number; currency?: string }
): FareBreakdown[] {
  const currency = opts?.currency ?? DEFAULT_CURRENCY;
  const fuelFlat = opts?.fuelFlat ?? FUEL_FLAT_DEFAULT;
  const fuelPercent = opts?.fuelPercent;
  const gratuityPercent = opts?.gratuityPercent;

  const luggageFee = (r.checkedBagCount ?? 0) * LUGGAGE_FEE_PER_ITEM;
  const extraStopsFee = (r.extraStopsCount ?? 0) * EXTRA_STOP_FEE;

  let stampFee = 0;
  if ((r.airportCode ?? "").toUpperCase() === "ORD" && r.flightTerminal) {
    const t = String(r.flightTerminal).toUpperCase();
    stampFee = OHARE_STAMP_BY_TERMINAL[t] ?? 0;
  }

  const results: FareBreakdown[] = [];

  if (!r.direction || r.direction === "ARRIVAL" || r.direction === "DEPARTURE") {
    const baseFare = BASE_ARRIVAL_DEPARTURE;
    const subtotalBeforeFuel = baseFare + luggageFee + extraStopsFee + stampFee;
    const fuelCharge = fuelPercent ? subtotalBeforeFuel * (fuelPercent / 100) : fuelFlat;
    const subtotal = subtotalBeforeFuel + fuelCharge;
    const gratuityAmount = gratuityPercent ? subtotal * (gratuityPercent / 100) : 0;
    const total = Math.max(subtotal + (r.includeGratuity ? gratuityAmount : 0), MINIMUM_FARE);

    results.push({
      serviceType: ServiceType.ArrivalOrDeparture,
      description: "Arrival or departure transfer (flat Chicagoland rate)",
      baseFare,
      luggageFee,
      extraStopsFee,
      fuelCharge,
      stampFee,
      gratuityAmount: r.includeGratuity ? gratuityAmount : undefined,
      subtotal,
      total,
      currency,
    });
  }

  if (!r.direction || r.direction === "POINT_TO_POINT") {
    const baseFare = BASE_PTP;
    const mileageCharge = PTP_PER_MILE * distanceMiles;
    const subtotalBeforeFuel = baseFare + mileageCharge + luggageFee + extraStopsFee + stampFee;
    const fuelCharge = fuelPercent ? subtotalBeforeFuel * (fuelPercent / 100) : fuelFlat;
    const subtotal = subtotalBeforeFuel + fuelCharge;
    const gratuityAmount = gratuityPercent ? subtotal * (gratuityPercent / 100) : 0;
    const total = Math.max(subtotal + (r.includeGratuity ? gratuityAmount : 0), MINIMUM_FARE);

    results.push({
      serviceType: ServiceType.PointToPoint,
      description: "Point-to-point transfer",
      baseFare,
      distanceMiles,
      mileageCharge,
      luggageFee,
      extraStopsFee,
      fuelCharge,
      stampFee,
      gratuityAmount: r.includeGratuity ? gratuityAmount : undefined,
      subtotal,
      total,
      currency,
    });
  }

  if (!r.direction || r.direction === "HOURLY") {
    const requestedHours = Math.max(r.requestedHours ?? HOURLY_MIN_HOURS, HOURLY_MIN_HOURS);
    const hourlyCharge = HOURLY_RATE * requestedHours;
    const subtotalBeforeFuel = hourlyCharge + luggageFee + extraStopsFee + stampFee;
    const fuelCharge = fuelPercent ? subtotalBeforeFuel * (fuelPercent / 100) : fuelFlat;
    const subtotal = subtotalBeforeFuel + fuelCharge;
    const gratuityAmount = gratuityPercent ? subtotal * (gratuityPercent / 100) : 0;
    const total = Math.max(subtotal + (r.includeGratuity ? gratuityAmount : 0), MINIMUM_FARE);

    results.push({
      serviceType: ServiceType.Hourly,
      description: `Hourly service (${requestedHours}h, ${HOURLY_MIN_HOURS}h min)`,
      baseFare: hourlyCharge,
      hours: requestedHours,
      hourlyCharge,
      luggageFee,
      extraStopsFee,
      fuelCharge,
      stampFee,
      gratuityAmount: r.includeGratuity ? gratuityAmount : undefined,
      subtotal,
      total,
      currency,
    });
  }

  if (!r.direction || r.direction === "CHARTER") {
    const requestedHours = Math.max(r.requestedHours ?? CHARTER_MIN_HOURS, CHARTER_MIN_HOURS);
    const hourlyCharge = HOURLY_RATE * requestedHours;
    const subtotalBeforeFuel = hourlyCharge + luggageFee + extraStopsFee + stampFee;
    const fuelCharge = fuelPercent ? subtotalBeforeFuel * (fuelPercent / 100) : fuelFlat;
    const subtotal = subtotalBeforeFuel + fuelCharge;
    const gratuityAmount = gratuityPercent ? subtotal * (gratuityPercent / 100) : 0;
    const total = Math.max(subtotal + (r.includeGratuity ? gratuityAmount : 0), MINIMUM_FARE);

    results.push({
      serviceType: ServiceType.Charter,
      description: `Charter service (${requestedHours}h, ${CHARTER_MIN_HOURS}h min)`,
      baseFare: hourlyCharge,
      hours: requestedHours,
      hourlyCharge,
      luggageFee,
      extraStopsFee,
      fuelCharge,
      stampFee,
      gratuityAmount: r.includeGratuity ? gratuityAmount : undefined,
      subtotal,
      total,
      currency,
    });
  }

  return results;
}
