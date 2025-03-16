import type {
  TimeEntryTemplate,
  TimeEntryTemplateFormValues,
} from "~/types/templates.types";

export function useTemplates() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { data: templates, refresh: refreshTemplates } = useAsyncData(
    "time_entry_templates",
    async () => {
      if (user.value) {
        const { data } = await client
          .from("time_entry_templates")
          .select("id, description, start_time, end_time, created_at")
          .order("created_at", { ascending: false });
        return data;
      }
    }
  );

  async function createTemplate({
    description,
    start_time,
    end_time,
  }: TimeEntryTemplateFormValues) {
    if (!user.value) return;

    const response = await client
      .from("time_entry_templates")
      .insert({
        description,
        start_time,
        end_time,
      })
      .select()
      .single();

    if (response.error) throw response.error;
    refreshTemplates();
    return response;
  }

  async function updateTemplate({
    id,
    description,
    start_time,
    end_time,
  }: TimeEntryTemplateFormValues & { id: number }) {
    if (!user.value) return;

    const response = await client
      .from("time_entry_templates")
      .update({
        description,
        start_time,
        end_time,
      })
      .eq("id", id)
      .select()
      .single();

    if (response.error) throw response.error;
    refreshTemplates();
    return response;
  }

  async function deleteTemplate(id: number) {
    if (!user.value) return;

    const response = await client
      .from("time_entry_templates")
      .delete()
      .eq("id", id);

    if (response.error) throw response.error;
    refreshTemplates();
    return response;
  }

  const { refreshTimeEntries } = useTimeEntries();

  async function createTimeEntryFromTemplate(template: TimeEntryTemplate) {
    if (!user.value) return;

    // Only proceed if template has start_time and end_time
    if (!template.start_time || !template.end_time) {
      throw new Error("Template missing start or end time");
    }

    // Get template start and end time values (keeping only time parts)
    const templateStart = new Date(template.start_time);
    const templateEnd = new Date(template.end_time);

    // Extract hours, minutes, seconds from template times
    const startHours = templateStart.getHours();
    const startMinutes = templateStart.getMinutes();
    const startSeconds = templateStart.getSeconds();

    const endHours = templateEnd.getHours();
    const endMinutes = templateEnd.getMinutes();
    const endSeconds = templateEnd.getSeconds();

    // Create new dates for today with template times
    const now = new Date();

    // Set the start time to today with template's time
    const newStartDate = new Date(now);
    newStartDate.setHours(startHours, startMinutes, startSeconds, 0);

    // Set the end time to today with template's time
    const newEndDate = new Date(now);
    newEndDate.setHours(endHours, endMinutes, endSeconds, 0);

    // If end time is before start time, assume it's for the next day
    if (newEndDate < newStartDate) {
      newEndDate.setDate(newEndDate.getDate() + 1);
    }

    // Create new time entry with template times
    const response = await client
      .from("time_entries")
      .insert({
        user_id: user.value.id,
        description: template.description,
        start_time: newStartDate.toISOString(),
        end_time: newEndDate.toISOString(),
      })
      .select()
      .single();

    if (response.error) throw response.error;
    refreshTimeEntries();
    return response;
  }

  return {
    templates,
    refreshTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createTimeEntryFromTemplate,
  };
}
