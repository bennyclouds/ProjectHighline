export interface SyntheticJobProfile {
  pickupZones: string[];
  dropoffZones: string[];
  vehicleTypeWeights: Record<string, number>;
  averageDurationMs: number;
}
