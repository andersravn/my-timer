export type GoalFormValues = {
  name: string;
  duration: string;
  day:
    | "daily"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
};
