<template>
  <div class="now-line" :style="{ left: x + 'px' }" aria-hidden="true"></div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useUiStore } from "../stores/ui";
import { timeToX } from "../utils/timeScale";

export default defineComponent({
  name: "NowLine",
  props: { range: { type: Object, required: true }, zoom: { type: Number, required: true } },
  setup(props) {
    const ui = useUiStore();
    const x = computed(() => timeToX(ui.nowIso, props.range, props.zoom));
    return { x };
  },
});
</script>

<style scoped>
.now-line { position: absolute; top: 0; bottom: 0; width: 2px; background: #ff2d2d; box-shadow: 0 0 6px rgba(255,45,45,0.8); z-index: 50; }
</style>
