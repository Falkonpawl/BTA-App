export const APPOINTMENT_TYPES = [
  "Ботулотоксин типа А",
  "Контурная пластика",
  "Нитевой лифтинг",
  "Биоревитализация",
  "Аппаратные методики",
] as const;

export const OTHER_OPTION = "Другой";

export type AppointmentTypeOption =
  | (typeof APPOINTMENT_TYPES)[number]
  | typeof OTHER_OPTION;
