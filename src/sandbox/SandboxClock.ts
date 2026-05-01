import { Clock, Timestamp } from "./Clock";

export class SandboxClock implements Clock {
  private current: Timestamp;

  constructor(start: Timestamp) {
    this.current = start;
  }

  now(): Timestamp {
    return this.current;
  }

  advance(ms: number): void {
    this.current += ms;
  }

  set(time: Timestamp): void {
    this.current = time;
  }
}
