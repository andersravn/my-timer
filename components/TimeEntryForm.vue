<template>
  <form class="mx-2">
    <input
      class="input"
      type="text"
      v-model="timeEntry.description"
      @blur="updateDescription"
      placeholder="No description"
    />
    <TimeInput
      v-if="timeEntry.start_time"
      @update:model-value="updateStartTime"
      v-model.formatdate="timeEntry.start_time"
    />
    -
    <TimeInput
      v-if="timeEntry.end_time"
      @update:model-value="updateEndTime"
      v-model.formatdate="timeEntry.end_time"
    />
    {{ duration }}
  </form>
</template>

<script setup lang="ts">
import { type TimeEntry } from "~/types/timer.types";
const props = defineProps({
  timeEntry: {
    type: Object as PropType<TimeEntry>,
    required: true,
  },
});

const { setDescription, setEndTime, setStartTime } = useTimeEntries();

const duration = computed(() => {
  if (props.timeEntry.start_time && props.timeEntry.end_time) {
    const start = new Date(props.timeEntry.start_time);
    const end = new Date(props.timeEntry.end_time);
    const duration = end.getTime() - start.getTime();
    return formatDuration(duration / 1000);
  }
});

function updateDescription() {
  if (props.timeEntry && props.timeEntry.id && props.timeEntry.description) {
    setDescription({
      id: props.timeEntry.id,
      description: props.timeEntry.description,
    });
  }
}

function updateStartTime(value: string) {
  setStartTime({ id: props.timeEntry.id, startTime: value });
}

function updateEndTime(value: string) {
  setEndTime({ id: props.timeEntry.id, endTime: value });
}
</script>
