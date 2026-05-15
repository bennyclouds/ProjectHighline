import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    selectedTripId: null as string | null,
    selectedReservationId: null as string | null,
  }),

  actions: {
    selectTrip(id: string | null) {
      this.selectedTripId = id;
    },
    selectReservation(id: string | null) {
      this.selectedReservationId = id;
    },
  },
});
