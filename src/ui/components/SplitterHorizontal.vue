<template>
  <div class="splitter-horizontal" ref="root">
    <div class="pane pane1" :style="{ width: sizes[0] + '%' }">
      <slot name="pane1" />
    </div>
    <div class="gutter" @mousedown.prevent="startDrag" role="separator" aria-orientation="vertical"></div>
    <div class="pane pane2" :style="{ width: sizes[1] + '%' }">
      <slot name="pane2" />
    </div>
    <div class="gutter" @mousedown.prevent="startDragRight" role="separator" aria-orientation="vertical"></div>
    <div class="pane pane3" :style="{ width: sizes[2] + '%' }">
      <slot name="pane3" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "SplitterHorizontal",
  props: { sizes: { type: Array as () => number[], required: true } },
  emits: ["update:sizes"],
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null);
    let draggingIndex = -1;

    function startDrag(e: MouseEvent) {
      draggingIndex = 0;
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", stopDrag);
    }
    function startDragRight(e: MouseEvent) {
      draggingIndex = 1;
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", stopDrag);
    }
    function onMove(e: MouseEvent) {
      if (!root.value) return;
      const rect = root.value.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const total = rect.width;
      const leftPct = Math.max(10, Math.min(70, (x / total) * 100));
      const rightPct = Math.max(10, Math.min(70, 100 - leftPct - 20));
      if (draggingIndex === 0) emit("update:sizes", [leftPct, 100 - leftPct - props.sizes[2], props.sizes[2]]);
      if (draggingIndex === 1) emit("update:sizes", [props.sizes[0], 100 - props.sizes[0] - rightPct, rightPct]);
    }
    function stopDrag() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", stopDrag);
      draggingIndex = -1;
    }

    return { root, startDrag, startDragRight };
  },
});
</script>

<style scoped>
.splitter-horizontal { display:flex; height:100%; width:100%; }
.pane { overflow: auto; }
.gutter { width: 8px; cursor: col-resize; background: transparent; }
</style>
