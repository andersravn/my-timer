<template>
  <form class="flex justify-between items-center space-x-2">
    <input
      type="text"
      class="input input-xs sm:input-sm"
      :value="timeEntry.description"
      @blur="updateDescription"
      @keydown.enter="updateDescription"
      placeholder="No description"
    />
    <div class="flex space-x-2 items-center flex-nowrap">
      <TimeInput
        v-if="timeEntry.start_time"
        @update:model-value="updateStartTime"
        v-model.formatdate="timeEntry.start_time"
        @change-date="handleChangeDate"
        show-date-picker
      />
      <div>-</div>
      <TimeInput
        v-if="timeEntry.end_time"
        @update:model-value="updateEndTime"
        v-model.formatdate="timeEntry.end_time"
        @change-date="handleChangeDate"
      />
      <div class="text-xs w-[53px] font-bold">
        {{ duration }}
      </div>
      <TimeEntryUtilities :timeEntries="[timeEntry as TimeEntry]" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { type TimeEntry } from "~/types/timer.types";
const props = defineProps({
  timeEntry: {
    type: Object as PropType<Partial<TimeEntry>>,
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

function updateDescription(event: any) {
  if (
    props.timeEntry &&
    props.timeEntry.id &&
    event.target.value !== props.timeEntry.description
  ) {
    setDescription({
      id: props.timeEntry.id,
      description: event.target.value,
    });
  }
}

function updateStartTime(value: string) {
  if (props.timeEntry.id) {
    setStartTime({ id: props.timeEntry.id, startTime: value });
  }
}

function updateEndTime(value: string) {
  if (props.timeEntry.id) {
    setEndTime({ id: props.timeEntry.id, endTime: value });
  }
}

function handleChangeDate(newDate: string) {
  const originalStartDate = new Date(props.timeEntry.start_time || "");
  const originalEndDate = new Date(props.timeEntry.end_time || "");
  const newStartDate = new Date(newDate);
  const newEndDate = new Date(newDate);
  newStartDate.setHours(originalStartDate.getHours());
  newStartDate.setMinutes(originalStartDate.getMinutes());
  newEndDate.setHours(originalEndDate.getHours());
  newEndDate.setMinutes(originalEndDate.getMinutes());
  updateStartTime(newStartDate.toISOString());
  updateEndTime(newEndDate.toISOString());
}
</script>
