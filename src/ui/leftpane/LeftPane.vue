<template>
  <aside class="left-pane" :class="{ collapsed }">
    <header class="left-header">
      <button @click="$emit('toggleCollapse')">{{ collapsed ? '▶' : '◀' }}</button>
      <span v-if="!collapsed">Cars</span>
    </header>

    <div class="car-list">
      <CarRow
        v-for="v in vehicles"
        :key="v.id"
        :vehicle="v"
        :collapsed="collapsed"
        @select="onSelectVehicle"
      />
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import CarRow from "./CarRow.vue";
import { useVehicleStore } from "../stores/vehicles";
export default defineComponent({
  name: "LeftPane",
  components: { CarRow },
  props: { collapsed: { type: Boolean, default: false } },
  setup(props, { emit }) {
    const vehicles = useVehicleStore();
    function onSelectVehicle(v: any) { emit("select", v); }
    return { vehicles: vehicles.items, onSelectVehicle };
  },
});
</script>

<style scoped>
.left-pane { width: 100%; height: 100%; background: #fff; border-right: 1px solid #eee; overflow:auto; }
.left-pane.collapsed { width: 80px; }
.left-header { display:flex; align-items:center; padding:8px; border-bottom:1px solid #f0f0f0; }
.car-list { padding:8px; }
</style>
