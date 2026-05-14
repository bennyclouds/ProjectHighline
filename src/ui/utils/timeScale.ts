// src/ui/utils/timeScale.ts

export interface TimeRange {
  start: string; // ISO
  end: string;   // ISO
}

/**
 * Converts an ISO timestamp into an X pixel coordinate.
 * 
 * @param iso - ISO timestamp
 * @param range - visible time window
 * @param zoom - zoom level (0–4)
 */
export function timeToX(
  iso: string,
  range: TimeRange,
  zoom: number
): number {
  const start = new Date(range.start).getTime();
  const end = new Date(range.end).getTime();
  const t = new Date(iso).getTime();

  const totalMs = end - start;
  const offsetMs = t - start;

  if (offsetMs <= 0) return 0;
  if (offsetMs >= totalMs) return totalMsToPixels(totalMs, zoom);

  return totalMsToPixels(offsetMs, zoom);
}

/**
 * Converts an X pixel coordinate back into an ISO timestamp.
 */
export function xToTime(
  x: number,
  range: TimeRange,
  zoom: number
): string {
  const start = new Date(range.start).getTime();
  const end = new Date(range.end).getTime();
  const totalMs = end - start;

  const ms = pixelsToMs(x, zoom);
  const clamped = Math.max(0, Math.min(ms, totalMs));

  return new Date(start + clamped).toISOString();
}

/**
 * Internal helpers
 */
function totalMsToPixels(ms: number, zoom: number): number {
  // Base scale: 1 hour = 200px at zoom 1
  const basePxPerMs = 200 / (60 * 60 * 1000);
  const zoomFactor = 1 + zoom * 0.5; // zoom 0–4 → 1x to 3x
  return ms * basePxPerMs * zoomFactor;
}

function pixelsToMs(px: number, zoom: number): number {
  const baseMsPerPx = (60 * 60 * 1000) / 200;
  const zoomFactor = 1 + zoom * 0.5;
  return px * baseMsPerPx / zoomFactor;
}
