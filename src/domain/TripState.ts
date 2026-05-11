// src/domain/TripState.ts
export type TripState = "READY" | "ASSIGNED" | "EN_ROUTE" | "COMPLETED" | "CANCELED";

export const TripState = {
  READY: "READY" as TripState,
  ASSIGNED: "ASSIGNED" as TripState,
  EN_ROUTE: "EN_ROUTE" as TripState,
  COMPLETED: "COMPLETED" as TripState,
  CANCELED: "CANCELED" as TripState,
};
