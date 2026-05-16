<template>
  <div
    class="trip-block"
    :style="style"
    @click="$emit('select', trip)"
    draggable="false"
    title="Trip {{ trip.tripNumber }}"
  >
    <div class="label">{{ trip.tripNumber }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { TripSummary } from "../types/domain";
import { timeToX } from "../utils/timeScale";

export default defineComponent({
  name: "TripBlock",
  props: { trip: { type: Object as () => TripSummary, required: true }, range: { type: Object, required: true }, zoom: { type: Number, required: true } },
  setup(props) {
    const style = computed(() => {
      const left = timeToX(props.trip.start, props.range, props.zoom);
      const right = timeToX(props.trip.end, props.range, props.zoom);
      const width = Math.max(24, right - left);
      return { left: left + "px", width: width + "px", position: "absolute" };
    });
    return { style };
  },
});
</script>

<style scoped>
.trip-block { background: #2b8cff; color: white; border-radius: 4px; padding: 4px; box-sizing: border-box; cursor: pointer; }
.label { font-size: 12px; font-weight: 600; }
</style>

<template>
  <div
    class="trip-box"
    :style="tripBoxStyle"
  >
    <div
      class="reservation-strip"
      v-for="(r, i) in reservations"
      :key="r.reservationId"
      :style="stripStyle(i)"
    >
      {{ r.passengerName }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "GanttTripBox",
  props: {
    reservations: { type: Array, required: true },
    stripHeight: { type: Number, default: 50 }, // px
  },
  setup(props) {
    const totalStrips = computed(() => props.reservations.length);
    const totalStripHeight = computed(() => totalStrips.value * props.stripHeight);
    const tripBoxHeight = computed(() => props.stripHeight * 6);

    const verticalOffset = computed(() =>
      (tripBoxHeight.value - totalStripHeight.value) / 2
    );

    const tripBoxStyle = computed(() => ({
      height: `${tripBoxHeight.value}px`,
      position: "relative",
      background: "#d0e8ff",
      border: "1px solid #8bb7e0",
      borderRadius: "4px",
    }));

    function stripStyle(index: number) {
      return {
        position: "absolute",
        left: "0",
        right: "0",
        height: `${props.stripHeight}px`,
        top: `${verticalOffset.value + index * props.stripHeight}px`,
        background: "#ffffff",
        border: "1px solid #aac7ff",
        borderRadius: "3px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "8px",
        fontSize: "13px",
      };
    }

    return {
      tripBoxStyle,
      stripStyle,
    };
  },
});
</script>
