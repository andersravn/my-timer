<template>
  <label class="form-control w-full max-w-xs">
    <div class="label" v-if="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <select
      class="select select-bordered"
      :value="modelValue"
      @change="handleChange"
    >
      <option v-if="placeholder" disabled selected value="">
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}>();

const emit = defineEmits(["update:modelValue"]);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
};
</script>
