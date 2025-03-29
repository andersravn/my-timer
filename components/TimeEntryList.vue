<script setup lang="ts">
import type { TimeEntryBase } from "~/types/timer.types";

const dayjs = useDayjs();

const { timeEntries } = useTimeEntries();

const timeEntriesByDay = computed(() => {
  return timeEntries.value?.reduce((acc, entry) => {
    const date = dayjs(entry.start_time).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntryBase[]>);
});

function groupByDescription(timeEntries: TimeEntryBase[]) {
  return timeEntries.reduce((acc, entry) => {
    const description = entry.description || "No description";
    if (!acc[description]) {
      acc[description] = [];
    }
    acc[description].push(entry);
    return acc;
  }, {} as Record<string, TimeEntryBase[]>);
}

function isYesterday(date: string) {
  return dayjs(date).isSame(dayjs().subtract(1, "day"), "day");
}

function calculateDayTotal(entries: TimeEntryBase[]) {
  const totalMilliseconds = entries.reduce((total, entry) => {
    const startTime = dayjs(entry.start_time);
    const endTime = entry.end_time ? dayjs(entry.end_time) : dayjs();
    return total + endTime.diff(startTime, "millisecond");
  }, 0);

  return dayjs.duration(totalMilliseconds).format("HH:mm:ss");
}
</script>

<template>
  <ul class="mx-2">
    <li v-for="(entries, date) in timeEntriesByDay" :key="date">
      <div class="flex justify-between items-center">
        <h2 class="font-bold">
          {{ isYesterday(date) ? "I går" : $dayjs(date).format("ddd D MMM") }}
          {{
            $dayjs(date).year() !== $dayjs().year() ? $dayjs(date).year() : ""
          }}
        </h2>
        <div class="mr-4 text-xs font-bold">
          {{ calculateDayTotal(entries) }}
        </div>
      </div>
      <ul class="mx-4 flex flex-col gap-0">
        <li
          v-for="(entriesByDescription, description) in groupByDescription(
            entries
          )"
          class="my-2"
          :key="description"
        >
          <TimeEntryGroup
            v-if="entriesByDescription.length > 1"
            :entriesByDescription="entriesByDescription"
            :description="description"
          />
          <div v-else>
            <TimeEntryForm
              :key="entriesByDescription[0].id"
              :timeEntry="entriesByDescription[0]"
            />
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>
