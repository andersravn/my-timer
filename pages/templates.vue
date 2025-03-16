<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Time Entry Templates</h1>

    <!-- Template Form -->
    <div class="card bg-base-200 shadow-xl mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">
          {{ editingTemplate ? "Edit Template" : "Add New Template" }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <TextInput
            label="Description"
            v-model="form.description"
            placeholder="What is this template for?"
            required
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">Start Time</label>
              <TimeInput v-model.formatdate="form.start_time" required />
            </div>
            <div>
              <label class="label">End Time</label>
              <TimeInput v-model.formatdate="form.end_time" required />
            </div>
          </div>

          <div class="card-actions justify-end mt-4">
            <button
              v-if="editingTemplate"
              type="button"
              class="btn btn-outline"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editingTemplate ? "Update" : "Create" }} Template
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Template List -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">Your Templates</h2>

        <div
          v-if="!templates || templates.length === 0"
          class="text-center py-8"
        >
          <p class="text-gray-500">
            No templates found. Create your first template above!
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Description</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="template in templates" :key="template.id">
                <td>{{ template.description }}</td>
                <td>{{ formatTime(template.start_time) }}</td>
                <td>{{ formatTime(template.end_time) }}</td>
                <td>
                  {{ formatDuration(template.start_time, template.end_time) }}
                </td>
                <td class="flex items-center space-x-2">
                  <button
                    class="btn btn-sm btn-outline"
                    @click="editTemplate(template)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-error btn-outline"
                    @click="confirmDelete(template.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Do not import formatDuration, we'll implement our own version
import type {
  TimeEntryTemplate,
  TimeEntryTemplateFormValues,
} from "~/types/templates.types";

definePageMeta({
  layout: "default",
});

// Form State
const form = ref<TimeEntryTemplateFormValues>({
  description: "",
  start_time: new Date().toISOString(),
  end_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Default to now + 30 minutes
});

// Template being edited
const editingTemplate = ref<TimeEntryTemplate | null>(null);

// Get templates from composable
const {
  templates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  refreshTemplates,
} = useTemplates();

// Edit template function
function editTemplate(template: TimeEntryTemplate) {
  editingTemplate.value = template;
  form.value = {
    description: template.description || "",
    start_time: template.start_time || new Date().toISOString(),
    end_time: template.end_time || new Date().toISOString(),
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cancel edit
function cancelEdit() {
  editingTemplate.value = null;
  resetForm();
}

// Reset form
function resetForm() {
  form.value = {
    description: "",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Default to now + 30 minutes
  };
}

// Handle form submission
async function handleSubmit() {
  try {
    if (editingTemplate.value) {
      // Update existing template
      await updateTemplate({
        id: editingTemplate.value.id,
        ...form.value,
      });
      editingTemplate.value = null;
    } else {
      // Create new template
      await createTemplate(form.value);
    }
    resetForm();
    refreshTemplates();
  } catch (error) {
    console.error("Error saving template:", error);
  }
}

// Confirm delete
function confirmDelete(id: number) {
  // Simple confirmation
  if (confirm("Are you sure you want to delete this template?")) {
    deleteTemplate(id);
  }
}

// Format time for display
function formatTime(timeString: string | null) {
  if (!timeString) return "";
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Custom duration formatting for templates
function formatDuration(startTime: string | null, endTime: string | null) {
  if (!startTime || !endTime) return "--:--:--";

  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationInSeconds = Math.floor(
    (end.getTime() - start.getTime()) / 1000
  );

  const hours = String(Math.floor(durationInSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((durationInSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(Math.floor(durationInSeconds % 60)).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
</script>
