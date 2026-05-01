export const TripState = {
  Draft: "DRAFT" as const,
  Ready: "READY" as const,
  Assigned: "ASSIGNED" as const,
  EnRoute: "EN_ROUTE" as const,
  InProgress: "IN_PROGRESS" as const,
  Completed: "COMPLETED" as const,
  Canceled: "CANCELED" as const,
};

export type TripState = typeof TripState[keyof typeof TripState];
