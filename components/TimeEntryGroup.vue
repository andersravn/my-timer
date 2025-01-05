<template>
  <div class="flex items-center">
    <button class="btn btn-xs text-xs" @click="toggleShowTimeEntries()">
      {{ entriesByDescription?.length }}
    </button>
    <input
      type="text"
      class="input input-xs w-32 sm:input-sm"
      :value="description"
      @blur="updateDescriptions"
      placeholder="No description"
    />
    <div class="text-xs w-full">
      {{
        $dayjs(
          entriesByDescription?.[entriesByDescription.length - 1].start_time
        ).format("HH:mm")
      }}
      -
      {{ $dayjs(entriesByDescription?.[0].end_time).format("HH:mm") }}
      {{ $dayjs(getTotalTime(entriesByDescription)).format("HH:mm:ss") }}
    </div>
  </div>
  <ul v-if="showTimeEntries" class="ml-4 flex flex-col space-y-2 mt-2">
    <li v-for="entry in entriesByDescription" :key="entry.id">
      <TimeEntryForm :timeEntry="entry" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { type TimeEntryBase } from "~/types/timer.types";

const props = defineProps({
  entriesByDescription: {
    type: Array as PropType<TimeEntryBase[]>,
    required: true,
  },
  description: { type: String, required: true },
});

const dayjs = useDayjs();

const [showTimeEntries, toggleShowTimeEntries] = useToggle();

const { setDescription } = useTimeEntries();

function getTotalTime(timeEntries: TimeEntryBase[]) {
  return timeEntries.reduce((acc, entry) => {
    if (entry.start_time && entry.end_time) {
      const start = dayjs(entry.start_time);
      const end = dayjs(entry.end_time);
      const duration = end.diff(start, "minute");
      return acc + duration;
    }
    return acc;
  }, 0);
}

function updateDescriptions(event: any) {
  for (const entry of props.entriesByDescription) {
    setDescription({
      id: entry.id,
      description: event.target.value,
    });
    entry.description = event.target.value;
  }
}
</script>
