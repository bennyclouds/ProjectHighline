export function msToPixels(ms: number, scale: number): number {
  return ms / scale;
}

export function pixelsToMs(px: number, scale: number): number {
  return px * scale;
}

export function snapToInterval(ms: number, interval: number): number {
  return Math.round(ms / interval) * interval;
}
