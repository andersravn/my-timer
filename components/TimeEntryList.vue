<script setup>
const { timeEntries } = useTimeEntries();
</script>

<template>
  <ul>
    <li v-for="entry in timeEntries" :key="entry.id">
      <TimeEntryForm :timeEntry="entry" />
    </li>
  </ul>
</template>
