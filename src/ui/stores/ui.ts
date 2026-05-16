// src/ui/stores/ui.ts
import { defineStore } from "pinia";
import { timeToX } from "../utils/timeScale";

export const useUiStore = defineStore("ui", {
  state: () => ({
    timelineRange: {
      start: "",
      end: "",
    },
    zoom: 3, // px per minute
    nowMs: Date.now(),
  }),

  getters: {
    nowX(state) {
      return timeToX(
        new Date(state.nowMs).toISOString(),
        state.timelineRange,
        state.zoom
      );
    },
  },

  actions: {
    startNowTicker() {
      setInterval(() => {
        this.nowMs = Date.now();
      }, 1000);
    },
  },
});
