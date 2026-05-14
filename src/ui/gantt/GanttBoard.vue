<template>
  <div class="gantt-board" ref="root">
    <div class="timeline">
      <TimelineRuler :range="ui.timelineRange" :zoom="ui.zoomLevel" />
    </div>

    <div class="rows" ref="rows">
      <div
        v-for="(row, idx) in rows"
        :key="row.carNumber"
        class="gantt-row"
        :style="{ height: rowHeight + 'px' }"
        @dragover.prevent
        @drop="onDrop($event, row)"
      >
        <div class="row-label" @click="selectRow(row)">{{ row.carNumber }}</div>
        <div class="row-canvas">
          <TripBlock
            v-for="t in tripsByVehicle[row.id]"
            :key="t.tripNumber"
            :trip="t"
            :range="ui.timelineRange"
            :zoom="ui.zoomLevel"
            @select="onSelectTrip"
          />
        </div>
      </div>
    </div>

    <NowLine :range="ui.timelineRange" :zoom="ui.zoomLevel" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import TripBlock from "./TripBlock.vue";
import NowLine from "./NowLine.vue";
import TimelineRuler from "./TimelineRuler.vue";
import { useUiStore } from "../stores/ui";
import { useVehicleStore } from "../stores/vehicles";
import { useTripStore } from "../stores/trips";
import { useReservationStore } from "../stores/reservations";

export default defineComponent({
  name: "GanttBoard",
  components: { TripBlock, NowLine, TimelineRuler },
  setup() {
    const ui = useUiStore();
    const vehicles = useVehicleStore();
    const trips = useTripStore();
    const reservations = useReservationStore();

    const rows = computed(() => vehicles.items);
    const tripsByVehicle = computed(() => {
      const map: Record<string, any[]> = {};
      for (const t of trips.items) {
        map[t.vehicleId] = map[t.vehicleId] || [];
        map[t.vehicleId].push(t);
      }
      return map;
    });

    const rowHeight = ui.rowHeight;

    function onDrop(e: DragEvent, row: any) {
      const payload = e.dataTransfer?.getData("text/plain");
      if (!payload) return;
      const confirmationNumber = payload;
      // call API to create trip or add to trip
      // api.createTripAssignAndAddReservations([confirmationNumber], row.carNumber, row.driverId)
      ui.handleDropReservationOnRow(confirmationNumber, row);
    }

    function onSelectTrip(trip: any) { ui.select({ type: "trip", id: trip.id }); }
    function selectRow(row: any) { ui.select({ type: "vehicle", id: row.id }); }

    return { ui, rows, tripsByVehicle, rowHeight, onDrop, onSelectTrip, selectRow };
  },
});
</script>

<style scoped>
.gantt-board { position: relative; height: 100%; overflow: auto; background: #fff; }
.timeline { height: 40px; border-bottom: 1px solid #eee; }
.rows { min-height: 200px; }
.gantt-row { display:flex; align-items:center; border-bottom:1px solid #f2f2f2; }
.row-label { width: 160px; padding: 6px; background:#fafafa; border-right:1px solid #eee; }
.row-canvas { flex:1; position:relative; height:100%; }
</style>
