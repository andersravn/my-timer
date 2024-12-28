<script setup>
const client = useSupabaseClient();

const { data: timeEntries } = await useAsyncData("time_entries", async () => {
  const { data } = await client.from("time_entries").select();
  return data;
});
</script>

<template>
  <div>
    <div>
      <input type="text" />
    </div>
    <ul>
      <li v-for="entry in timeEntries" :key="entry.id">
        {{ entry.description }}
      </li>
    </ul>
  </div>
  <Dummy />
  <div class="fixed top-4 right-4">
    <ThemeController />
  </div>
</template>
