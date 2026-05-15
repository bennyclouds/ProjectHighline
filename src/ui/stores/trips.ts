import { defineStore } from "pinia";
import { getAllTrips } from "../services/api";
import type { TripSummary } from "../types/domain";

export const useTripsStore = defineStore("trips", {
  state: () => ({
    trips: [] as TripSummary[],
    loading: false,
  }),

  actions: {
    async load() {
      this.loading = true;
      this.trips = await getAllTrips();
      this.loading = false;
    },
  },
});
