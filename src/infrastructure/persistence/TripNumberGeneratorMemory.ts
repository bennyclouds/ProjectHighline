// src/infrastructure/persistence/TripNumberGeneratorMemory.ts
import type { TripNumberGenerator } from "../../domain/services/TripNumberGenerator";

export class TripNumberGeneratorMemory implements TripNumberGenerator {
  private counter = 0;

  async next(): Promise<string> {
    this.counter += 1;
    return this.counter.toString().padStart(5, "0");
  }
}
