# BTA App 🚀

React Native приложение с чистой архитектурой на базе Expo и React Navigation.

## 🏗️ Архитектура

Проект использует методологию **Feature-Sliced Design (FSD)**.

```
src/
├── app/              # 🎯 Инициализация приложения
│   └── providers/    # Провайдеры (Navigation, Theme)
├── pages/            # 📄 Страницы
│   ├── home/        # Главная страница
│   ├── explore/     # Страница обзора
│   └── modal/       # Модальная страница
├── widgets/          # 🧩 Виджеты
│   ├── home-screen/ # Виджет главного экрана
│   └── bottom-navigation/
├── features/         # ⚡ Фичи
│   ├── appointment-list/
│   └── quick-actions/
├── entities/         # 💼 Сущности
│   └── appointment/
└── shared/           # 🔧 Общие модули
    ├── ui/          # UI Kit
    ├── lib/         # Утилиты
    ├── hooks/       # Хуки
    ├── types/       # Типы
    └── config/      # Конфигурация
```

### Навигация

```
App.tsx
└── NavigationProvider
    └── RootNavigator (RootStack)
        ├── MainStack
        │   └── TabNavigator
        │       ├── HomePage
        │       └── ExplorePage
        └── ModalPage
```

## 🚀 Быстрый старт

1. Установить зависимости:

   ```bash
   yarn install
   ```

2. Запустить приложение:

   ```bash
   yarn start
   ```

Выберите платформу:

- Нажмите `a` для Android эмулятора
- Нажмите `i` для iOS симулятора
- Отсканируйте QR код в Expo Go

## 📱 Доступные команды

```bash
yarn start         # Запустить Metro bundler
yarn android       # Запустить на Android
yarn ios          # Запустить на iOS
yarn web          # Запустить web версию
yarn lint         # Проверить код
```

## 🎨 Технологии

- **React Native** - Кросс-платформенная разработка
- **Expo** - Инструменты для разработки
- **React Navigation** - Навигация (Native Stack + Bottom Tabs)
- **TypeScript** - Типизация
- **NativeWind** - Tailwind CSS для React Native
- **Feature-Sliced Design** - Архитектурная методология

## 📚 Документация

- [Feature-Sliced Design](./FSD.md) - Архитектура проекта
- [TypeScript Aliases](./ALIASES.md) - Настройка импортов
- [Гайд по миграции](./MIGRATION.md)
- [Настройка завершена](./SETUP_COMPLETE.md)

## 🔧 Настройка Metro

Проект настроен для работы с:

- NativeWind v4 + Tailwind CSS v3
- TypeScript
- Абсолютные импорты через `@/`

## 📖 Полезные ресурсы

- [React Navigation Docs](https://reactnavigation.org/)
- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [TypeScript Guide](https://reactnavigation.org/docs/typescript/)
