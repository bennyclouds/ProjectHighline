// src/reservations/services/ReservationNumberGenerator.ts

export interface ReservationNumberGenerator {
  next(): Promise<string>;
}
