<template>
  <div
    class="car-row"
    :class="{
      locked: isLocked,
      open: !isLocked,
    }"
    @dragover.prevent="onDragOver"
    @drop.prevent="onDrop"
  
  >
    <div
  class="car-row"
  :style="{ borderLeft: '6px solid ' + tripColor }"
>

    <div class="car-header">
      <strong>{{ car.carNumber }}</strong>
      <span>{{ car.driverName }}</span>
      <span class="status">{{ tripStatusLabel }}</span>
    </div>

    <div v-if="activeTrip" class="trip-reservations">
      <div
        v-for="r in activeTrip.reservations"
        :key="r.reservationId"
        class="reservation-pill"
      >
        {{ r.passengerName }}
      </div>
    </div>

    <div v-else class="no-trip">
      No active trip
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useTripsStore } from "../stores/trips";
import { useReservationStore } from "../stores/reservations";
import { useSelectionStore } from "../stores/selection";

const selection = useSelectionStore();

function onClick() {
  selection.selectCar(props.car.carNumber);
}


export default defineComponent({
  name: "CarRow",
  props: {
    car: { type: Object, required: true },
  },
  setup(props) {
    const trips = useTripsStore();
    const reservations = useReservationStore();

    const activeTrip = computed(() =>
      trips.activeTripsByCar[props.car.carNumber] ?? null
    );

    const isLocked = computed(() => {
      if (!activeTrip.value) return false;
      return (
        activeTrip.value.status === "EnRoute" ||
        activeTrip.value.status === "Completed"
      );
    });

    const tripStatusLabel = computed(() => {
      if (!activeTrip.value) return "No Trip";
      return activeTrip.value.status;
    });

    function onDragOver(e: DragEvent) {
  if (isLocked.value) {
    e.dataTransfer!.dropEffect = "none";
  } else {
    e.dataTransfer!.dropEffect = "copy";
  }
}

async function onDrop(e: DragEvent) {
  if (isLocked.value) return;

  const reservationId = e.dataTransfer?.getData("reservationId");
  if (!reservationId) return;

  await trips.assignReservationToCar(reservationId, props.car.carNumber);

  // Refresh UI state
  await reservations.load();
  await trips.load();
}

    return {
      activeTrip,
      isLocked,
      tripStatusLabel,
      onDragOver,
      onDrop,
    };
  },
});
</script>

<style scoped>
.car-row {
  padding: 8px;
  border-bottom: 1px solid #ccc;
}
.car-row.open {
  background: #f8fff8;
}
.car-row.locked {
  background: #fff4f4;
  opacity: 0.6;
}
.car-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.status {
  font-size: 12px;
  opacity: 0.7;
}
.trip-reservations {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.reservation-pill {
  background: #e0eaff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.no-trip {
  font-size: 12px;
  opacity: 0.6;
}
</style>
