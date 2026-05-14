// src/infrastructure/persistence/ReservationNumberGeneratorMemory.ts

import type { ReservationNumberGenerator } from "../domain/services/ReservationNumberGenerator";

export class ReservationNumberGeneratorMemory implements ReservationNumberGenerator {
  private counter = 0;

  async next(): Promise<string> {
    this.counter += 1;
    return this.counter.toString().padStart(6, "0");
  }
}
