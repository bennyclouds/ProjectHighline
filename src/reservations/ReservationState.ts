// src/reservations/ReservationState.ts
export const ReservationState = {
  Booked: "BOOKED",
  CheckedIn: "CHECKED_IN",
  PaxOnboard: "PAX_ONBOARD",
  Completed: "COMPLETED",
  Canceled: "CANCELED",
} as const;