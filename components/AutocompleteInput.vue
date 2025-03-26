<template>
  <div class="relative w-full">
    <input
      type="text"
      :value="modelValue"
      @input="updateValue($event.target.value)"
      @keydown.down.prevent="navigateSuggestions(1)"
      @keydown.up.prevent="navigateSuggestions(-1)"
      @keydown.enter.prevent="selectSuggestion"
      @keydown.esc.prevent="closeSuggestions"
      @blur="handleBlur"
      :class="['input input-bordered w-full', inputClass]"
      :placeholder="placeholder"
    />
    <div
      v-if="shouldShowSuggestions"
      class="absolute z-10 w-full mt-1 bg-base-100 rounded-md shadow-lg border border-base-300 max-h-60 overflow-y-auto"
    >
      <div
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        @mousedown.prevent="selectItem(suggestion)"
        :class="[
          'p-3 hover:bg-base-200 cursor-pointer',
          { 'bg-base-200': index === activeIndex },
        ]"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  suggestions: {
    type: Array,
    default: () => [],
  },
  inputClass: {
    type: [String, Object, Array],
    default: "",
  },
  placeholder: {
    type: String,
    default: "Type to search...",
  },
  minChars: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const activeIndex = ref(-1);
let closeTimeout = null;

const filteredSuggestions = computed(() => {
  const input = props.modelValue.toLowerCase().trim();

  if (input.length < props.minChars) {
    return [];
  }

  return props.suggestions.filter((item) => item.toLowerCase().includes(input));
});

const shouldShowSuggestions = computed(() => {
  // Don't show if no suggestions
  if (filteredSuggestions.value.length === 0 || !isOpen.value) {
    return false;
  }

  // Don't show if only one suggestion that exactly matches the input
  if (filteredSuggestions.value.length === 1) {
    const onlySuggestion = filteredSuggestions.value[0].toLowerCase();
    const currentInput = props.modelValue.toLowerCase().trim();

    if (onlySuggestion === currentInput) {
      return false;
    }
  }

  return true;
});

watch(filteredSuggestions, () => {
  isOpen.value = filteredSuggestions.value.length > 0;
  activeIndex.value = -1;
});

function updateValue(value) {
  emit("update:modelValue", value);
  isOpen.value = true;
}

function selectItem(suggestion) {
  emit("update:modelValue", suggestion);
  isOpen.value = false;
  activeIndex.value = -1;
}

function navigateSuggestions(direction) {
  if (!isOpen.value) {
    isOpen.value = true;
    return;
  }

  const newIndex = activeIndex.value + direction;

  if (newIndex >= 0 && newIndex < filteredSuggestions.value.length) {
    activeIndex.value = newIndex;
  }
}

function selectSuggestion() {
  if (
    activeIndex.value >= 0 &&
    activeIndex.value < filteredSuggestions.value.length
  ) {
    selectItem(filteredSuggestions.value[activeIndex.value]);
  }
}

function handleBlur() {
  // Delay closing to allow click on suggestion to register
  closeTimeout = setTimeout(() => {
    isOpen.value = false;
    activeIndex.value = -1;
  }, 150);
}

function closeSuggestions() {
  isOpen.value = false;
  activeIndex.value = -1;
}

// Clean up timeout when component is unmounted
onBeforeUnmount(() => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
});
</script>
