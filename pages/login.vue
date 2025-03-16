<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref("");
const isLoading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const config = useRuntimeConfig();

// Get the current site URL from runtime config
const siteUrl = computed(() => {
  return config.public.siteUrl;
});

const signInWithOtp = async () => {
  if (!email.value) {
    errorMsg.value = "Please enter your email address";
    return;
  }

  try {
    isLoading.value = true;
    errorMsg.value = "";

    // Use dynamic redirect URL with the confirm path
    const redirectUrl = `${siteUrl.value}/confirm`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      errorMsg.value = error.message;
    } else {
      successMsg.value = "Magic link sent! Check your email inbox.";
      email.value = "";
    }
  } catch (err) {
    errorMsg.value = "An unexpected error occurred";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold text-center mb-2">
          Welcome to ClockOut
        </h2>
        <p class="text-center text-base-content/70 mb-6">
          Sign in to track your time
        </p>

        <!-- Success alert -->
        <div v-if="successMsg" class="alert alert-success shadow-lg mb-6">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ successMsg }}</span>
          </div>
        </div>

        <!-- Error alert -->
        <div v-if="errorMsg" class="alert alert-error shadow-lg mb-6">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ errorMsg }}</span>
          </div>
        </div>

        <form @submit.prevent="signInWithOtp" class="space-y-6">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              class="input input-bordered w-full"
              placeholder="your.email@example.com"
              v-model="email"
              type="email"
              required
            />
          </div>

          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary w-full"
              :class="{ loading: isLoading }"
              :disabled="isLoading"
            >
              {{ isLoading ? "Sending Magic Link..." : "Sign In with Email" }}
            </button>
          </div>
        </form>

        <div class="divider my-8">OR</div>

        <div class="text-center text-sm">
          <p class="mb-2">Don't have an account?</p>
          <p>Sign in with your email above to create one automatically</p>
        </div>
      </div>
    </div>
  </div>
</template>
