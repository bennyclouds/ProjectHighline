<template>
  <aside class="info-pane" v-if="selection">
    <div v-if="selection.type === 'trip'">
      <h3>Trip {{ trip?.tripNumber }}</h3>
      <p>State: {{ trip?.state }}</p>
      <p>Vehicle: {{ vehicle?.carNumber }}</p>
      <ul>
        <li v-for="c in trip?.reservations" :key="c">{{ c }}</li>
      </ul>
    </div>

    <div v-else-if="selection.type === 'vehicle'">
      <h3>Vehicle {{ vehicle?.carNumber }}</h3>
      <p>Plate: {{ vehicle?.plate }}</p>
      <p>Capacity: {{ vehicle?.capacity }}</p>
    </div>

    <div v-else-if="selection.type === 'reservation'">
      <h3>Reservation {{ reservation?.confirmationNumber }}</h3>
      <p>Pickup: {{ reservation?.pickupTime }}</p>
      <p>Passenger: {{ reservation?.passengerName }}</p>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useUiStore } from "../stores/ui";
import { useTripStore } from "../stores/trips";
import { useVehicleStore } from "../stores/vehicles";
import { useReservationStore } from "../stores/reservations";

export default defineComponent({
  name: "InfoPane",
  props: { selection: { type: Object, required: false } },
  setup(props) {
    const ui = useUiStore();
    const trips = useTripStore();
    const vehicles = useVehicleStore();
    const reservations = useReservationStore();

    const trip = computed(() => props.selection?.type === "trip" ? trips.getById(props.selection.id) : null);
    const vehicle = computed(() => props.selection?.type === "vehicle" ? vehicles.getById(props.selection.id) : (trip.value ? vehicles.getById(trip.value.vehicleId) : null));
    const reservation = computed(() => props.selection?.type === "reservation" ? reservations.getByConfirmationNumber(props.selection.id) : null);

    return { trip, vehicle, reservation };
  },
});
</script>

<style scoped>
.info-pane { width: 320px; padding: 12px; border-left: 1px solid #eee; background:#fff; overflow:auto; }
</style>
