<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Goals</h1>

    <!-- Goal Form -->
    <div class="card bg-base-200 shadow-xl mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">
          {{ editingGoal ? "Edit Goal" : "Add New Goal" }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <TextInput
            label="Name"
            v-model="form.name"
            placeholder="Goal name"
            required
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Hours"
              v-model="form.duration"
              placeholder="e.g. 2.5"
              required
            />
            <div>
              <label class="label">Day</label>
              <Select
                :options="[
                  { label: 'Every day', value: 'daily' },
                  { label: 'Monday', value: '1' },
                  { label: 'Tuesday', value: '2' },
                  { label: 'Wednesday', value: '3' },
                  { label: 'Thursday', value: '4' },
                  { label: 'Friday', value: '5' },
                  { label: 'Saturday', value: '6' },
                  { label: 'Sunday', value: '0' },
                  { label: 'Weekly', value: 'weekly' },
                ]"
                v-model="form.day"
              />
            </div>
          </div>

          <div class="card-actions justify-end mt-4">
            <button
              v-if="editingGoal"
              type="button"
              class="btn btn-outline"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editingGoal ? "Update" : "Create" }} Goal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Goal List -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">Your Goals</h2>

        <div v-if="!goals || goals.length === 0" class="text-center py-8">
          <p class="text-gray-500">
            No goals found. Create your first goal above!
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Hours</th>
                <th>Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="goal in goals" :key="goal.id">
                <td>{{ goal.name }}</td>
                <td>{{ goal.duration }}</td>
                <td>{{ formatDay(goal.day) }}</td>
                <td class="flex items-center space-x-2">
                  <button
                    class="btn btn-sm btn-outline"
                    @click="editGoal(goal)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-error btn-outline"
                    @click="confirmDelete(goal.id)"
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
import type { GoalFormValues } from "~/types/goal.types";

definePageMeta({
  layout: "default",
});

// Get goals from composable
const { goals, createNewGoal, updateGoal, deleteGoal, refreshGoals } =
  useGoals();

// Form State
const form = ref<GoalFormValues>({
  name: "",
  duration: "",
  day: "daily",
});

// Currently editing goal
const editingGoal = ref<any | null>(null);

// Edit goal function
function editGoal(goal: any) {
  editingGoal.value = goal;
  form.value = {
    name: goal.name || "",
    duration: goal.duration?.toString() || "",
    day: goal.day || "daily",
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cancel edit
function cancelEdit() {
  editingGoal.value = null;
  resetForm();
}

// Reset form
function resetForm() {
  form.value = {
    name: "",
    duration: "",
    day: "daily",
  };
}

// Handle form submission
async function handleSubmit() {
  if (!form.value.name || !form.value.duration) {
    return;
  }

  try {
    if (editingGoal.value) {
      // Update existing goal
      await updateGoal(editingGoal.value.id, form.value);
      editingGoal.value = null;
    } else {
      // Create new goal
      await createNewGoal(form.value);
    }
    resetForm();
    refreshGoals();
  } catch (error) {
    console.error("Error saving goal:", error);
  }
}

// Confirm delete
function confirmDelete(id: number) {
  if (confirm("Are you sure you want to delete this goal?")) {
    deleteGoal(id);
  }
}

// Format day for display
function formatDay(day: string | null) {
  if (!day) return "";

  const dayMap: { [key: string]: string } = {
    daily: "Every day",
    weekly: "Weekly",
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
  };

  return dayMap[day] || day;
}
</script>
