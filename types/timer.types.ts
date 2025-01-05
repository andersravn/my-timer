export type TimeEntry = TimeEntryBase & {
  created_at: string;
  user_id: string | null;
};

export type TimeEntryBase = {
  id: number;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
};
