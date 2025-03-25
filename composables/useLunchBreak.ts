// composables/useLunchBreak.ts
import { ref, computed, onMounted } from "vue";

export interface LunchBreakSettings {
  enableLunchBreak: boolean;
  lunchStartTime: string;
  lunchDurationMinutes: number;
}

export function useLunchBreak() {
  // Default settings
  const defaultSettings: LunchBreakSettings = {
    enableLunchBreak: true,
    lunchStartTime: "12:00",
    lunchDurationMinutes: 30,
  };

  // Create reactive reference for settings
  const lunchSettings = ref<LunchBreakSettings>({ ...defaultSettings });

  // Load settings from localStorage on mount
  onMounted(() => {
    const savedSettings = localStorage.getItem("lunchBreakSettings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        lunchSettings.value = {
          ...defaultSettings,
          ...parsedSettings,
        };
      } catch (e) {
        console.error("Error parsing lunch break settings", e);
      }
    }
  });

  // Function to save settings to localStorage
  const saveLunchSettings = (settings: LunchBreakSettings) => {
    lunchSettings.value = settings;
    localStorage.setItem("lunchBreakSettings", JSON.stringify(settings));
  };

  // Parse lunch start time to minutes since midnight
  const lunchStartMinutes = computed(() => {
    try {
      const [hours, minutes] = lunchSettings.value.lunchStartTime
        .split(":")
        .map(Number);
      return hours * 60 + minutes;
    } catch (e) {
      console.error("Error parsing lunch start time", e);
      return 12 * 60; // Default to 12:00
    }
  });

  // Calculate additional time needed for lunch break
  const calculateLunchBreakAdjustment = (
    currentTimeInMinutes: number,
    workEndTimeInMinutes: number
  ): number => {
    if (!lunchSettings.value.enableLunchBreak) {
      return 0;
    }

    const lunchStart = lunchStartMinutes.value;
    const lunchEnd = lunchStart + lunchSettings.value.lunchDurationMinutes;

    // If current time is before lunch start and work would end after lunch start
    if (
      currentTimeInMinutes < lunchStart &&
      workEndTimeInMinutes >= lunchStart
    ) {
      return lunchSettings.value.lunchDurationMinutes * 60; // Convert to seconds
    }

    // If current time is during lunch break
    if (currentTimeInMinutes >= lunchStart && currentTimeInMinutes < lunchEnd) {
      const remainingLunchMinutes = lunchEnd - currentTimeInMinutes;
      return remainingLunchMinutes * 60; // Convert to seconds
    }

    // If current time is after lunch break or work would end before lunch
    return 0;
  };

  return {
    lunchSettings,
    saveLunchSettings,
    calculateLunchBreakAdjustment,
    lunchStartMinutes,
  };
}
