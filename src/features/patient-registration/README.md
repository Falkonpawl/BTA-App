# Patient Registration - FSD Feature

## Структура по Feature-Sliced Design

Регистрация пациента организована как **feature** согласно методологии FSD.

```
src/
├── features/
│   └── patient-registration/          # Feature: регистрация пациента
│       ├── model.ts                   # Модель данных и валидация
│       ├── lib.ts                     # Утилиты форматирования
│       ├── ui/                        # UI компоненты
│       │   ├── PatientFormFields.tsx
│       │   ├── PatientFormCheckboxes.tsx
│       │   ├── ValidationErrors.tsx
│       │   ├── SelectionModal.tsx
│       │   ├── ExitConfirmationModal.tsx
│       │   └── index.ts
│       └── index.ts                   # Public API
│
└── pages/
    └── add-patient/                   # Page: композиция feature
        ├── ui.tsx                     # Страница использует feature
        ├── index.ts
        └── README.md
```

## Слои и их ответственность

### `features/patient-registration/` - Feature слой

**Содержит:**

- Бизнес-логику регистрации пациента
- UI компоненты формы
- Валидацию данных
- Утилиты форматирования

**Экспортирует:**

```typescript
// Типы
export type { PatientFormData };

// Константы
export { INITIAL_FORM_DATA, REMINDER_INTERVALS, MESSENGERS, GENDERS };

// Валидация
export { validateSpecialFeatures, hasRequiredFieldErrors, hasUnsavedChanges };

// Утилиты
export { formatPhoneNumber, formatDate };

// UI компоненты
export {
  PatientFormFields,
  PatientFormCheckboxes,
  ValidationErrors,
  SelectionModal,
  ExitConfirmationModal,
};
```

### `pages/add-patient/` - Page слой

**Содержит:**

- Композицию feature компонентов
- Навигацию
- Управление состоянием страницы

**Импортирует:**

- Всё из `features/patient-registration`
- UI компоненты из `shared/ui` (MainLayout, Button)
- Типы навигации из `shared/types`

## Преимущества FSD структуры

### 1. Изолированность

Feature `patient-registration` полностью независим и может быть:

- Переиспользован на других страницах
- Протестирован отдельно
- Разрабатываем независимо

### 2. Чёткая ответственность

**Model (`model.ts`):**

- Типы данных
- Константы
- Валидационная логика

**Lib (`lib.ts`):**

- Форматирование телефона
- Форматирование даты

**UI (`ui/*.tsx`):**

- Визуальные компоненты
- Локальная логика отображения

**Page (`pages/add-patient/ui.tsx`):**

- Композиция feature
- Навигация
- Глобальное состояние страницы

### 3. Масштабируемость

Легко добавить:

- Новые поля формы (в PatientFormFields)
- Новую валидацию (в model.ts)
- Новые форматтеры (в lib.ts)
- Новые модальные окна (в ui/)

### 4. Переиспользование

Feature может использоваться:

```typescript
// На другой странице
import {
  PatientFormFields,
  validateSpecialFeatures,
} from "@/features/patient-registration";

// В виджете
import { PatientFormCheckboxes } from "@/features/patient-registration";

// В другой feature
import { formatPhoneNumber } from "@/features/patient-registration";
```

## Правила импортов

### ✅ Разрешено

```typescript
// Page может импортировать feature
import { PatientFormFields } from "@/features/patient-registration";

// Feature может импортировать shared
import { Button } from "@/shared/ui";
```

### ❌ Запрещено

```typescript
// Feature НЕ может импортировать page
import { AddPatientScreen } from "@/pages/add-patient"; // ❌

// Feature НЕ может импортировать другую feature
import { OtherFeature } from "@/features/other"; // ❌
```

## Компоненты Feature

### PatientFormFields

Отвечает за основные поля формы:

- Имя, фамилия, отчество
- Пол, дата рождения
- Телефон
- Особенности пациента
- Интервал напоминаний
- Мессенджер

### PatientFormCheckboxes

Отвечает за чекбоксы:

- Отказ от напоминаний
- Согласие с офертой
- Согласие с политикой конфиденциальности

### ValidationErrors

Отвечает за отображение ошибок валидации:

- Незаполненные обязательные поля
- Ошибки в поле "Особенности пациента"

### SelectionModal

Переиспользуемое модальное окно для выбора значения из списка:

- Выбор пола
- Выбор интервала напоминаний
- Выбор мессенджера

### ExitConfirmationModal

Модальное окно подтверждения выхода при несохраненных изменениях

## Миграция с компонентов на Feature

**Было (неправильно):**

```
pages/
└── add-patient/
    ├── components/           # ❌ Компоненты в page
    │   ├── FormFields.tsx
    │   ├── FormCheckboxes.tsx
    │   └── ...
    └── ui.tsx
```

**Стало (правильно):**

```
features/
└── patient-registration/     # ✅ Отдельная feature
    ├── model.ts
    ├── lib.ts
    ├── ui/
    │   ├── PatientFormFields.tsx
    │   └── ...
    └── index.ts

pages/
└── add-patient/
    └── ui.tsx                # Только композиция
```

## Дальнейшее развитие

### Можно добавить:

1. **API слой** (`features/patient-registration/api.ts`):

```typescript
export const patientApi = {
  create: (data: PatientFormData) => api.post("/patients", data),
  update: (id: string, data: PatientFormData) =>
    api.patch(`/patients/${id}`, data),
};
```

2. **Hooks** (`features/patient-registration/hooks/`):

```typescript
export const usePatientForm = () => {
  // Логика работы с формой
};
```

3. **Tests** (`features/patient-registration/__tests__/`):

```typescript
describe("validateSpecialFeatures", () => {
  // Тесты валидации
});
```

## Ссылки

- [Feature-Sliced Design](https://feature-sliced.design/)
- [FSD Examples](https://feature-sliced.design/examples)
