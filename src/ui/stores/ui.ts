// src/ui/stores/ui.ts
import { defineStore } from "pinia";

export interface Selection {
  type: "trip" | "vehicle" | "reservation" | null;
  id?: string;
}

export const useUiStore = defineStore("ui", {
  state: () => ({
    leftCollapsed: false,
    leftWidth: 18,     // %
    centerWidth: 64,   // %
    rightWidth: 18,    // %

    ganttHeight: 70,   // %
    bottomHeight: 30,  // %

    rowHeight: 48,

    zoomLevel: 1,
    currentDate: new Date().toISOString().slice(0, 10),

    timelineRange: {
      start: new Date().setHours(0, 0, 0, 0),
      end: new Date().setHours(23, 59, 59, 999),
    } as any,

    nowIso: new Date().toISOString(),
    nowTimer: null as any,

    selection: null as Selection | null,

    reservationSort: {
      key: "pickupTime",
      dir: "asc" as "asc" | "desc",
    },
  }),

  actions: {
    toggleLeft() {
      this.leftCollapsed = !this.leftCollapsed;
    },

    setHorizontalSizes([left, center, right]: number[]) {
      this.leftWidth = left;
      this.centerWidth = center;
      this.rightWidth = right;
    },

    setVerticalSizes([gantt, bottom]: number[]) {
      this.ganttHeight = gantt;
      this.bottomHeight = bottom;
    },

    setZoom(z: number) {
      this.zoomLevel = z;
    },

    setDate(date: string) {
      this.currentDate = date;
    },

    shiftDate(days: number) {
      const d = new Date(this.currentDate);
      d.setDate(d.getDate() + days);
      this.currentDate = d.toISOString().slice(0, 10);
    },

    startNowTicker() {
      this.stopNowTicker();
      this.nowTimer = setInterval(() => {
        this.nowIso = new Date().toISOString();
      }, 60000);
    },

    stopNowTicker() {
      if (this.nowTimer) clearInterval(this.nowTimer);
      this.nowTimer = null;
    },

    select(sel: Selection) {
      this.selection = sel;
    },

    toggleReservationSort(key: string) {
      if (this.reservationSort.key === key) {
        this.reservationSort.dir =
          this.reservationSort.dir === "asc" ? "desc" : "asc";
      } else {
        this.reservationSort.key = key;
        this.reservationSort.dir = "asc";
      }
    },

    handleGlobalKeys(e: KeyboardEvent) {
      if (e.key === "Escape") this.selection = null;
    },

    async handleDropReservationOnRow(confirmationNumber: string, row: any) {
      // This will call your API layer later
      console.log("Drop reservation", confirmationNumber, "onto car", row.carNumber);
    },

    async loadInitialData() {
      // Will call API layer later
    },
  },
});
