<template>
  <div class="container mx-auto p-4">
    <!-- Lunch Break Settings Component -->
    <LunchBreakSettings @settings-updated="handleLunchSettingsUpdate" />
  </div>
</template>

<script setup lang="ts">
import { useLunchBreak } from "~/composables/useLunchBreak";
import LunchBreakSettings from "~/components/LunchBreakSettings.vue";

const { lunchSettings } = useLunchBreak();

// Handle lunch settings updates
function handleLunchSettingsUpdate(settings: any) {
  Object.assign(lunchSettings.value, settings);
}
</script>
