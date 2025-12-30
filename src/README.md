# Feature-Sliced Design Architecture

This project follows the **Feature-Sliced Design (FSD)** architecture for clean, scalable, and maintainable code.

## Directory Structure

```
src/
├── shared/          # Shared resources
│   ├── ui/         # Reusable UI components (Card, Badge, IconButton)
│   ├── lib/        # Utilities and helpers (mock-data)
│   └── assets/     # Static assets (icons, images)
│
├── entities/       # Business entities
│   └── appointment/    # Appointment entity with model and UI
│
├── features/       # Application features
│   ├── appointment-list/   # List of appointments
│   └── quick-actions/      # Quick action buttons grid
│
└── widgets/        # Page-level widgets
    ├── bottom-navigation/  # Bottom tab navigation
    └── home-screen/        # Home screen composition
```

## Layers (Bottom to Top)

### 1. **Shared** - Foundation Layer

- Reusable UI components
- Utilities and helpers
- Constants and types
- No business logic

### 2. **Entities** - Business Models

- Core business models (Appointment)
- Entity-specific UI components (AppointmentCard)
- Can only import from `shared`

### 3. **Features** - User Interactions

- Complete user features (AppointmentList, QuickActions)
- Can import from `shared` and `entities`

### 4. **Widgets** - Page Compositions

- Page-level compositions (HomeScreen, BottomNavigation)
- Can import from `shared`, `entities`, and `features`

## Key Principles

1. **Unidirectional dependency**: Layers can only import from layers below
2. **Isolation**: Each slice is independent and self-contained
3. **Public API**: Each slice exports through `index.ts`
4. **Reusability**: Components are designed to be reusable across the app

## Adding New Features

1. Identify the correct layer
2. Create a new directory in that layer
3. Add `model.ts` (if needed), `ui.tsx`, and `index.ts`
4. Export through the public API (`index.ts`)

## Example Usage

```tsx
// Page level (app/*)
import { HomeScreen } from "@/src/widgets/home-screen";
import { BottomNavigation } from "@/src/widgets/bottom-navigation";
import { mockAppointments } from "@/src/shared/lib/mock-data";

// Feature level
import { AppointmentList } from "@/src/features/appointment-list";
import { QuickActions } from "@/src/features/quick-actions";

// Entity level
import { Appointment, AppointmentType } from "@/src/entities/appointment";

// Shared level
import { Card, Badge, IconButton } from "@/src/shared/ui";
```

## Benefits

- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Clear structure makes code easy to find and modify
- **Testability**: Isolated components are easier to test
- **Team collaboration**: Clear boundaries prevent conflicts
- **Reusability**: Components can be easily reused across the app
