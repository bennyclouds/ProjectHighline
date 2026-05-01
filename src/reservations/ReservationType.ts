export const ReservationType = {
  Shared: "SHARED" as const,
  Private: "PRIVATE" as const,
};

export type ReservationType = (typeof ReservationType)[keyof typeof ReservationType];
