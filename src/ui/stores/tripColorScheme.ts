// src/ui/stores/tripColorScheme.ts
import { defineStore } from "pinia";

export type TripStatus = "Ready" | "Assigned" | "EnRoute" | "Completed";

export type ColorSchemeName =
  | "industry"
  | "traffic"
  | "monochrome"
  | "accessible"
  | "highcontrast";

type Scheme = Record<TripStatus, string>;

const schemes: Record<ColorSchemeName, Scheme> = {
  industry: {
    Ready: "#4A90E2",
    Assigned: "#9B59B6",
    EnRoute: "#27AE60",
    Completed: "#95A5A6",
  },
  traffic: {
    Ready: "#F1C40F",
    Assigned: "#E67E22",
    EnRoute: "#2ECC71",
    Completed: "#7F8C8D",
  },
  monochrome: {
    Ready: "#D6EAF8",
    Assigned: "#5DADE2",
    EnRoute: "#21618C",
    Completed: "#D5D8DC",
  },
  accessible: {
    Ready: "#0072B2",
    Assigned: "#D55E00",
    EnRoute: "#009E73",
    Completed: "#999999",
  },
  highcontrast: {
    Ready: "#00BCD4",
    Assigned: "#E91E63",
    EnRoute: "#4CAF50",
    Completed: "#424242",
  },
};

export const useTripColorSchemeStore = defineStore("tripColorScheme", {
  state: () => ({
    active: "traffic" as ColorSchemeName,
  }),

  getters: {
    colors(state) {
      return schemes[state.active];
    },
  },

  actions: {
    setScheme(name: ColorSchemeName) {
      this.active = name;
    },
  },
});
