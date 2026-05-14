<template>
  <nav class="top-menu" role="menubar" aria-label="Application menu">
    <ul>
      <li><button @click="onFile">File</button></li>
      <li><button @click="onEdit">Edit</button></li>
      <li><button @click="onView">View</button></li>
      <li><button @click="onTools">Tools</button></li>
      <li><button @click="onHelp">Help</button></li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TopMenu",
  setup() {
    function onFile() { /* open file menu */ }
    function onEdit() { /* open edit menu */ }
    function onView() { /* open view menu */ }
    function onTools() { /* open tools menu */ }
    function onHelp() { /* open help */ }
    return { onFile, onEdit, onView, onTools, onHelp };
  },
});
</script>

<style scoped>
.top-menu {
  height: 36px;
  display: flex;
  align-items: center;
  background: var(--menu-bg, #f5f5f5);
  border-bottom: 1px solid #ddd;
}
.top-menu ul { display: flex; gap: 8px; margin: 0; padding: 0 12px; list-style: none; }
.top-menu button { background: transparent; border: none; padding: 6px 8px; cursor: pointer; }
</style>
