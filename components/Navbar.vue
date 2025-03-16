<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">P.T.</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal !flex-nowrap px-1">
        <li>
          <NuxtLink to="/timer">Timer</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/templates">Templates</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/goals">Goals</NuxtLink>
        </li>
      </ul>
      <div class="flex items-center gap-2">
        <ThemeController />
        <UserAvatar v-if="user" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
</script>
