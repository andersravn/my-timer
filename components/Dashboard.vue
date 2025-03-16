<template>
  <div class="flex gap-4">
    <div className="stats shadow">
      <div className="stat" v-if="todaysEntries?.length > 0">
        <div className="stat-title">I dag</div>
        <div className="stat-value">
          {{ formatDuration(elapsed, { padStartHours: 1 }) }}
        </div>
        <div className="stat-desc" v-if="goalForDayOfWeek">
          {{ goalForDayOfWeek.duration }} timer er dagens mål
        </div>
      </div>
    </div>
    <div className="stats shadow" v-if="showFinishedAtTime">
      <div className="stat" v-if="todaysEntries?.length > 0">
        <div className="stat-title">Færdig kl.</div>
        <div className="stat-value">{{ getFinishedAtTime() }}</div>
        <div className="stat-desc">{{ getBalanceDisplay() }}</div>
      </div>
    </div>
    <div className="stats shadow">
      <div className="stat" v-if="todaysEntries?.length > 0">
        <div className="stat-title">Denne uge</div>
        <div className="stat-value">{{ getWeeklyTotal() }}</div>
        <div className="stat-desc">Mål: {{ weeklyGoal }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimeEntries } from "~/composables/useTimeEntries";
import type { TimeEntry } from "~/types/timer.types";

const { timeEntries } = useTimeEntries();
const { goals } = useGoals();

const dayjs = useDayjs();

const goalForDayOfWeek = computed(() => {
  const dayOfWeek = dayjs().get("day");
  return goals.value?.find((goal) => {
    if (goal.day === "daily") {
      return true;
    }
    return goal.day === dayOfWeek.toString();
  });
});

const todaysEntries = computed(
  () =>
    timeEntries.value?.filter((entry) =>
      dayjs().isSame(new Date(entry.start_time || ""), "date")
    ) ?? []
);

const elapsed = computed(() => {
  return getTotalTimeInSeconds(todaysEntries.value);
});

const showFinishedAtTime = computed(() => {
  return (
    goalForDayOfWeek.value &&
    elapsed.value < goalForDayOfWeek.value.duration! * 60 * 60
  );
});

const weeklyGoal = computed(() => {
  return goals.value?.reduce((acc, goal) => {
    acc += goal.duration || 0;
    return acc;
  }, 0);
});

function getYesterdaysDurationInSeconds() {
  const yesterdaysEntries = timeEntries.value?.filter((entry) =>
    entry.start_time?.includes(
      dayjs().subtract(1, "day").toISOString().split("T")[0]
    )
  );
  return getTotalTimeInSeconds(yesterdaysEntries as TimeEntry[]);
}

// Helper function to get goal for a specific day
function getGoalForSpecificDay(dayNumber: number) {
  return goals.value?.find((goal) => {
    if (goal.day === "daily") {
      return true;
    }
    return goal.day === dayNumber.toString();
  });
}

// Calculate yesterday's balance (difference between time worked and goal)
function getYesterdayBalance() {
  // Get yesterday's date
  const yesterday = dayjs().subtract(1, "day");

  // Get yesterday's goal
  const yesterdayGoal = getGoalForSpecificDay(yesterday.get("day"));
  const yesterdayGoalInSeconds = yesterdayGoal?.duration
    ? yesterdayGoal.duration * 60 * 60
    : 0;

  // Get yesterday's actual duration
  const yesterdayDuration = getYesterdaysDurationInSeconds();

  // Calculate the balance (positive means surplus, negative means deficit)
  return yesterdayDuration - yesterdayGoalInSeconds;
}

// Updated getFinishedAtTime function with yesterday's balance only
function getFinishedAtTime() {
  const goal = goalForDayOfWeek.value;
  if (goal && goal.duration) {
    // Convert goal duration from hours to seconds
    const goalInSeconds = goal.duration * 60 * 60;

    // Get balance from yesterday
    const yesterdayBalance = getYesterdayBalance();

    // Apply yesterday's balance to today's remaining time
    const adjustedRemainingSeconds =
      goalInSeconds - elapsed.value - yesterdayBalance;

    // If we already reached today's goal with yesterday's balance
    if (adjustedRemainingSeconds <= 0) {
      return "Allerede nået";
    }

    // Calculate finish time (current time + adjusted remaining seconds)
    const end = new Date(Date.now() + adjustedRemainingSeconds * 1000);

    return end.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return null;
}

// Display function for yesterday's balance
function getBalanceDisplay() {
  const yesterdayBalance = getYesterdayBalance();

  if (Math.abs(yesterdayBalance) < 60) {
    return null; // Don't show for very small differences (less than a minute)
  }

  const formattedBalance = formatDuration(Math.abs(yesterdayBalance));

  if (yesterdayBalance > 0) {
    return `${formattedBalance} overskud fra i går`;
  } else {
    return `${formattedBalance} underskud fra i går`;
  }
}

function getDurationForEntryInSeconds(entry: TimeEntry) {
  const start = new Date(entry.start_time!);
  const end = new Date(entry.end_time!);
  const duration = end.getTime() - start.getTime();
  return Math.floor(duration / 1000);
}

function getWeeklyTotal() {
  const total = timeEntries.value?.reduce((acc, entry) => {
    if (dayjs(entry.start_time).isSame(dayjs(), "week")) {
      acc += getDurationForEntryInSeconds(entry as TimeEntry);
    }
    return acc;
  }, 0);

  if (total) {
    return formatDuration(total);
  }
}
</script>
