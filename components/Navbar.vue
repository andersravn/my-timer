<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <NuxtLink :to="user ? '/timer' : '/'" class="btn btn-ghost text-xl"
        >ClockOut</NuxtLink
      >
    </div>
    <div class="flex-none">
      <!-- Authenticated User Menu -->
      <template v-if="user">
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
          <UserAvatar />
        </div>
      </template>

      <!-- Unauthenticated User Menu -->
      <template v-else>
        <div class="flex items-center gap-2">
          <ThemeController />
          <NuxtLink to="/login" class="btn btn-primary btn-sm">
            Sign In
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
</script>
