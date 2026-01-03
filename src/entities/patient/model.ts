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
  imageUrl?: string | number; // string for URI, number for require()
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

// Serialized Patient type for navigation (Date objects converted to ISO strings)
export interface SerializedPatient {
  id: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  gender?: Gender;
  birthDate?: string; // ISO string instead of Date
  phone: string;
  specialFeatures?: string;
  reminderInterval?: string;
  messenger?: MessengerType;
  refuseReminders?: boolean;
  imageUrl?: string | number;
  createdAt: string; // ISO string instead of Date
  updatedAt: string; // ISO string instead of Date
}

// Convert Patient to serializable format for navigation
export function serializePatient(patient: Patient): SerializedPatient {
  return {
    ...patient,
    birthDate: patient.birthDate?.toISOString(),
    createdAt: patient.createdAt.toISOString(),
    updatedAt: patient.updatedAt.toISOString(),
  };
}

// Convert serialized Patient back to Patient with Date objects
export function deserializePatient(serialized: SerializedPatient | Patient): Patient {
  // If already deserialized (has Date objects), return as is
  if (serialized.createdAt instanceof Date) {
    return serialized as Patient;
  }

  // Helper function to safely create Date from string
  const safeDate = (dateString: string | undefined): Date => {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    // If date is invalid, return current date as fallback
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const s = serialized as SerializedPatient;
  return {
    ...s,
    birthDate: s.birthDate ? safeDate(s.birthDate) : undefined,
    createdAt: safeDate(s.createdAt),
    updatedAt: safeDate(s.updatedAt),
  };
}
