<template>
  <div class="app-shell">
    <TopMenu />
    <Toolbar />
    <div class="main-area">
      <SplitterHorizontal
        :sizes="[ui.leftWidth, ui.centerWidth, ui.rightWidth]"
        @update:sizes="onUpdateHorizontal"
      >
        <template #pane1>
          <LeftPane :collapsed="ui.leftCollapsed" @toggleCollapse="ui.toggleLeft" />
        </template>

        <template #pane2>
          <div class="center-column">
            <TimelineToolbar />
            <GanttBoard />
          </div>
        </template>

        <template #pane3>
          <InfoPane :selection="ui.selection" />
        </template>
      </SplitterHorizontal>
    </div>

    <SplitterVertical
      :sizes="[ui.ganttHeight, ui.bottomHeight]"
      class="bottom-split"
      @update:sizes="onUpdateVertical"
    >
      <template #pane1>
        <!-- top is the main area already rendered above -->
      </template>
      <template #pane2>
        <BottomGrid />
      </template>
    </SplitterVertical>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import TopMenu from "../layout/TopMenu.vue";
import Toolbar from "../layout/Toolbar.vue";
import LeftPane from "../leftpane/LeftPane.vue";
import GanttBoard from "../gantt/GanttBoard.vue";
import InfoPane from "../infopane/InfoPane.vue";
import BottomGrid from "../grid/BottomGrid.vue";
import SplitterHorizontal from "../components/SplitterHorizontal.vue";
import SplitterVertical from "../components/SplitterVertical.vue";
import TimelineToolbar from "../layout/TimelineToolbar.vue";
import { useUiStore } from "../stores/ui";

export default defineComponent({
  name: "AppShell",
  components: {
    TopMenu,
    Toolbar,
    LeftPane,
    GanttBoard,
    InfoPane,
    BottomGrid,
    SplitterHorizontal,
    SplitterVertical,
    TimelineToolbar,
  },
  setup() {
    const ui = useUiStore();

    function onUpdateHorizontal(sizes: number[]) {
      ui.setHorizontalSizes(sizes);
    }
    function onUpdateVertical(sizes: number[]) {
      ui.setVerticalSizes(sizes);
    }

    onMounted(() => {
      ui.loadInitialData();
      ui.startNowTicker();
      window.addEventListener("keydown", ui.handleGlobalKeys);
    });

    onUnmounted(() => {
      ui.stopNowTicker();
      window.removeEventListener("keydown", ui.handleGlobalKeys);
    });

    return { ui, onUpdateHorizontal, onUpdateVertical };
  },
});
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
.main-area {
  flex: 1 1 auto;
  display: flex;
  min-height: 0;
}
.center-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.bottom-split {
  height: 30vh;
}
</style>
