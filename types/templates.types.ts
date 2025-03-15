import type { Database } from "./database.types";

export type TimeEntryTemplate = Database["public"]["Tables"]["time_entry_templates"]["Row"];

export type TimeEntryTemplateFormValues = {
  description: string;
  start_time: string;
  end_time: string;
};