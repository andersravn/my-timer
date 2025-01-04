<template>
  <form
    @submit.prevent="handleFormSubmit"
    class="flex items-center gap-x-2 shadow-lg mb-4 p-2"
  >
    <input
      type="text"
      v-model="description"
      class="input input-bordered w-full"
      placeholder="Description..."
    />
    <div class="w-[68px] flex-shrink-0">
      <TimeInput
        v-if="timer?.start_time && toggleTimerInput"
        ref="timerInputRef"
        @update:model-value="updateStartTime"
        v-model.formatdate="timer.start_time"
      />
      <CountUp
        v-else-if="timer?.start_time && !timer?.end_time && !toggleTimerInput"
        ref="countUpRef"
        tabindex="0"
        :start-time="timer?.start_time"
      />
      <div v-else>00:00:00</div>
    </div>
    <button class="btn btn-primary" type="submit">
      <span v-if="timer?.start_time && !timer?.end_time">Stop</span>
      <span v-else>Start</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { type TimeEntry } from "~/types/timer.types";
const description = ref("");
const timer = ref<TimeEntry | null | undefined>(null);
const {
  createNewTimeEntry,
  stopTimer,
  activeTimeEntry,
  optimisticUpdateLatestTimeEntry,
  setStartTime,
} = useTimeEntries();

const timerInputRef = useTemplateRef("timerInputRef");
const countUpRef = ref();
const toggleTimerInput = ref(false);
const { focused: countUpFocused } = useFocus(countUpRef);

watch(
  countUpFocused,
  (value) => {
    if (value) {
      toggleTimerInput.value = true;
      useTimeoutFn(() => {
        timerInputRef.value?.inputRef?.focus();
      }, 1);
    }
  },
  { immediate: true }
);

const emit = defineEmits(["stopTimer"]);

watch(activeTimeEntry, () => {
  if (activeTimeEntry.value) {
    timer.value = activeTimeEntry.value as TimeEntry;
  }
  if (activeTimeEntry.value?.description) {
    description.value = activeTimeEntry.value.description;
  }
});

const handleFormSubmit = async () => {
  if (timer.value) {
    try {
      stopTimer({
        id: timer.value.id,
        description: description.value,
        endTime: new Date().toISOString(),
      });
      optimisticUpdateLatestTimeEntry(timer.value);
      timer.value = null;
      description.value = "";
      emit("stopTimer");
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const { data, error } = await createNewTimeEntry({
        description: description.value,
      });
      timer.value = data;
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  }
};

function updateStartTime(value: string) {
  if (timer.value) {
    setStartTime({ id: timer.value.id, startTime: value });
  }
  toggleTimerInput.value = false;
}
</script>
