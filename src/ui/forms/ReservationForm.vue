<template>
  <form class="reservation-form" @submit.prevent="onSubmit">
    <label>
      Passenger Name
      <input v-model="passengerName" type="text" required />
    </label>

    <label>
      Pickup Time
      <input v-model="pickupTimeIso" type="datetime-local" required />
    </label>

    <label>
      Pickup Location
      <input v-model="pickupLocation" type="text" required />
    </label>

    <label>
      Dropoff Location
      <input v-model="dropoffLocation" type="text" required />
    </label>

    <button type="submit">Create Reservation</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "ReservationForm",
  emits: ["submit"],
  setup(_, { emit }) {
    const passengerName = ref("");
    const pickupTimeIso = ref("");
    const pickupLocation = ref("");
    const dropoffLocation = ref("");

    function onSubmit() {
      const pickupTimeMs = new Date(pickupTimeIso.value).getTime();

      emit("submit", {
        passengerName: passengerName.value,
        pickupTimeMs,
        pickupLocation: pickupLocation.value,
        dropoffLocation: dropoffLocation.value,
      });
    }

    return {
      passengerName,
      pickupTimeIso,
      pickupLocation,
      dropoffLocation,
      onSubmit,
    };
  },
});
</script>

<style scoped>
.reservation-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}
label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}
button {
  margin-top: 12px;
  padding: 8px 12px;
}
</style>
