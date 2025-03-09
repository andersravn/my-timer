<template>
  <ul>
    <li v-for="goal in goals" :key="goal.id">
      <div class="flex gap-2">
        <h2>{{ goal.name }}</h2>
        <p>{{ goal.duration }} timer</p>
        <p>{{ goal.day }}</p>
        <button @click="deleteGoal(goal.id)">
          <Icon name="lucide:trash" />
        </button>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { goals, deleteGoal } = useGoals();
</script>
