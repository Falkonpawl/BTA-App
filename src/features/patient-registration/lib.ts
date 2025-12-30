// Утилиты для форматирования данных пациента

// Phone mask function
export const formatPhoneNumber = (text: string): string => {
  const cleaned = text.replace(/\D/g, "");
  // Формат: +7 (XXX) XXX XX XX - всего 11 цифр (1 + 3 + 3 + 2 + 2)
  const match = cleaned.match(
    /^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/
  );

  if (!match) return text;

  const [, country, area, first, second, third] = match;
  let formatted = "+";

  if (country) formatted += country;
  if (area) formatted += ` (${area}`;
  if (first) formatted += `) ${first}`;
  if (second) formatted += ` ${second}`;
  if (third) formatted += ` ${third}`;

  return formatted.trim();
};

// Date mask function (DD.MM.YYYY)
export const formatDate = (text: string): string => {
  const cleaned = text.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);

  if (!match) return text;

  const [, day, month, year] = match;
  let formatted = "";

  if (day) formatted += day;
  if (month) formatted += `.${month}`;
  if (year) formatted += `.${year}`;

  return formatted;
};
