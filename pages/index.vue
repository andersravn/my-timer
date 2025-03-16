<script setup lang="ts">
const router = useRouter();

const navigateToSignup = () => {
  router.push("/login");
};
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="hero min-h-[70vh] bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-3xl">
          <h1 class="text-5xl font-bold mb-8">
            Track Your Time, Know When to Stop
          </h1>
          <p class="text-xl mb-10">
            ClockOut helps you balance your work and life by tracking your time,
            setting realistic goals, and knowing when you've done enough for the
            day.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button @click="navigateToSignup" class="btn btn-primary btn-lg">
              Get Started for Free
            </button>
            <a href="#features" class="btn btn-outline btn-lg"> Learn More </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">Find Your Balance</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card bg-base-100 shadow-xl">
            <figure class="px-10 pt-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-20 w-20 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </figure>
            <div class="card-body items-center text-center">
              <h3 class="card-title text-xl">Track Without Stress</h3>
              <p>
                Simple, one-click timers help you see where your time goes
                without creating extra work.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="card bg-base-100 shadow-xl">
            <figure class="px-10 pt-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-20 w-20 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </figure>
            <div class="card-body items-center text-center">
              <h3 class="card-title text-xl">Set Meaningful Goals</h3>
              <p>
                Define work limits that make sense for you. Know when you've
                done enough for today.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="card bg-base-100 shadow-xl">
            <figure class="px-10 pt-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-20 w-20 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </figure>
            <div class="card-body items-center text-center">
              <h3 class="card-title text-xl">Know When to Stop</h3>
              <p>
                Achieve peace of mind by knowing when it's time to close your
                laptop and enjoy life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works -->
    <div class="py-16 px-4 bg-base-200">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="order-2 md:order-1">
            <h3 class="text-2xl font-bold mb-4">
              1. Set your daily or weekly goals
            </h3>
            <p class="mb-6">
              Define what "enough" means for you. Maybe it's 6 hours of focused
              work per day, or 30 hours per week.
            </p>

            <h3 class="text-2xl font-bold mb-4">
              2. Track your time effortlessly
            </h3>
            <p class="mb-6">
              Just hit start when you begin, stop when you're done. ClockOut
              takes care of the rest.
            </p>

            <h3 class="text-2xl font-bold mb-4">
              3. Get visual feedback on your progress
            </h3>
            <p>
              See how close you are to your goals and know when it's time to
              wrap up and enjoy your personal time.
            </p>
          </div>

          <div class="order-1 md:order-2">
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <div class="stats shadow">
                  <div class="stat">
                    <div class="stat-title">Today's Goal</div>
                    <div class="stat-value">6h 00m</div>
                    <div class="stat-desc">of focused work</div>
                  </div>

                  <div class="stat">
                    <div class="stat-title">Time Tracked</div>
                    <div class="stat-value text-primary">5h 24m</div>
                    <div class="stat-desc text-success">90% complete</div>
                  </div>
                </div>

                <div class="mt-6">
                  <div class="text-sm mb-2">Progress to goal</div>
                  <progress
                    class="progress progress-primary w-full"
                    value="90"
                    max="100"
                  ></progress>
                </div>

                <div class="alert alert-success mt-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="stroke-current shrink-0 h-6 w-6"
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
                  <span
                    >Almost there! Just 36 minutes left to reach your
                    goal.</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Value Proposition -->
    <div class="py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 class="text-3xl font-bold mb-6">
              Work-Life Balance, Redefined
            </h2>
            <p class="text-lg mb-6">
              In a world that celebrates overwork, ClockOut helps you draw
              healthy boundaries and reclaim your personal time.
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-success mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span
                  >Reduce guilt about "not doing enough" by defining what
                  "enough" means</span
                >
              </li>
              <li class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-success mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Create sustainable work habits that prevent burnout</span>
              </li>
              <li class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-success mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span
                  >Feel satisfied when you meet your goals, not guilty when you
                  stop</span
                >
              </li>
            </ul>
          </div>
          <div>
            <h2 class="text-3xl font-bold mb-6">
              Simple Tools for Better Focus
            </h2>
            <p class="text-lg mb-6">
              ClockOut gives you just what you need to stay on track without
              becoming another distraction.
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-success mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span
                  >Reusable templates for recurring tasks save setup time</span
                >
              </li>
              <li class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-success mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Visual indicators help you see progress at a glance</span>
              </li>
              <li class="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-success mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Designed to help you work better, not longer</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-16 px-4 bg-gradient-to-r from-primary/20 to-secondary/20">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Find Your Balance?</h2>
        <p class="text-xl mb-8">
          Start tracking your time and meeting your goals without overworking.
        </p>
        <button @click="navigateToSignup" class="btn btn-primary btn-lg">
          Sign Up Now — It's Free!
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%236366F1" fill-opacity="0.1" d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,181.3C672,149,768,107,864,117.3C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"%3E%3C/path%3E%3C/svg%3E');
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: 100%;
}
</style>
