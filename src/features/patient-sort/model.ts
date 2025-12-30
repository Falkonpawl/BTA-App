export type SortOption =
  | "alphabet-asc"
  | "alphabet-desc"
  | "nearest-appointment"
  | "registration-new"
  | "registration-old"

export interface SortOptionItem {
  label: string
  value: SortOption
}

export const SORT_OPTIONS: SortOptionItem[] = [
  { label: "По алфавиту А-Я", value: "alphabet-asc" },
  { label: "По алфавиту Я-А", value: "alphabet-desc" },
  { label: "Ближайший приём", value: "nearest-appointment" },
  { label: "По дате регистрации, новые", value: "registration-new" },
  { label: "По дате регистрации, старые", value: "registration-old" },
]

export function getSortLabel(option: SortOption): string {
  const found = SORT_OPTIONS.find((opt) => opt.value === option)
  return found?.label || "По алфавиту А-Я"
}

