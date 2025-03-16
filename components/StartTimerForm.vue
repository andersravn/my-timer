<template>
  <div class="shadow-lg mb-4 p-2">
    <form @submit.prevent="handleFormSubmit" class="flex items-center gap-x-2">
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

      <!-- Template Dropdown Button -->
      <div v-if="!timer?.start_time" class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-outline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </label>
        <ul
          tabindex="0"
          id="templatesDropdown"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 overflow-auto"
        >
          <li
            v-if="!templateOptions || templateOptions.length === 0"
            class="menu-title"
          >
            <span>No templates available</span>
          </li>
          <li v-for="template in templateOptions" :key="template.value">
            <a @click="applyTemplate(template.value)">{{ template.label }}</a>
          </li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { type TimeEntry } from "~/types/timer.types";

const {
  createNewTimeEntry,
  stopTimer,
  activeTimeEntry,
  setStartTime,
  timer,
  description,
} = useTimeEntries();

const { templates, createTimeEntryFromTemplate } = useTemplates();

const timerInputRef = useTemplateRef("timerInputRef");
const countUpRef = ref();
const toggleTimerInput = ref(false);
const { focused: countUpFocused } = useFocus(countUpRef);

// Transform templates into select options
const templateOptions = computed(() => {
  if (!templates.value) return [];

  return templates.value.map((template) => ({
    label: template.description || "Unnamed Template",
    value: template.id.toString(), // Convert to string because we need string values
  }));
});

// Apply template directly when selected from dropdown
async function applyTemplate(templateId: string) {
  if (!templates.value) return;

  try {
    // Find the selected template
    const numericId = parseInt(templateId, 10);
    const template = templates.value.find((t) => t.id === numericId);

    if (!template) {
      console.error("Template not found");
      return;
    }

    // Apply the template
    await createTimeEntryFromTemplate(template);

    // Close the dropdown
    const dropdown = document.getElementById("templatesDropdown");
    if (dropdown) {
      dropdown.blur();
    }
  } catch (error) {
    console.error("Error creating from template:", error);
    alert("Failed to create time entry from template");
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
      await refreshNuxtData("time_entries");
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
