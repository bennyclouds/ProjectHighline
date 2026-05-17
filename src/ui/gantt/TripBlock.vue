<template>
  <div
    class="trip-block"
    :style="tripBlockStyle"
    @click="onSelect"
  >
    <div
      v-for="(r, i) in trip.reservations"
      :key="r.reservationId"
      class="reservation-strip"
      :style="stripStyle(i)"
    >
      {{ r.passengerName }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useTripColorSchemeStore } from "../../stores/tripColorScheme";
import { useSelectionStore } from "../../stores/selection";
import { timeToX } from "../../utils/timeScale";

export default defineComponent({
  name: "TripBlock",
  props: {
    trip: { type: Object, required: true },
    stripHeight: { type: Number, default: 50 },
    timelineRange: { type: Object, required: true },
    zoom: { type: Number, required: true },
  },

  setup(props) {
    const scheme = useTripColorSchemeStore();
    const selection = useSelectionStore();

    const totalStrips = computed(() => props.trip.reservations.length);
    const totalStripHeight = computed(() => totalStrips.value * props.stripHeight);
    const tripBoxHeight = computed(() => props.stripHeight * 6);

    const verticalOffset = computed(() =>
      (tripBoxHeight.value - totalStripHeight.value) / 2
    );

    const leftX = computed(() =>
      timeToX(props.trip.startIso, props.timelineRange, props.zoom)
    );

    const widthPx = computed(() =>
      timeToX(props.trip.endIso, props.timelineRange, props.zoom) - leftX.value
    );

    const tripBlockStyle = computed(() => ({
      position: "absolute",
      left: `${leftX.value}px`,
      width: `${widthPx.value}px`,
      height: `${tripBoxHeight.value}px`,
      background: scheme.colors[props.trip.status],
      border: "1px solid rgba(0,0,0,0.2)",
      borderRadius: "4px",
      overflow: "hidden",
    }));

    function stripStyle(index: number) {
      return {
        position: "absolute",
        left: "0",
        right: "0",
        height: `${props.stripHeight}px`,
        top: `${verticalOffset.value + index * props.stripHeight}px`,
        background: "white",
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: "3px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "8px",
        fontSize: "13px",
      };
    }

    function onSelect() {
      selection.selectTrip(props.trip.tripNumber);
    }

    return {
      tripBlockStyle,
      stripStyle,
      onSelect,
    };
  },
});
</script>

<style scoped>
.trip-block {
  cursor: pointer;
  transition: box-shadow 0.15s ease;
}

.trip-block:hover {
  box-shadow: 0 0 6px rgba(0,0,0,0.25);
}

.reservation-strip {
  user-select: none;
}
</style>
