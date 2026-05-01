// src/shared/Time.ts
/**
 * All domain timestamps are UTC epoch milliseconds.
 * All timezone logic to be handled with API and UI.
 */

export type Timestamp = number;

/** Return current time as UTC epoch milliseconds. */
export function nowUtc(): Timestamp {
  return Date.now();
}

/** Convert a Date or ISO string to a Timestamp (UTC). */
export function toTimestamp(input: Date | string): Timestamp {
  if (input instanceof Date) return input.getTime();
  const parsed = Date.parse(input);
  if (Number.isNaN(parsed)) throw new Error(`Invalid ISO date string: ${input}`);
  return parsed;
}

/** Convert a Timestamp to a JS Date (UTC). */
export function toDate(ts: Timestamp): Date {
  return new Date(ts);
}

/** Convert a Timestamp to an ISO 8601 string in UTC. */
export function toIso(ts: Timestamp): string {
  return new Date(ts).toISOString();
}

/** Parse an ISO 8601 string to a Timestamp (UTC). Alias for toTimestamp when input is string. */
export function parseIsoToTimestamp(iso: string): Timestamp {
  return toTimestamp(iso);
}

/** Add milliseconds to a Timestamp and return a new Timestamp. */
export function addMs(ts: Timestamp, ms: number): Timestamp {
  return ts + ms;
}

/** Add minutes to a Timestamp. */
export function addMinutes(ts: Timestamp, minutes: number): Timestamp {
  return addMs(ts, minutes * 60_000);
}

/** Add hours to a Timestamp. */
export function addHours(ts: Timestamp, hours: number): Timestamp {
  return addMs(ts, hours * 3_600_000);
}

/** Subtract milliseconds from a Timestamp. */
export function subMs(ts: Timestamp, ms: number): Timestamp {
  return ts - ms;
}

/** Duration helpers */
export function durationMs(start: Timestamp, end: Timestamp): number {
  return end - start;
}

/** Human-friendly duration string (e.g., "1h 23m") for debugging/logs only. */
export function formatDurationHuman(ms: number): string {
  const abs = Math.abs(ms);
  const hours = Math.floor(abs / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const seconds = Math.floor((abs % 60_000) / 1000);
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (!hours && seconds) parts.push(`${seconds}s`);
  return parts.join(" ") || "0s";
}
