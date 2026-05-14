// src/ui/stores/vehicles.ts
import { defineStore } from "pinia";
import type { VehicleSummary } from "../types/domain";

export const useVehicleStore = defineStore("vehicles", {
  state: () => ({
    items: [] as VehicleSummary[],
  }),

  actions: {
    setAll(v: VehicleSummary[]) {
      this.items = v;
    },

    getById(id: string) {
      return this.items.find(v => v.id === id);
    },

    getByCarNumber(carNumber: string) {
      return this.items.find(v => v.carNumber === carNumber);
    },
  },
});
