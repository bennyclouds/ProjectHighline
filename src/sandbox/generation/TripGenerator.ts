/**
 * TripGenerator.ts
 *
 * Generates synthetic trips (reservations) for sandbox simulations.
 * Uses real, USPS-compliant Chicagoland addresses from static datasets.
 *
 * Each generated trip:
 * - Represents exactly one reservation
 * - Has 1–5 passengers
 * - Has a ReservationServiceType (Private / Shared)
 * - Has a ReservationTripType (Departure, Arrival, PTP, Hourly, Charter)
 * - Uses real addresses appropriate to the trip type
 * - Is deterministic when a seed is provided
 */

import { ReservationServiceType, ReservationTripType } from "../reservations/ReservationClassification";
import { AddressRecord } from "../datasets/addresses/AddressRecord";
import { ADDRESS_DATASET } from "../../datasets/addresses";
import { v4 as uuidv4 } from "uuid";

/**
 * Output shape of a generated synthetic trip.
 * This is a draft reservation, not yet scheduled or assigned.
 */
export interface SyntheticTrip {
  id: string;

  serviceType: ReservationServiceType;
  tripType: ReservationTripType;

  passengers: number;

  pickupAddress: AddressRecord;
  dropoffAddress: AddressRecord;

  plannedStartTime: number;
  estimatedDurationMs: number;

  synthetic: true;
}

/**
 * Configuration provided by the user for trip generation.
 */
export interface TripGenerationConfig {
  totalTrips: number;

  /**
   * Trip type mix as weights.
   * Values do not need to sum to 1; they will be normalized.
   */
  tripTypeWeights: Partial<Record<ReservationTripType, number>>;

  /**
   * Optional service type mix.
   * Defaults to 100% Private if omitted.
   */
  serviceTypeWeights?: Partial<Record<ReservationServiceType, number>>;

  /**
   * Start time (UTC ms) for the first generated trip.
   */
  startTimeUtcMs: number;

  /**
   * Maximum random offset added to each trip's start time.
   * Defaults to 12 hours.
   */
  maxStartOffsetMs?: number;

  /**
   * Optional deterministic seed.
   */
  randomSeed?: number;
}

export class TripGenerator {
  private random: () => number;

  constructor(seed?: number) {
    this.random = this.createRandom(seed);
  }

  generate(config: TripGenerationConfig): SyntheticTrip[] {
    const trips: SyntheticTrip[] = [];

    const tripTypeSampler = this.createWeightedSampler(config.tripTypeWeights);
    const serviceTypeSampler = this.createWeightedSampler(
      config.serviceTypeWeights ?? { [ReservationServiceType.Private]: 1 }
    );

    const maxOffset =
      config.maxStartOffsetMs ?? 12 * 60 * 60 * 1000;

    for (let i = 0; i < config.totalTrips; i++) {
      const tripType = tripTypeSampler() as ReservationTripType;
      const serviceType = serviceTypeSampler() as ReservationServiceType;

      const passengers = this.randomInt(1, 5);

      const { pickup, dropoff } = this.selectAddresses(tripType);

      const plannedStartTime =
        config.startTimeUtcMs +
        Math.floor(this.random() * maxOffset);

      const estimatedDurationMs =
        this.estimateDuration(tripType);

      trips.push({
        id: uuidv4(),
        serviceType,
        tripType,
        passengers,
        pickupAddress: pickup,
        dropoffAddress: dropoff,
        plannedStartTime,
        estimatedDurationMs,
        synthetic: true,
      });
    }

    return trips;
  }

  // -----------------------------
  // Address selection
  // -----------------------------

  private selectAddresses(tripType: ReservationTripType): {
    pickup: AddressRecord;
    dropoff: AddressRecord;
  } {
    const airports = ADDRESS_DATASET.airports;
    const residential = ADDRESS_DATASET.residential;
    const hotels = ADDRESS_DATASET.hotels;
    const venues = ADDRESS_DATASET.venues;

    switch (tripType) {
      case ReservationTripType.Departure:
        return {
          pickup: this.pickOne([...residential, ...hotels]),
          dropoff: this.pickOne(airports),
        };

      case ReservationTripType.Arrival:
        return {
          pickup: this.pickOne(airports),
          dropoff: this.pickOne([...residential, ...hotels]),
        };

      case ReservationTripType.PTP:
        return {
          pickup: this.pickOne([...residential, ...hotels, ...venues]),
          dropoff: this.pickOne([...residential, ...hotels, ...venues]),
        };

      case ReservationTripType.Hourly: {
        const base = this.pickOne([...residential, ...hotels, ...venues]);
        return {
          pickup: base,
          dropoff: base,
        };
      }

      case ReservationTripType.Charter:
        return {
          pickup: this.pickOne([...venues, ...hotels]),
          dropoff: this.pickOne([...venues, ...hotels]),
        };

      default:
        throw new Error(`Unsupported trip type: ${tripType}`);
    }
  }

  // -----------------------------
  // Duration estimation
  // -----------------------------

  private estimateDuration(tripType: ReservationTripType): number {
    switch (tripType) {
      case ReservationTripType.Departure:
      case ReservationTripType.Arrival:
        return this.randomRange(
          45 * 60_000,
          90 * 60_000
        );

      case ReservationTripType.PTP:
        return this.randomRange(
          20 * 60_000,
          75 * 60_000
        );

      case ReservationTripType.Hourly:
        return this.randomRange(
          2 * 60 * 60_000,
          6 * 60 * 60_000
        );

      case ReservationTripType.Charter:
        return this.randomRange(
          3 * 60 * 60_000,
          10 * 60 * 60_000
        );

      default:
        return 60 * 60_000;
    }
  }

  // -----------------------------
  // Utilities
  // -----------------------------

  private pickOne<T>(items: T[]): T {
    if (items.length === 0) {
      throw new Error("Cannot pick from an empty list");
    }
    return items[Math.floor(this.random() * items.length)];
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  private randomRange(minMs: number, maxMs: number): number {
    return Math.floor(
      minMs + this.random() * (maxMs - minMs)
    );
  }

  private createWeightedSampler<T extends string>(
    weights: Partial<Record<T, number>>
  ): () => T {
    const entries = Object.entries(weights) as [T, number][];
    const total = entries.reduce((sum, [, w]) => sum + (w ?? 0), 0);

    if (total <= 0) {
      throw new Error("Weighted sampler requires at least one positive weight");
    }

    const normalized: Array<{ value: T; threshold: number }> = [];
    let cumulative = 0;

    for (const [value, weight] of entries) {
      if (!weight || weight <= 0) continue;
      cumulative += weight / total;
      normalized.push({ value, threshold: cumulative });
    }

    return () => {
      const r = this.random();
      for (const entry of normalized) {
        if (r <= entry.threshold) {
          return entry.value;
        }
      }
      return normalized[normalized.length - 1].value;
    };
  }

  private createRandom(seed?: number): () => number {
    if (seed === undefined) {
      return Math.random;
    }

    let state = seed >>> 0;

    return () => {
      // xorshift32
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return (state >>> 0) / 0xffffffff;
    };
  }
}
