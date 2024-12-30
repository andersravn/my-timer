<script setup>
const client = useSupabaseClient();

const { data: timeEntries } = await useAsyncData("time_entries", async () => {
  const { data } = await client.from("time_entries").select();
  return data;
});
</script>

<template>
  <div class="flex gap-x-2">
    <input type="text" class="input input-bordered w-full" />
    <button class="btn btn-primary">Start</button>
  </div>
  <ul>
    <li v-for="entry in timeEntries" :key="entry.id">
      {{ entry.description }}
    </li>
  </ul>
  <Dummy />
</template>
