<template>
  <input
    type="text"
    class="max-w-16 input input-xs sm:input-sm input-bordered"
    :value="formatValue()"
    ref="input"
    @blur="handleInput"
    placeholder="HH:MM"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: { formatdate: false } },
});

const inputRef = useTemplateRef("input");
defineExpose({
  inputRef,
});

const emit = defineEmits(["update:modelValue"]);

function handleInput(e: any) {
  let value = e.target.value;

  // If empty, don't process
  if (!value || value.trim() === "") {
    emit("update:modelValue", props.modelValue);
    return;
  }

  // Replace dots with colons
  value = value.replace(/\./g, ":");

  // Parse the input based on different formats
  let hours = 0;
  let minutes = 0;

  if (value.includes(":")) {
    // Format like "8:" or "9:00" or "08:30"
    const parts = value.split(":");
    hours = parseInt(parts[0], 10);
    minutes = parts.length > 1 && parts[1] ? parseInt(parts[1], 10) : 0;
  } else if (value.length <= 2) {
    // Just hours like "8" or "12"
    hours = parseInt(value, 10);
    minutes = 0;
  } else {
    // Format like "0830" or "1230"
    if (value.length === 3) {
      // For formats like "830"
      hours = parseInt(value.substring(0, 1), 10);
      minutes = parseInt(value.substring(1), 10);
    } else {
      // For formats like "0830" or "1230"
      hours = parseInt(value.substring(0, 2), 10);
      minutes = parseInt(value.substring(2), 10);
    }
  }

  // Handle invalid inputs
  if (isNaN(hours) || isNaN(minutes)) {
    emit("update:modelValue", props.modelValue);
    return;
  }

  // Validate and adjust hours and minutes
  hours = hours % 24; // Ensure hours are between 0-23
  minutes = Math.min(59, Math.max(0, minutes)); // Ensure minutes are between 0-59

  // Format the time as "HH:MM"
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;

  if (props.modelModifiers["formatdate"] && props.modelValue) {
    try {
      const date = new Date(props.modelValue);
      date.setHours(hours);
      date.setMinutes(minutes);
      emit("update:modelValue", date.toISOString());
    } catch (error) {
      console.error(error);
      emit("update:modelValue", props.modelValue);
    }
  } else {
    emit("update:modelValue", formattedTime);
  }
}

function formatValue() {
  if (props.modelModifiers["formatdate"] && props.modelValue) {
    const date = new Date(props.modelValue);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  }

  return props.modelValue;
}
</script>
