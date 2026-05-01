import { Clock, Timestamp } from "./Clock";

export class SystemClock implements Clock {
  now(): Timestamp {
    return Date.now();
  }
}
