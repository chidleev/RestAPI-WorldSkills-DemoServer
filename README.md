# RestAPI WorldSkills Demo Server

[![JavaScript](https://img.shields.io/badge/JavaScript-55.3%25-yellow)](https://github.com/chidleev/RestAPI-WorldSkills-DemoServer)
[![HTML](https://img.shields.io/badge/HTML-40.2%25-orange)](https://github.com/chidleev/RestAPI-WorldSkills-DemoServer)
[![CSS](https://img.shields.io/badge/CSS-4.3%25-blue)](https://github.com/chidleev/RestAPI-WorldSkills-DemoServer)

Сервер для подготовки к демонстрационному экзамену WorldSkills, разработанный в соответствии со всеми требованиями компетенции.

## Описание

Этот проект представляет собой REST API сервер, разработанный для подготовки к демонстрационному экзамену WorldSkills. Сервер реализован с использованием технологий Node.js, Express, Sequelize и MySQL, что обеспечивает эффективную обработку запросов и взаимодействие с базой данных.

## Технологии

- **Backend**: Node.js, Express
- **База данных**: MySQL с Sequelize ORM
- **Frontend**: HTML, CSS, JavaScript, Vue.js
- **Другие инструменты**: Axios, CORS, Validator

## Установка и запуск

### Предварительные требования

- Node.js (версия 12 или выше)
- MySQL

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/chidleev/RestAPI-WorldSkills-DemoServer.git

# Переход в директорию проекта
cd RestAPI-WorldSkills-DemoServer

# Установка зависимостей
npm install
```

### Настройка базы данных

Необходимо создать базу данных MySQL и настроить соединение с ней в файле конфигурации `dataBase.js`.

### Запуск сервера

```bash
# Запуск в режиме разработки
npm run dev

# Запуск в продакшн режиме
npm start
```

Сервер запустится на порту 3000 по умолчанию. Вы можете изменить порт в файле `server.js`.

## API

Сервер предоставляет REST API для взаимодействия с базой данных. Все эндпоинты API доступны по префиксу `/api`.

### Примеры эндпоинтов

- `GET /api/resource` - получение списка ресурсов
- `POST /api/resource` - создание нового ресурса
- `PUT /api/resource/:id` - обновление ресурса
- `DELETE /api/resource/:id` - удаление ресурса

## Структура проекта

```
RestAPI-WorldSkills-DemoServer/
├── API.js                # Определение API маршрутов
├── dataBase.js           # Конфигурация базы данных
├── server.js             # Основной файл сервера
├── package.json          # Зависимости и скрипты проекта
├── public/               # Статические файлы для клиентской части
└── ...
```

## Разработка

Для разработки рекомендуется использовать режим `npm run dev`, который автоматически перезапускает сервер при изменении кода благодаря nodemon.

## Лицензия

ISC

## Автор

[chidleev](https://github.com/chidleev)
