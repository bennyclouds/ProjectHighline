import { defineStore } from "pinia";
import { getAllReservations, createReservation } from "../services/api";
import type { ReservationSummary } from "../types/domain";

export const useReservationStore = defineStore("reservations", {
  state: () => ({
    items: [] as ReservationSummary[],
    loading: false,
  }),

  actions: {
    async load() {
      this.loading = true;
      this.items = await getAllReservations();
      this.loading = false;
    },

    async create(payload: {
      passengerName: string;
      pickupTimeMs: number;
      pickupLocation: string;
      dropoffLocation: string;
    }) {
      const r = await createReservation(payload);
      this.items.push(r);
    },
  },
});
