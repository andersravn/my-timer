<template>
  <input
    type="text"
    class="w-[50px] p-1"
    :value="formatValue()"
    @blur="emitValue"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: { formatdate: false } },
});

const emit = defineEmits(["update:modelValue"]);

function emitValue(e: any) {
  let value = e.target.value;

  if (
    props.modelModifiers["formatdate"] &&
    props.modelValue &&
    typeof value === "string" &&
    value.length === 5
  ) {
    try {
      const date = new Date(props.modelValue);
      date.setHours(Number(value.split(":")[0]));
      date.setMinutes(Number(value.split(":")[1]));
      value = date.toISOString();
      emit("update:modelValue", value);
    } catch (error) {
      console.error(error);
      emit("update:modelValue", props.modelValue);
    }
  } else {
    emit("update:modelValue", props.modelValue);
  }
}

function formatValue() {
  if (props.modelModifiers["formatdate"] && props.modelValue) {
    const date = new Date(props.modelValue);
    return (
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0")
    );
  }

  return props.modelValue;
}
</script>
