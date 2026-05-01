import type { Timestamp } from "../shared/Time";

/**
 * Closed-open time interval [start, end)
 * Used for availability and conflict math.
 */
export class TimeWindow {
  readonly start: Timestamp;
  readonly end: Timestamp;

  constructor(start: Timestamp, end: Timestamp) {
    if (end <= start) {
      throw new Error(`Invalid TimeWindow: end <= start (${start} → ${end})`);
    }
    this.start = start;
    this.end = end;
  }

  overlaps(other: TimeWindow): boolean {
    return this.start < other.end && other.start < this.end;
  }

  contains(moment: Timestamp): boolean {
    return moment >= this.start && moment < this.end;
  }

  durationMs(): number {
    return this.end - this.start;
  }

  /**
   * Merge two overlapping or adjacent windows into a single window.
   * Errors if windows are disjoint.
   */
  static merge(a: TimeWindow, b: TimeWindow): TimeWindow {
    if (!a.overlaps(b) && a.end !== b.start && b.end !== a.start) {
      throw new Error("Cannot merge disjoint TimeWindows");
    }
    const start = Math.min(a.start, b.start);
    const end = Math.max(a.end, b.end);
    return new TimeWindow(start, end);
  }
}
