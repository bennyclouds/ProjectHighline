<!-- src/ui/components/info/TripInfoPanel.vue -->
<template>
  <div class="panel">
    <h2>Trip {{ trip.tripNumber }}</h2>

    <div class="section">
      <strong>Status:</strong> {{ trip.status }}
    </div>

    <div class="section">
      <strong>Car:</strong> {{ trip.carNumber }}
    </div>

    <div class="section">
      <strong>Reservations:</strong>
      <ul>
        <li v-for="r in trip.reservations" :key="r.reservationId">
          {{ r.passengerName }} — {{ formatTime(r.pickupTimeMs) }}
        </li>
      </ul>
    </div>

    <div class="section">
      <strong>Route Preview:</strong>
      <div class="map-placeholder">Google Maps snapshot coming soon</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useTripStore } from "../../stores/trips";

export default defineComponent({
  name: "TripInfoPanel",
  props: { selection: { type: Object, required: true } },
  setup(props) {
    const trips = useTripStore();

    const trip = computed(() =>
      trips.byTripNumber[props.selection.tripNumber]
    );

    function formatTime(ms: number) {
      return new Date(ms).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return { trip, formatTime };
  },
});
</script>

<style scoped>
.panel {
  padding: 16px;
}
.section {
  margin-bottom: 12px;
}
.map-placeholder {
  height: 120px;
  background: #e8e8e8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style>
