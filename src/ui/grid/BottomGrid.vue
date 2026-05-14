<template>
  <div class="bottom-grid">
    <div class="grid-header">
      <div v-for="col in columns" :key="col.key" class="col" @click="sortBy(col.key)">
        {{ col.label }}
        <span v-if="sort.key === col.key">{{ sort.dir === 'asc' ? '▲' : '▼' }}</span>
      </div>
    </div>

    <div class="grid-body" :style="{ height: bottomHeight + 'px' }">
      <div
        v-for="r in sortedReservations"
        :key="r.confirmationNumber"
        class="grid-row"
        :draggable="true"
        @dragstart="onDragStart(r)"
      >
        <div class="col name">{{ r.passengerName }}</div>
        <div class="col pickup">{{ r.pickupTime }}</div>
        <div class="col flight">{{ r.flightStatus }}</div>
        <div class="col pickup-loc">{{ r.pickupLocation }}</div>
        <div class="col dropoff">{{ r.dropoffLocation }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useReservationStore } from "../stores/reservations";
import { useUiStore } from "../stores/ui";

export default defineComponent({
  name: "BottomGrid",
  setup() {
    const reservations = useReservationStore();
    const ui = useUiStore();

    const columns = [
      { key: "passengerName", label: "Name" },
      { key: "pickupTime", label: "Pickup Time" },
      { key: "flightStatus", label: "Flight" },
      { key: "pickupLocation", label: "Pickup" },
      { key: "dropoffLocation", label: "Dropoff" },
    ];

    const sort = ui.reservationSort;

    const sortedReservations = computed(() => reservations.sorted(sort));

    function sortBy(key: string) { ui.toggleReservationSort(key); }

    function onDragStart(r: any) {
      return (e: DragEvent) => {
        e.dataTransfer?.setData("text/plain", r.confirmationNumber);
      };
    }

    return { columns, sortedReservations, sort, onDragStart, bottomHeight: ui.bottomHeight };
  },
});
</script>

<style scoped>
.bottom-grid { border-top:1px solid #eee; background:#fff; }
.grid-header { display:flex; padding:6px; background:#fafafa; border-bottom:1px solid #f0f0f0; }
.col { flex:1; padding:4px 8px; cursor:pointer; user-select:none; }
.grid-body { overflow:auto; }
.grid-row { display:flex; padding:8px; border-bottom:1px solid #f6f6f6; }
.grid-row .col { flex:1; }
</style>
