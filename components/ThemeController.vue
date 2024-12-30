<template>
  <select
    class="select select-sm w-full max-w-xs"
    v-model="colorMode.preference"
  >
    <option disabled selected>Theme</option>
    <option v-for="theme of themes" :key="theme">
      {{ theme }}
    </option>
  </select>
</template>

<script setup>
import { _themes as daisyThemes } from "#tailwind-config/daisyui";

const colorMode = useColorMode();

const themes = ["system", ...daisyThemes];
</script>
