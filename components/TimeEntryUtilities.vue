<template>
  <button type="button" class="text-slate-500" @click="newTimerFromExisting()">
    <Icon name="lucide:play" />
  </button>
  <button
    type="button"
    class="text-slate-700"
    @click="handleDeleteTimeEntries()"
  >
    <Icon name="lucide:trash" />
  </button>
</template>

<script setup lang="ts">
import { type TimeEntry } from "~/types/timer.types";
const props = defineProps({
  timeEntries: {
    type: Array as PropType<TimeEntry[]>,
    required: true,
  },
});

const { createNewTimeEntry, deleteTimeEntries, refreshTimeEntries } =
  useTimeEntries();

async function newTimerFromExisting() {
  try {
    await createNewTimeEntry({
      description: props.timeEntries[0].description || "",
    });
    refreshTimeEntries();
  } catch (error) {
    console.error(error);
  }
}

async function handleDeleteTimeEntries() {
  try {
    const ids: number[] = props.timeEntries.map((entry: TimeEntry) => entry.id);
    await deleteTimeEntries(ids);
    refreshTimeEntries();
  } catch (error) {
    console.error(error);
  }
}
</script>
