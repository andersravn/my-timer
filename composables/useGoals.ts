import type { GoalFormValues } from "~/types/goal.types";

export function useGoals() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  async function createNewGoal({ name, duration, day }: GoalFormValues) {
    const response = await client.from("goals").upsert({
      user_id: user.value?.id,
      duration: parseFloat(duration.replace(",", ".")),
      duration_type: "atLeast",
      name,
      day,
    });
    if (response.error) throw response.error;
    refreshGoals();
    return response;
  }

  const { data: goals, refresh: refreshGoals } = useAsyncData(
    "goals",
    async () => {
      if (user.value) {
        const { data } = await client
          .from("goals")
          .select("id, name, duration, duration_type, day")
          .eq("user_id", user.value.id)
          .order("created_at", { ascending: false });
        return data;
      }
    }
  );

  async function deleteGoal(id: number) {
    if (!user.value) return;
    const response = await client
      .from("goals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.value.id);
    if (response.error) throw response.error;
    refreshGoals();
    return response;
  }

  return {
    createNewGoal,
    refreshGoals,
    deleteGoal,
    goals,
  };
}
