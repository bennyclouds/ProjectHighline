// src/ui/stores/drivers.ts
import { defineStore } from "pinia";
import type { DriverSummary } from "../types/domain";

export const useDriverStore = defineStore("drivers", {
  state: () => ({
    items: [] as DriverSummary[],
  }),

  actions: {
    setAll(d: DriverSummary[]) {
      this.items = d;
    },

    getById(id: string) {
      return this.items.find(x => x.id === id);
    },
  },
});
