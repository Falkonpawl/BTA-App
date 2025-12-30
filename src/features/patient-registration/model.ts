// Модель данных и валидация для регистрации пациента

export interface PatientFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  birthDate: string;
  phone: string;
  specialFeatures: string;
  reminderInterval: string;
  messenger: string;
  refuseReminders: boolean;
  agreeToOffer: boolean;
  agreeToPrivacy: boolean;
}

export const INITIAL_FORM_DATA: PatientFormData = {
  firstName: "",
  lastName: "",
  middleName: "",
  gender: "",
  birthDate: "",
  phone: "",
  specialFeatures: "",
  reminderInterval: "4 мес",
  messenger: "WhatsApp",
  refuseReminders: false,
  agreeToOffer: false,
  agreeToPrivacy: true,
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

export const MESSENGERS = ["WhatsApp", "Telegram", "Viber"];

export const GENDERS = ["Муж", "Жен"];

// Validation functions
export const validateSpecialFeatures = (text: string): string => {
  const invalidCharsPattern = /[%";=]/;
  const maxLength = 200;

  if (invalidCharsPattern.test(text)) {
    return "Поле Особенности пациента не может содержать символы... / Превышать длину в ххх символа.";
  }

  if (text.length > maxLength) {
    return `Поле Особенности пациента не может содержать символы... / Превышать длину в ${maxLength} символа.`;
  }

  return "";
};

export const hasRequiredFieldErrors = (formData: PatientFormData): boolean => {
  return !formData.firstName || !formData.phone || !formData.gender;
};

export const hasUnsavedChanges = (
  formData: PatientFormData,
  initialData: PatientFormData
): boolean => {
  return (
    formData.firstName !== initialData.firstName ||
    formData.lastName !== initialData.lastName ||
    formData.middleName !== initialData.middleName ||
    formData.gender !== initialData.gender ||
    formData.birthDate !== initialData.birthDate ||
    formData.phone !== initialData.phone ||
    formData.specialFeatures !== initialData.specialFeatures ||
    formData.reminderInterval !== initialData.reminderInterval ||
    formData.messenger !== initialData.messenger ||
    formData.refuseReminders !== initialData.refuseReminders ||
    formData.agreeToOffer !== initialData.agreeToOffer ||
    formData.agreeToPrivacy !== initialData.agreeToPrivacy
  );
};
