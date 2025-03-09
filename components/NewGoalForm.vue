<template>
  <form class="flex items-end gap-4" @submit.prevent="handleFormSubmit">
    <TextInput label="Navn" placeholder="Navn på mål" v-model="form.name" />

    <TextInput label="Timer" v-model="form.duration" />
    <Select
      label="Dag"
      :options="[
        { label: 'Hver dag', value: 'daily' },
        { label: 'Mandag', value: '1' },
        { label: 'Tirsdag', value: '2' },
        { label: 'Onsdag', value: '3' },
        { label: 'Torsdag', value: '4' },
        { label: 'Fredag', value: '5' },
        { label: 'Lørdag', value: '6' },
        { label: 'Søndag', value: '0' },
        { label: 'Ugentlig', value: 'weekly' },
      ]"
      v-model="form.day"
    />

    <button type="submit" class="btn btn-primary">Opret mål</button>
  </form>
</template>

<script setup lang="ts">
import type { GoalFormValues } from "~/types/goal.types";

const { createNewGoal } = useGoals();
const form = reactive<GoalFormValues>({
  name: "",
  duration: "",
  day: "daily",
});

const handleFormSubmit = async () => {
  if (!form.name || !form.duration) {
    return;
  }
  try {
    createNewGoal(form);
    form.name = "";
    form.duration = "";
    form.day = "daily";
  } catch (error) {
    console.error(error);
  }
};
</script>
