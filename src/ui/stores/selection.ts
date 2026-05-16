// src/ui/stores/selection.ts
import { defineStore } from "pinia";

export type Selection =
  | { type: "trip"; tripNumber: string }
  | { type: "car"; carNumber: string }
  | { type: "reservation"; reservationId: string }
  | null;

export const useSelectionStore = defineStore("selection", {
  state: () => ({
    selected: null as Selection,
  }),

  actions: {
    selectTrip(tripNumber: string) {
      this.selected = { type: "trip", tripNumber };
    },
    selectCar(carNumber: string) {
      this.selected = { type: "car", carNumber };
    },
    selectReservation(reservationId: string) {
      this.selected = { type: "reservation", reservationId };
    },
    clear() {
      this.selected = null;
    },
  },
});
