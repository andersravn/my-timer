<template>
  <div>
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
          <div class="stat">
            <div class="stat-title">Finish at</div>
            <div class="stat-value min-w-[80px]">
              {{ finishAtTime }}
            </div>
            <div class="stat-desc">
              <div>{{ getBalanceDisplay() }}</div>
              <div>
                Recommended work hours for today:
                {{ getRecommendedHoursForToday().toFixed(1) }}
              </div>
              <div v-if="lunchSettings.enableLunchBreak && isLunchIncluded">
                <i class="fas fa-utensils text-xs mr-1"></i>
                Includes {{ lunchSettings.lunchDurationMinutes }} min lunch at
                {{ lunchSettings.lunchStartTime }}
              </div>
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { useTimeEntries } from "~/composables/useTimeEntries";
import { formatDuration } from "~/utils/time";
import { useLunchBreak } from "~/composables/useLunchBreak";
import type { TimeEntry } from "~/types/timer.types";

const { timeEntries, timer } = useTimeEntries();
const { goals } = useGoals();
const { lunchSettings, calculateLunchBreakAdjustment } = useLunchBreak();

const dayjs = useDayjs();

// Lunch break inclusion flag
const isLunchIncluded = ref(false);

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
  return goalForDayOfWeek.value && elapsed.value;
});

const weeklyGoal = computed(() => {
  return (
    goals.value?.reduce((acc, goal) => {
      acc += goal.duration || 0;
      return acc;
    }, 0) || 0
  );
});

// Calculate weekly balance up until today
function getWeeklyBalanceUntilYesterday() {
  // Get current day of week (0-6, where 0 is Sunday)
  const today = dayjs();
  const currentDayOfWeek = today.day();

  // Convert to Monday-based week (1-7, where 1 is Monday)
  const mondayBasedDay = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

  // Calculate how many days we need to check (from Monday to yesterday)
  const daysToCheck = mondayBasedDay - 1;

  if (daysToCheck <= 0) {
    // It's Monday, no previous days in this week
    return 0;
  }

  let totalBalance = 0;

  // Loop through each day from Monday to yesterday
  for (let i = 1; i <= daysToCheck; i++) {
    // Calculate the date for this day
    const checkDate = today.subtract(mondayBasedDay - i, "day");

    // Get the goal for this day
    const dayGoal = getGoalForSpecificDay(checkDate.day());
    const dayGoalInSeconds = dayGoal?.duration ? dayGoal.duration * 60 * 60 : 0;

    // Get the entries for this day
    const dayEntries =
      timeEntries.value?.filter(
        (entry) =>
          entry.start_time && dayjs(entry.start_time).isSame(checkDate, "date")
      ) || [];

    // Calculate actual work duration for this day
    const actualWorkSeconds = getTotalTimeInSeconds(dayEntries as TimeEntry[]);

    // Add this day's balance to the total
    totalBalance += actualWorkSeconds - dayGoalInSeconds;
  }

  return totalBalance;
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

// Calculate remaining time for the week
function getRemainingWeeklyHours() {
  // Calculate total week goal in seconds
  const totalWeekGoalSeconds = weeklyGoal.value * 60 * 60;

  // Calculate total work done so far this week (excluding current day)
  const workDoneThisWeekSeconds =
    weeklyElapsedSeconds.value - currentElapsedSeconds.value;

  // Calculate remaining hours for the week (excluding today)
  return (totalWeekGoalSeconds - workDoneThisWeekSeconds) / 3600;
}

// Calculate recommended hours for today based on weekly goal
function getRecommendedHoursForToday() {
  // Get remaining days in the work week (including today)
  const today = dayjs();
  const currentDayOfWeek = today.day();

  // Convert to Monday-based week (1-7, where 1 is Monday)
  const mondayBasedDay = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

  // Calculate remaining workdays (assuming 5-day work week, Mon-Fri)
  const remainingWorkdays = Math.min(6 - mondayBasedDay, 5 - mondayBasedDay);
  const remainingDays = remainingWorkdays + 1; // +1 to include today

  // Get today's standard goal
  const todayStandardGoal = goalForDayOfWeek.value?.duration || 0;

  // Calculate remaining hours for the week
  const remainingWeeklyHours = getRemainingWeeklyHours();

  // If we're on the last workday of the week, all remaining hours go to today
  if (remainingDays === 1) {
    return remainingWeeklyHours;
  }

  // Otherwise, distribute the remaining hours evenly
  // But never go below today's standard goal unless absolutely necessary
  const recommendedHoursForToday = Math.max(
    todayStandardGoal,
    remainingWeeklyHours / remainingDays
  );

  return recommendedHoursForToday;
}

// Updated finish time calculation with lunch break
const finishAtTime = computed(() => {
  const goal = goalForDayOfWeek.value;
  if (goal && goal.duration) {
    // Convert goal duration from hours to seconds
    const goalInSeconds = goal.duration * 60 * 60;

    // Get balance from all previous days this week
    const weeklyBalance = getWeeklyBalanceUntilYesterday();

    // Apply weekly balance to today's remaining time
    const adjustedRemainingSeconds =
      goalInSeconds - elapsed.value - weeklyBalance;

    // If we already reached today's goal with weekly balance
    if (adjustedRemainingSeconds <= 0) {
      isLunchIncluded.value = false;
      return "Already done";
    }

    // Get current time for lunch break calculation
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Convert current time to minutes since midnight for easier comparison
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Calculate work end time in minutes (without lunch)
    const workEndTimeInMinutes =
      currentTimeInMinutes + adjustedRemainingSeconds / 60;

    // Calculate lunch break adjustment
    const lunchBreakAdjustment = calculateLunchBreakAdjustment(
      currentTimeInMinutes,
      workEndTimeInMinutes
    );

    // Set lunch included flag for UI
    isLunchIncluded.value = lunchBreakAdjustment > 0;

    // Calculate finish time with lunch break considered
    const totalRemainingSeconds =
      adjustedRemainingSeconds + lunchBreakAdjustment;
    const end = new Date(Date.now() + totalRemainingSeconds * 1000);

    return end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return null;
});

// Updated balance display function
function getBalanceDisplay() {
  const weeklyBalance = getWeeklyBalanceUntilYesterday();

  if (Math.abs(weeklyBalance) < 60) {
    return null; // Don't show for very small differences (less than a minute)
  }

  const formattedBalance = formatDuration(Math.abs(weeklyBalance));

  if (weeklyBalance > 0) {
    return `${formattedBalance} surplus this week`;
  } else {
    return `${formattedBalance} deficit this week`;
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

// Cleanup on component unmount
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

// Existing watchers and other code...
watch(
  [timeEntries],
  () => {
    updateLiveTimers();
  },
  { immediate: true }
);

watch(
  [timer],
  () => {
    updateLiveTimers();
    manageInterval();
    setTimeout(() => {
      updateLiveTimers();
      manageInterval();
    }, 50);
  },
  { immediate: true, deep: true }
);

watch(
  () => timer.value?.end_time,
  (newEndTime) => {
    if (newEndTime) {
      updateLiveTimers();
      if (intervalId && !hasActiveTimer.value) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  },
  { immediate: true }
);

watch(
  hasActiveTimer,
  (newValue) => {
    if (newValue && !intervalId) {
      intervalId = setInterval(updateLiveTimers, 1000);
    } else if (!newValue && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      updateLiveTimers();
    }
  },
  { immediate: true }
);
</script>
