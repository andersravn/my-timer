<template>
  <div class="collapse collapse-arrow bg-base-200 mb-4">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      <i class="fas fa-cog mr-2"></i> Lunch Break Settings
    </div>
    <div class="collapse-content">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Enable lunch break</span>
          </label>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            v-model="settings.enableLunchBreak"
            @change="saveSettings"
          />
        </div>

        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Lunch start time</span>
          </label>
          <TimeInput
            v-model="settings.lunchStartTime"
            @update:modelValue="saveSettings"
          />
        </div>

        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Lunch duration (minutes)</span>
          </label>
          <input
            type="number"
            class="input input-bordered w-full max-w-xs"
            v-model="settings.lunchDurationMinutes"
            min="0"
            max="120"
            step="5"
            @change="saveSettings"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TimeInput from "~/components/TimeInput.vue";

// Default settings
const defaultSettings = {
  enableLunchBreak: true,
  lunchStartTime: "12:00",
  lunchDurationMinutes: 30,
};

// Settings state
const settings = ref({ ...defaultSettings });

// Load settings from localStorage
function loadSettings() {
  const savedSettings = localStorage.getItem("lunchBreakSettings");
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      settings.value = {
        ...defaultSettings,
        ...parsedSettings,
      };
    } catch (e) {
      console.error("Error parsing lunch break settings", e);
      settings.value = { ...defaultSettings };
    }
  }
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem("lunchBreakSettings", JSON.stringify(settings.value));
  // Emit event so parent components can react to settings changes
  emit("settings-updated", settings.value);
}

// Expose settings to parent component
const emit = defineEmits(["settings-updated"]);
defineExpose({ settings });

// Load settings on component mount
onMounted(() => {
  loadSettings();
});
</script>
