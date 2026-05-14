// src/ui/stores/reservations.ts
import { defineStore } from "pinia";
import type { ReservationSummary } from "../types/domain";

export const useReservationStore = defineStore("reservations", {
  state: () => ({
    items: [] as ReservationSummary[],
  }),

  actions: {
    setAll(r: ReservationSummary[]) {
      this.items = r;
    },

    getByConfirmationNumber(num: string) {
      return this.items.find(r => r.confirmationNumber === num);
    },

    sorted(sort: { key: string; dir: "asc" | "desc" }) {
      const arr = [...this.items];
      arr.sort((a, b) => {
        const av = (a as any)[sort.key];
        const bv = (b as any)[sort.key];
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
      return arr;
    },
  },
});
