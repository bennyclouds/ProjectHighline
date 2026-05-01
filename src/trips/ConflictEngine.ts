import { Trip } from "./Trip";
import { TimeWindow } from "../shared/TimeWindow";

export type ConflictReason = "VEHICLE_UNAVAILABLE" | "CAPACITY_EXCEEDED" | "TIME_OVERLAP" | "DRIVER_STATUS";

export function detectConflicts(
  tripWindow: TimeWindow,
  vehicleOccupancies: TimeWindow[],
  driverOccupancies: TimeWindow[],
  vehicleStatus: string,
  driverStatus: string,
  vehicleCapacity: number,
  tripPax: number
): ConflictReason[] {
  const conflicts: ConflictReason[] = [];
  if (tripPax > vehicleCapacity) conflicts.push("CAPACITY_EXCEEDED");
  if (vehicleStatus === "UNAVAILABLE" || vehicleStatus === "MAINTENANCE") conflicts.push("VEHICLE_UNAVAILABLE");
  if (driverStatus === "OFF_DUTY" || driverStatus === "UNAVAILABLE") conflicts.push("DRIVER_STATUS");
  for (const w of vehicleOccupancies) if (w.overlaps(tripWindow)) conflicts.push("TIME_OVERLAP");
  for (const w of driverOccupancies) if (w.overlaps(tripWindow)) conflicts.push("TIME_OVERLAP");
  return Array.from(new Set(conflicts));
}
