// src/ui/utils/timeScale.ts
import type { TimeRange } from "../types/ui";

export function toCentralTime(date: Date): Date {
  // Convert from local time to America/Chicago
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  // Chicago offset varies with DST; use Intl for correctness
  const central = new Date(
    utc +
      new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago",
      })
  );
  return central;
}

export function timeToX(
  iso: string,
  range: TimeRange,
  zoom: number
): number {
  const t = new Date(iso).getTime();
  const start = new Date(range.start).getTime();
  const diffMs = t - start;
  const pxPerMs = zoom / 60000; // zoom = px per minute
  return diffMs * pxPerMs;
}

export function xToTime(
  x: number,
  range: TimeRange,
  zoom: number
): string {
  const start = new Date(range.start).getTime();
  const ms = x / (zoom / 60000);
  return new Date(start + ms).toISOString();
}

export function generateTicks(
  range: TimeRange,
  zoom: number
): { x: number; label: string }[] {
  const ticks: { x: number; label: string }[] = [];

  const start = new Date(range.start).getTime();
  const end = new Date(range.end).getTime();

  // Tick every 30 minutes at low zoom, 15 minutes at high zoom
  const intervalMs = zoom >= 4 ? 15 * 60000 : 30 * 60000;

  for (let t = start; t <= end; t += intervalMs) {
    const date = new Date(t);
    const central = new Date(
      date.toLocaleString("en-US", { timeZone: "America/Chicago" })
    );

    const label = central
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/^0/, "");

    ticks.push({
      x: timeToX(date.toISOString(), range, zoom),
      label,
    });
  }

  return ticks;
}
