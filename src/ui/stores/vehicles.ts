import { defineStore } from "pinia";
import { getAllVehicles } from "../services/api";
import type { VehicleSummary } from "../types/domain";

export const useVehiclesStore = defineStore("vehicles", {
  state: () => ({
    vehicles: [] as VehicleSummary[],
    loading: false,
  }),

  actions: {
    async load() {
      this.loading = true;
      this.vehicles = await getAllVehicles();
      this.loading = false;
    },
  },
});
