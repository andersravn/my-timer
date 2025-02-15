<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center flex-nowrap">
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
    </div>
    <div class="flex space-x-2 justify-between text-sm">
      <span class="w-16 flex justify-center">
        {{
          $dayjs(
            entriesByDescription?.[entriesByDescription.length - 1].start_time
          ).format("HH:mm")
        }}
      </span>
      <span> - </span>
      <span class="w-16 flex justify-center">{{
        $dayjs(entriesByDescription?.[0].end_time).format("HH:mm")
      }}</span>
      <span class="text-xs">{{ getTotalTime(entriesByDescription) }}</span>
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
  const totalTime = timeEntries.reduce((acc, entry) => {
    if (entry.start_time && entry.end_time) {
      const start = dayjs(entry.start_time);
      const end = dayjs(entry.end_time);
      const duration = end.diff(start, "seconds");
      return acc + duration;
    }
    return acc;
  }, 0);
  return formatDuration(totalTime);
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
