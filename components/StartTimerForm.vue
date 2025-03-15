<template>
  <div class="shadow-lg mb-4 p-2">
    <form
      @submit.prevent="handleFormSubmit"
      class="flex items-center gap-x-2"
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
    
    <!-- Template Selector -->
    <div v-if="!timer?.start_time" class="mt-3 flex items-center gap-x-2">
      <div class="w-full">
        <Select
          :options="templateOptions"
          v-model="selectedTemplateId"
          placeholder="Select a template..."
          class="w-full"
        />
      </div>
      <button 
        class="btn btn-outline btn-sm" 
        @click="createFromTemplate"
        :disabled="!selectedTemplateId || selectedTemplateId === ''"
      >
        Use Template
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TimeEntry } from "~/types/timer.types";
import type { TimeEntryTemplate } from "~/types/templates.types";

const {
  createNewTimeEntry,
  stopTimer,
  activeTimeEntry,
  setStartTime,
  timer,
  description,
  refreshTimeEntries,
} = useTimeEntries();

const { templates, createTimeEntryFromTemplate } = useTemplates();

const timerInputRef = useTemplateRef("timerInputRef");
const countUpRef = ref();
const toggleTimerInput = ref(false);
const selectedTemplateId = ref<string>("");
const { focused: countUpFocused } = useFocus(countUpRef);

// Transform templates into select options
const templateOptions = computed(() => {
  if (!templates.value) return [];
  
  return templates.value.map(template => ({
    label: template.description || 'Unnamed Template',
    value: template.id.toString(), // Convert to string because Select expects string values
  }));
});

// Get selected template object
const selectedTemplate = computed(() => {
  if (!selectedTemplateId.value || !templates.value) return null;
  
  // Convert selectedTemplateId back to number when finding the template
  const templateId = typeof selectedTemplateId.value === 'string' 
    ? parseInt(selectedTemplateId.value, 10) 
    : selectedTemplateId.value;
    
  return templates.value.find(t => t.id === templateId) || null;
});

// Create a time entry from selected template
async function createFromTemplate() {
  if (!selectedTemplate.value) return;
  
  try {
    // Call the composable function to create time entry from template
    await createTimeEntryFromTemplate(selectedTemplate.value);
    
    // Reset selection and refresh
    selectedTemplateId.value = "";
    refreshTimeEntries();
    
    // Show success indicator or feedback
    console.log('Time entry created from template successfully');
  } catch (error) {
    console.error('Error creating from template:', error);
    alert('Failed to create time entry from template');
  }
}

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
      refreshTimeEntries();
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      createNewTimeEntry({
        description: description.value,
      });
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
