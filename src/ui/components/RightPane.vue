<!-- src/ui/components/RightPane.vue -->
<template>
  <div class="right-pane" :style="{ width: width + 'px' }">
    <component
      :is="activeComponent"
      v-if="activeComponent"
      :selection="selection"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useSelectionStore } from "../stores/selection";

import TripInfoPanel from "./info/TripInfoPanel.vue";
import CarInfoPanel from "./info/CarInfoPanel.vue";
import ReservationInfoPanel from "./info/ReservationInfoPanel.vue";

export default defineComponent({
  name: "RightPane",
  setup() {
    const selectionStore = useSelectionStore();
    const width = ref(340); // resizable later

    const selection = computed(() => selectionStore.selected);

    const activeComponent = computed(() => {
      if (!selection.value) return null;
      if (selection.value.type === "trip") return TripInfoPanel;
      if (selection.value.type === "car") return CarInfoPanel;
      if (selection.value.type === "reservation") return ReservationInfoPanel;
      return null;
    });

    return { selection, activeComponent, width };
  },
});
</script>

<style scoped>
.right-pane {
  border-left: 1px solid #ccc;
  background: #fafafa;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>
