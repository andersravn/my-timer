<template>
  <div class="dropdown dropdown-end">
    <!-- Avatar that triggers dropdown -->
    <div tabindex="0" class="avatar placeholder cursor-pointer">
      <div class="bg-neutral text-neutral-content w-8 rounded-full">
        <span class="text-xs uppercase">{{ userInitials }}</span>
      </div>
    </div>
    
    <!-- Dropdown menu -->
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
      <li class="menu-title">
        <span>{{ userEmail }}</span>
      </li>
      <li><a @click="handleLogout">Log out</a></li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const router = useRouter();

// Get user initials from email (first 2 chars)
const userInitials = computed(() => {
  return user.value?.email?.substring(0, 2) || "??";
});

// Get user email for display
const userEmail = computed(() => {
  return user.value?.email || "User";
});

// Handle logout action
const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    // Redirect to login page after logout
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
</script>