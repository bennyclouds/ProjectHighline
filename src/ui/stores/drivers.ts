import { defineStore } from "pinia";
import { getAllDrivers } from "../services/api";
import type { DriverSummary } from "../types/domain";

export const useDriversStore = defineStore("drivers", {
  state: () => ({
    drivers: [] as DriverSummary[],
    loading: false,
  }),

  actions: {
    async load() {
      this.loading = true;
      this.drivers = await getAllDrivers();
      this.loading = false;
    },
  },
});
