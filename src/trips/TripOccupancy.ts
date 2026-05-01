import { TimeWindow } from "../shared/TimeWindow";
import { Reservation } from "../reservations/Reservation";

export function mergedOccupancy(reservations: Reservation[], preBufferMs = 0, postBufferMs = 0): TimeWindow {
  if (reservations.length === 0) throw new Error("no reservations");
  const windows = reservations.map(r => new TimeWindow(r.requestedWindowStart - preBufferMs, r.requestedWindowEnd + postBufferMs));
  const start = Math.min(...windows.map(w => w.start));
  const end = Math.max(...windows.map(w => w.end));
  return new TimeWindow(start, end);
}
