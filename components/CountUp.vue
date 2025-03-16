<template>
  <div>{{ formattedTime }}</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  startTime: {
    type: String,
    required: true,
  },
});

console.log(props.startTime);

const elapsedTime = ref(0); // Elapsed time in seconds

const formattedTime = computed(() => {
  return formatDuration(elapsedTime.value);
});

const updateElapsedTime = () => {
  const now = new Date();
  const targetDate = new Date(props.startTime);
  elapsedTime.value = Math.floor((now - targetDate) / 1000);
};

let interval = null;

onMounted(() => {
  updateElapsedTime();
  interval = setInterval(updateElapsedTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>
