export interface Patient {
  id: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  gender?: Gender;
  birthDate?: Date;
  phone: string;
  specialFeatures?: string;
  reminderInterval?: string;
  messenger?: MessengerType;
  refuseReminders?: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum MessengerType {
  WHATSAPP = "whatsapp",
  TELEGRAM = "telegram",
  VIBER = "viber",
}

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: "Мужской",
  [Gender.FEMALE]: "Женский",
};

export const MESSENGER_LABELS: Record<MessengerType, string> = {
  [MessengerType.WHATSAPP]: "WhatsApp",
  [MessengerType.TELEGRAM]: "Telegram",
  [MessengerType.VIBER]: "Viber",
};

export const REMINDER_INTERVALS = [
  "1 мес",
  "2 мес",
  "3 мес",
  "4 мес",
  "5 мес",
  "6 мес",
  "12 мес",
];

// Utility function to convert API User to Patient
export function userToPatient(user: any): Patient {
  const fullName = user.u_name || "";
  const nameParts = fullName.split(" ");

  return {
    id: user.u_id,
    firstName: nameParts[0] || "",
    lastName: nameParts[2] || undefined,
    middleName: nameParts[1] || undefined,
    phone: user.u_phone || user.u_wa || user.u_tg || "",
    birthDate: user.u_birthday ? new Date(user.u_birthday) : undefined,
    imageUrl: user.u_photo || undefined,
    specialFeatures: user.u_details?.specialFeatures,
    reminderInterval: user.u_details?.reminderInterval,
    messenger: mapMessengerType(user),
    refuseReminders: user.u_details?.refuseReminders || false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function mapMessengerType(user: any): MessengerType | undefined {
  if (user.u_wa) return MessengerType.WHATSAPP;
  if (user.u_tg) return MessengerType.TELEGRAM;
  return undefined;
}
