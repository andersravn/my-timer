<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">P.T.</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li>
          <NuxtLink to="/timer">Timer</NuxtLink>
        </li>
      </ul>
      <ThemeController />
      <div class="avatar placeholder">
        <div class="bg-neutral text-neutral-content w-8 rounded-full">
          <span class="text-xs uppercase">{{
            user?.email?.substring(0, 2)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
</script>
