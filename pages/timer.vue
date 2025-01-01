<script setup>
const { refreshTimeEntries } = useTimeEntries();
</script>

<template>
  <div class="w-full">
    <StartTimerForm @stop-timer="refreshTimeEntries" />
  </div>
  <TimeEntryList />
</template>
