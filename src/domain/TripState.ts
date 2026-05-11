// src/domain/TripState.ts
export type TripState = "READY" | "ASSIGNED" | "EN_ROUTE" | "COMPLETED" | "CANCELED";

export const TripState = {
  Draft: "DRAFT" as TripState,
  Ready: "READY" as TripState,
  Assigned: "ASSIGNED" as TripState,
  InProgress: "IN_PROGRESS" as TripState,
  EnRoute: "EN_ROUTE" as TripState,
  Completed: "COMPLETED" as TripState,
  Canceled: "CANCELED" as TripState,
};
