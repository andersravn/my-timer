<template>
  <ClientOnly>
    <div class="flex gap-4 flex-wrap">
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">Today</div>
          <div class="stat-value min-w-[180px]">
            {{ formattedTodayTime }}
          </div>
          <div class="stat-desc" v-if="goalForDayOfWeek">
            {{ goalForDayOfWeek.duration }} is today's goal
          </div>
        </div>
      </div>
      <div class="stats shadow" v-if="showFinishedAtTime">
        <div class="stat" v-if="todaysEntries?.length > 0">
          <div class="stat-title">Finish at</div>
          <div class="stat-value min-w-[80px]">
            {{ finishAtTime }}
          </div>
          <div class="stat-desc">{{ getBalanceDisplay() }}</div>
        </div>
      </div>
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">This week</div>
          <div class="stat-value min-w-[100px]">
            {{ formattedWeeklyTime }}
          </div>
          <div class="stat-desc">Goal: {{ weeklyGoal }} hours</div>
        </div>
      </div>
    </div>

    <template #fallback>
      <div class="flex gap-4">
        <div
          v-for="index in 3"
          class="w-[180px] rounded h-[112px] animate-pulse bg-neutral-content/80"
        ></div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useTimeEntries } from "~/composables/useTimeEntries";
import { formatDuration } from "~/utils/time";
import type { TimeEntry } from "~/types/timer.types";

const { timeEntries, timer } = useTimeEntries();
const { goals } = useGoals();

const dayjs = useDayjs();

// Reactive references for live tracking
const currentElapsedSeconds = ref(0);
const weeklyElapsedSeconds = ref(0);
let intervalId: NodeJS.Timeout | null = null;

// Helper to get total seconds from completed entries
function getTotalTimeInSeconds(entries: TimeEntry[]) {
  return entries.reduce((acc, entry) => {
    if (entry.start_time && entry.end_time) {
      const start = new Date(entry.start_time);
      const end = new Date(entry.end_time);
      const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
      return acc + duration;
    }
    return acc;
  }, 0);
}

// Get completed entries for today (excluding active timer)
const completedTodaysEntries = computed(
  () =>
    timeEntries.value?.filter(
      (entry) =>
        dayjs().isSame(new Date(entry.start_time || ""), "date") &&
        entry.end_time
    ) ?? []
);

// Get completed entries for this week (excluding active timer)
const completedWeeklyEntries = computed(
  () =>
    timeEntries.value?.filter(
      (entry) =>
        dayjs(entry.start_time).isSame(dayjs(), "week") && entry.end_time
    ) ?? []
);

// Base elapsed time (excluding active timer)
const baseElapsedToday = computed(() => {
  return getTotalTimeInSeconds(completedTodaysEntries.value as TimeEntry[]);
});

// Base elapsed time for the week (excluding active timer)
const baseElapsedWeek = computed(() => {
  return getTotalTimeInSeconds(completedWeeklyEntries.value as TimeEntry[]);
});

// Is there an active timer running?
const hasActiveTimer = computed(() => {
  // First check the timer reference (which is updated immediately on start/stop)
  if (timer.value && timer.value.start_time && !timer.value.end_time) {
    return true;
  }

  return false;
});

// Get the active timer's start time
const activeTimerStartTime = computed(() => {
  // First check the timer reference (which is updated immediately on timer start)
  if (timer.value?.start_time && !timer.value.end_time) {
    return new Date(timer.value.start_time);
  }

  return null;
});

// Calculate additional time from active timer
function updateLiveTimers() {
  // If no active timer, just use the base values
  if (!hasActiveTimer.value || !activeTimerStartTime.value) {
    currentElapsedSeconds.value = baseElapsedToday.value;
    weeklyElapsedSeconds.value = baseElapsedWeek.value;
    return;
  }

  const now = new Date();
  const startTime = activeTimerStartTime.value;
  const currentSeconds = Math.floor(
    (now.getTime() - startTime.getTime()) / 1000
  );

  // Only add active timer to today's total if it started today
  if (dayjs(startTime).isSame(dayjs(), "day")) {
    currentElapsedSeconds.value = baseElapsedToday.value + currentSeconds;
  } else {
    currentElapsedSeconds.value = baseElapsedToday.value;
  }

  // Add active timer to weekly total if it started this week
  if (dayjs(startTime).isSame(dayjs(), "week")) {
    weeklyElapsedSeconds.value = baseElapsedWeek.value + currentSeconds;
  } else {
    weeklyElapsedSeconds.value = baseElapsedWeek.value;
  }
}

