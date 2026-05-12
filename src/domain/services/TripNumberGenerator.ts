// src/domain/services/TripNumberGenerator.ts
export interface TripNumberGenerator {
  next(): Promise<string>;
}
