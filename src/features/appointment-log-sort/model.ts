export type AppointmentLogSortOption =
  | "date-new"
  | "date-old"
  | "primary"
  | "checkup"
  | "repeat";

export interface AppointmentLogSortOptionItem {
  label: string;
  value: AppointmentLogSortOption;
}

export const APPOINTMENT_LOG_SORT_OPTIONS: AppointmentLogSortOptionItem[] = [
  { label: "По дате, новые", value: "date-new" },
  { label: "По дате, старые", value: "date-old" },
  { label: "Первичный прием", value: "primary" },
  { label: "Осмотр, коррекция", value: "checkup" },
  { label: "Повторный прием", value: "repeat" },
];

export function getAppointmentLogSortLabel(
  option: AppointmentLogSortOption
): string {
  const found = APPOINTMENT_LOG_SORT_OPTIONS.find(
    (opt) => opt.value === option
  );
  return found ? found.label : "По дате, новые";
}