// Format the time with/without seconds depending on the component
const formattedTodayTime = computed(() => {
  return formatDuration(currentElapsedSeconds.value, { padStartHours: 1 });
});

const formattedWeeklyTime = computed(() => {
  // Format weekly time without seconds
  const hours = String(Math.floor(weeklyElapsedSeconds.value / 3600)).padStart(
    1,
    "0"
  );
  const minutes = String(
    Math.floor((weeklyElapsedSeconds.value % 3600) / 60)
  ).padStart(2, "0");
  return `${hours}:${minutes}`;
});

// Combined elapsed time (for other calculations)
const elapsed = computed(() => {
  return currentElapsedSeconds.value;
});

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

// Calculate finish time as a computed property so it updates automatically
const finishAtTime = computed(() => {
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
      return "Already done";
    }

    // Calculate finish time (current time + adjusted remaining seconds)
    const end = new Date(Date.now() + adjustedRemainingSeconds * 1000);

    return end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return null;
});

// Display function for yesterday's balance
function getBalanceDisplay() {
  const yesterdayBalance = getYesterdayBalance();

  if (Math.abs(yesterdayBalance) < 60) {
    return null; // Don't show for very small differences (less than a minute)
  }

  const formattedBalance = formatDuration(Math.abs(yesterdayBalance));

  if (yesterdayBalance > 0) {
    return `${formattedBalance} surplus from yesterday`;
  } else {
    return `${formattedBalance} deficit from yesterday`;
  }
}

// Start or stop interval based on active timer status
function manageInterval() {
  if (hasActiveTimer.value && !intervalId) {
    // Start the interval if there's an active timer but no interval
    intervalId = setInterval(updateLiveTimers, 1000);
  } else if (!hasActiveTimer.value && intervalId) {
    // Stop the interval if there's no active timer but an interval is running
    clearInterval(intervalId);
    intervalId = null;
  }
}

// Setup for component lifecycle
let refreshInterval: NodeJS.Timeout | null = null;

onMounted(() => {
  // Initial update for entries
  updateLiveTimers();

  // Setup interval management
  manageInterval();

  // Force an update every 10 seconds even without active timer
  // This ensures data stays fresh if updates happen in another tab/device
  refreshInterval = setInterval(() => {
    updateLiveTimers();
  }, 10000);
});

// Watch timeEntries collection for changes (detects new/completed entries)
watch(
  [timeEntries],
  () => {
    // Force immediate update when timeEntries change
    updateLiveTimers();
  },
  { immediate: true }
);

// Watch BOTH activeTimeEntry and timer for changes (handles active timer state)
watch(
  [timer],
  () => {
    // Force immediate update
    updateLiveTimers();

    // Manage the interval
    manageInterval();

    // Additionally force an update after a small delay to catch any async changes
    setTimeout(() => {
      updateLiveTimers();
      manageInterval();
    }, 50);
  },
  { immediate: true, deep: true }
);

// Direct watch on timer.value.end_time to detect timer stopping
watch(
  () => timer.value?.end_time,
  (newEndTime) => {
    // If the timer now has an end time, it's been stopped
    if (newEndTime) {
      // Update immediately
      updateLiveTimers();

      // Also ensure the interval is stopped if needed
      if (intervalId && !hasActiveTimer.value) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  },
  { immediate: true }
);

// Also watch the computed hasActiveTimer directly to handle edge cases
watch(
  hasActiveTimer,
  (newValue) => {
    // If there's now an active timer but no interval
    if (newValue && !intervalId) {
      intervalId = setInterval(updateLiveTimers, 1000);
    }
    // If there's no active timer but an interval is running
    else if (!newValue && intervalId) {
      clearInterval(intervalId);
      intervalId = null;

      // Important: Update one last time to ensure we have the final state
      updateLiveTimers();
    }
  },
  { immediate: true }
);

// Clean up intervals when component unmounts
onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
});
</script>
