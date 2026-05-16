<!-- src/ui/components/info/CarInfoPanel.vue -->
<template>
  <div class="panel">
    <h2>Car {{ car.carNumber }}</h2>

    <div class="section">
      <strong>Driver:</strong> {{ car.driverName }}
    </div>

    <div class="section">
      <strong>Vehicle Type:</strong> {{ car.vehicleType }}
    </div>

    <div class="section">
      <strong>Home City:</strong> {{ car.homeCity }}
    </div>

    <div class="section">
      <strong>Current Trip:</strong>
      <span v-if="activeTrip">Trip {{ activeTrip.tripNumber }}</span>
      <span v-else>None</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useVehicleStore } from "../../stores/vehicles";
import { useTripStore } from "../../stores/trips";

export default defineComponent({
  name: "CarInfoPanel",
  props: { selection: { type: Object, required: true } },
  setup(props) {
    const vehicles = useVehicleStore();
    const trips = useTripStore();

    const car = computed(() =>
      vehicles.byCarNumber[props.selection.carNumber]
    );

    const activeTrip = computed(() =>
      trips.activeTripsByCar[props.selection.carNumber] ?? null
    );

    return { car, activeTrip };
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
</style>
