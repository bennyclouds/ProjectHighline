<!-- src/ui/components/info/ReservationInfoPanel.vue -->
<template>
  <div class="panel">
    <h2>{{ reservation.passengerName }}</h2>

    <div class="section">
      <strong>Pickup:</strong>
      {{ formatTime(reservation.pickupTimeMs) }}
    </div>

    <div class="section">
      <strong>Pickup Location:</strong>
      {{ reservation.pickupLocation }}
    </div>

    <div class="section">
      <strong>Dropoff Location:</strong>
      {{ reservation.dropoffLocation }}
    </div>

    <div class="section">
      <strong>Notes:</strong>
      <div>{{ reservation.notes || "None" }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useReservationStore } from "../../stores/reservations";

export default defineComponent({
  name: "ReservationInfoPanel",
  props: { selection: { type: Object, required: true } },
  setup(props) {
    const reservations = useReservationStore();

    const reservation = computed(() =>
      reservations.byId[props.selection.reservationId]
    );

    function formatTime(ms: number) {
      return new Date(ms).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return { reservation, formatTime };
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
