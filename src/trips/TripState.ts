export const TripState = {
  Ready: "READY" as const,
  Assigned: "ASSIGNED" as const,
  EnRoute: "EN_ROUTE" as const,
  OnLocation: "ON_LOCATION" as const,
  InMotion: "IN_MOTION" as const,
  TripEnded: "TRIP_ENDED" as const,
};

export type TripState = typeof TripState[keyof typeof TripState];
