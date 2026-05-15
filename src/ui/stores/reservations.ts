import { defineStore } from "pinia";
import { getAllReservations } from "../services/api";
import type { ReservationSummary } from "../types/domain";

export const useReservationsStore = defineStore("reservations", {
  state: () => ({
    reservations: [] as ReservationSummary[],
    loading: false,
  }),

  actions: {
    async load() {
      this.loading = true;
      this.reservations = await getAllReservations();
      this.loading = false;
    },
  },
});
