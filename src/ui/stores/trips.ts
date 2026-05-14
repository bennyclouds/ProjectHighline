// src/ui/stores/trips.ts
import { defineStore } from "pinia";
import type { TripSummary } from "../types/domain";

export const useTripStore = defineStore("trips", {
  state: () => ({
    items: [] as TripSummary[],
  }),

  actions: {
    setAll(t: TripSummary[]) {
      this.items = t;
    },

    getById(id: string) {
      return this.items.find(t => t.id === id);
    },

    getByTripNumber(num: string) {
      return this.items.find(t => t.tripNumber === num);
    },
  },
});
