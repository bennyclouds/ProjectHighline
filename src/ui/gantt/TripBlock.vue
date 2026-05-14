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
