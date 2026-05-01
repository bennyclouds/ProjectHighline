export class TripError extends Error {
  constructor(message: string) { super(message); }
}
export class CapacityExceededError extends TripError {}
export class GroupingError extends TripError {}
export class InvalidTransitionError extends TripError {}
