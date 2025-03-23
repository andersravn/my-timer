import type { TimeEntry } from "~/types/timer.types";

const timer = ref<TimeEntry | null | undefined>(null);
const description = ref("");

export function useTimeEntries() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { data: timeEntries, refresh: refreshTimeEntries } = useAsyncData(
    "time_entries",
    async () => {
      if (user.value) {
        const { data } = await client
          .from("time_entries")
          .select("id, description, start_time, end_time")
          .eq("user_id", user.value.id)
          .not("end_time", "is", null)
          .order("start_time", { ascending: false });
        return data;
      }
    }
  );

  const optimisticUpdateLatestTimeEntry = (newTimeEntry: TimeEntry) => {
    if (!timeEntries.value) return;
    timeEntries.value = [newTimeEntry, ...timeEntries.value];
  };

  const { data: activeTimeEntry } = useAsyncData(
    "active_time_entry",
    async () => {
      if (user.value) {
        const { data } = await client
          .from("time_entries")
          .select("id, description, start_time")
          .eq("user_id", user.value.id)
          .is("end_time", null)
          .order("start_time", { ascending: false });
        return data?.[0];
      }
    },
    { dedupe: "defer", server: false }
  );

  async function setEndTime({ id, endTime }: { id: number; endTime: string }) {
    if (!user.value) return;
    const response = await client
      .from("time_entries")
      .update({
        end_time: endTime,
      })
      .eq("id", id)
      .eq("user_id", user.value.id);
    if (response.error) throw response.error;
    refreshTimeEntries();
    return response;
  }

  async function stopTimer({
    id,
    description: newDescription,
    endTime,
  }: {
    id: number;
    description: string;
    endTime: string;
  }) {
    if (!user.value) return;
    const response = await client
      .from("time_entries")
      .update({
        description: newDescription,
        end_time: endTime,
      })
      .eq("id", id)
      .eq("user_id", user.value.id);
    if (response.error) throw response.error;
    if (timer.value) {
      optimisticUpdateLatestTimeEntry(timer.value);
    }
    timer.value = null;
    description.value = "";
    return response;
  }

  async function setStartTime({
    id,
    startTime,
  }: {
    id: number;
    startTime: string;
  }) {
    if (!user.value) return;
    const response = await client
      .from("time_entries")
      .update({
        start_time: startTime,
      })
      .eq("id", id)
      .eq("user_id", user.value.id);
    if (response.error) throw response.error;
    refreshTimeEntries();
    return response;
  }

  async function setDescription({
    id,
    description,
  }: {
    id: number;
    description: string;
  }) {
    if (!user.value) return;
    const response = await client
      .from("time_entries")
      .update({
        description: description,
      })
      .eq("id", id)
      .eq("user_id", user.value.id);
    if (response.error) throw response.error;
    refreshTimeEntries();
    return response;
  }

  async function createNewTimeEntry({
    description: newDescription,
  }: {
    description: string;
  }) {
    const response = await client
      .from("time_entries")
      .upsert({
        user_id: user.value?.id,
        description: newDescription,
        start_time: new Date().toISOString(),
      })
      .select()
      .single();
    if (response.error) throw response.error;
    timer.value = response.data;
    description.value = newDescription;
    return response;
  }

  async function deleteTimeEntries(ids: number[]) {
    if (!user.value) return;
    const response = await client
      .from("time_entries")
      .delete()
      .in("id", ids)
      .eq("user_id", user.value.id);
    if (response.error) throw response.error;
    return response;
  }

  return {
    timeEntries,
    refreshTimeEntries,
    setEndTime,
    createNewTimeEntry,
    setStartTime,
    setDescription,
    activeTimeEntry,
    stopTimer,
    optimisticUpdateLatestTimeEntry,
    timer,
    description,
    deleteTimeEntries,
  };
}
