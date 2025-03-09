import type { TimeEntryBase } from "~/types/timer.types";

export function formatDuration(
  durationInSeconds: number,
  options: { padStartHours: number } = { padStartHours: 2 }
) {
  const hours = String(Math.floor(durationInSeconds / 3600)).padStart(
    options.padStartHours,
    "0"
  );
  const minutes = String(Math.floor((durationInSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(Math.floor(durationInSeconds % 60)).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function getTotalTimeInSeconds(timeEntries: TimeEntryBase[]) {
  const dayjs = useDayjs();

  const totalTime = timeEntries.reduce((acc, entry) => {
    if (entry.start_time && entry.end_time) {
      const start = dayjs(entry.start_time);
      const end = dayjs(entry.end_time);
      const duration = end.diff(start, "seconds");
      return acc + duration;
    }
    return acc;
  }, 0);

  return totalTime;
}

export function getDay() {}
