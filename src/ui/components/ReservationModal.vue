<template>
  <div v-if="open" class="modal-backdrop">
    <div class="modal">
      <h2>New Reservation</h2>
      <ReservationForm @submit="handleSubmit" />
      <button class="close" @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ReservationForm from "../forms/ReservationForm.vue";
import { useReservationStore } from "../stores/reservations";

export default defineComponent({
  name: "ReservationModal",
  components: { ReservationForm },
  props: { open: { type: Boolean, required: true } },
  setup(_, { emit }) {
    const reservations = useReservationStore();

    async function handleSubmit(payload: any) {
      await reservations.create(payload);
      emit("close");
    }

    return { handleSubmit };
  },
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 360px;
}
.close {
  margin-top: 12px;
}
</style>
