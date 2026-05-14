<template>
  <div class="car-row" @click="$emit('select', vehicle)">
    <div class="left">
      <div class="car-number">{{ vehicle.carNumber }}</div>
      <div class="driver-name">{{ driverName }}</div>
    </div>
    <div v-if="!collapsed" class="details">
      <div class="home-city">{{ driver?.homeCity }}</div>
      <div class="vehicle-type">{{ vehicle.make }} {{ vehicle.model }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { VehicleSummary } from "../types/domain";
import { useDriverStore } from "../stores/drivers";

export default defineComponent({
  name: "CarRow",
  props: { vehicle: { type: Object as () => VehicleSummary, required: true }, collapsed: { type: Boolean, default: false } },
  setup(props) {
    const drivers = useDriverStore();
    const driver = computed(() => drivers.getById(props.vehicle.id) || null);
    const driverName = computed(() => driver.value?.name ?? "—");
    return { driver, driverName };
  },
});
</script>

<style scoped>
.car-row { display:flex; align-items:center; padding:6px; border-bottom:1px solid #f6f6f6; cursor:pointer; }
.car-number { font-weight:600; margin-right:8px; }
.details { margin-left:auto; color:#666; font-size:12px; }
</style>
