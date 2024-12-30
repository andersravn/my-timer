<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref("");

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: "http://localhost:3000/confirm",
    },
  });
  if (error) console.log(error);
};
</script>
<template>
  <div class="flex">
    <input
      class="input input-bordered"
      placeholder="Your e-mail"
      v-model="email"
      type="email"
    />
    <button class="btn btn-primary" @click="signInWithOtp">
      Sign In with E-Mail
    </button>
  </div>
</template>
