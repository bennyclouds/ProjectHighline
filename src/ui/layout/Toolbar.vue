<template>
  <div class="toolbar">
    <div class="left">
      <button @click="prevDay">◀</button>
      <button @click="nextDay">▶</button>
      <input type="date" v-model="date" @change="onDateChange" />
    </div>
    <div class="right">
      <label>Zoom</label>
      <input type="range" min="0" max="4" v-model="zoom" @input="onZoom" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useUiStore } from "../stores/ui";
export default defineComponent({
  name: "Toolbar",
  setup() {
    const ui = useUiStore();
    const date = ref(ui.currentDate);
    const zoom = ref(ui.zoomLevel);

    function prevDay() { ui.shiftDate(-1); date.value = ui.currentDate; }
    function nextDay() { ui.shiftDate(1); date.value = ui.currentDate; }
    function onDateChange() { ui.setDate(date.value); }
    function onZoom() { ui.setZoom(zoom.value); }

    return { date, zoom, prevDay, nextDay, onDateChange, onZoom };
  },
});
</script>

<style scoped>
.toolbar { height: 44px; display:flex; align-items:center; justify-content:space-between; padding:0 12px; border-bottom:1px solid #eee; background:#fafafa; }
</style>
