# MyExpoEDU 👋

MyExpoEDU — это мобильное приложение, для работы с картами, геолокацией, локальной базой данных (SQLite) и уведомлениями. Приложение позволяет:
- Отображать карту с текущей локацией.
- Добавлять маркеры на карту посредством долгого нажатия.
- Хранить данные маркеров и связанных с ними изображений в локальной базе данных.
- Просматривать список изображений для выбранного маркера и загружать новые из галереи.
- Отслеживать расстояние до маркеров и получать уведомления при приближении к ним.

## Ключевая фукнциональность

- **Интеграция с SQLite:** Через контекст [DatabaseContext](./contexts/DatabaseContext.tsx) реализованы CRUD-операции для маркеров и изображений.
- **Геолокация:** Используется [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) для отслеживания текущей позиции.
- **Уведомления:** Модуль [NotificationManager](./services/notifications.ts) отправляет локальные уведомления при близости к маркеру.
- **Карты:** Использование [react-native-maps](https://github.com/react-native-maps/react-native-maps) для отображения карты и управления метками.

## Как запустить проект

Для отладки приложения необходимо установить приложение Expo Go на физическое устройство

1. Установка зависимостей в корневой папке

   ```bash
   npm install
   ```

2. Запуск проекта после установки зависимостей

   ```bash
    npx expo start
   ```

После запуска проекта необходимо отсканировать QR код в терминале при помощи Expo Go