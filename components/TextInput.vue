<template>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <input
      type="text"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      class="input input-bordered w-full max-w-xs"
    />
  </label>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps<{
  label: string;
  placeholder?: string;
  modelValue: string | number;
}>();

const emit = defineEmits(["update:modelValue"]);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    emit("update:modelValue", target.value);
  }
};
</script>
