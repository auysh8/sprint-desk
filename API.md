# 📡 SprintDesk API Documentation

This document describes all remote and simulated APIs used across the SprintDesk dashboard.

---

## 1. Authentication Endpoints (DummyJSON API)

### 1.1 POST `/auth/login`
Authenticates user credentials and returns JWT token pair with user profile.

- **Base URL**: `https://dummyjson.com`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 60
}
```

#### Response `200 OK`
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.2 POST `/auth/refresh`
Refreshes an expired in-memory access token using the stored refresh token.

- **Base URL**: `https://dummyjson.com`
- **Method**: `POST`

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresInMins": 60
}
```

#### Response `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Real-Time Notification Stream (JSONPlaceholder)

### 2.1 GET `/posts?_limit=5`
Polls recent event entries to simulate a real-time team notification stream.

- **Base URL**: `https://jsonplaceholder.typicode.com`
- **Method**: `GET`

#### Response `200 OK`
```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident",
    "body": "quia et suscipit suscipit recusandae consequuntur..."
  }
]
```

---

## 3. Mock Dataset Specification (`/mock-data.json`)

Primary seed dataset consumed by `mockDataService.ts`.

### Schema Summary:
- **`users`**: List of team members (`id`, `name`, `email`, `avatar`).
- **`sprints`**: Sprint cycles (`id`, `name`, `startDate`, `endDate`).
- **`tasks`**: 30 sprint tasks (`id`, `title`, `description`, `status`, `priority`, `assigneeId`, `dueDate`, `sprintId`, `order`, `completedAt`).
- **`comments`**: Task discussion items (`id`, `taskId`, `authorId`, `message`, `createdAt`).
- **`notifications`**: Initial notification list (`id`, `title`, `message`, `type`, `read`, `createdAt`).
