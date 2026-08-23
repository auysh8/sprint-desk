# 🏛️ SprintDesk Architecture & System Design

This document details the architectural decisions, design patterns, state separation rationale, and data flow of the **SprintDesk** application.

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Presentation Layer                    │
│   (React 19 Pages: LoginPage, DashboardPage, BoardPage,      │
│                     AnalyticsPage)                          │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│     Custom UI Primitives    │ │      Domain Components      │
│  Button, Input, Select,     │ │ KanbanBoard, TaskCard,      │
│  Modal, Drawer, Toast,      │ │ TaskDetailsDrawer,          │
│  DataTable, Skeleton, Badge │ │ NotificationDropdown        │
└──────────────┬──────────────┘ └──────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Client State (Zustand)                  │
│  • authStore        (In-memory JWT, session restore)        │
│  • boardStore       (Tasks, columns, filters, undo stack)   │
│  • notificationStore(Stream items, read status)             │
│  • themeStore       (Dark / Light mode persistence)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Service Layer                         │
│  • apiClient.ts            (HTTP client, 401 interceptor)   │
│  • authService.ts          (DummyJSON auth API)             │
│  • mockDataService.ts      (Mock data access abstraction)   │
│  • notificationService.ts  (JSONPlaceholder polling)        │
│  • storageService.ts       (Simulated refresh storage)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      External / Remote                      │
│  • https://dummyjson.com/auth/login                         │
│  • https://jsonplaceholder.typicode.com/posts?_limit=5     │
│  • public/mock-data.json                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Separation of Concerns & Data Abstraction

### Strict Architectural Rule
> **UI Components must never call `fetch('/mock-data.json')` or remote endpoints directly.**

The application strictly enforces a 4-tier separation:
1. **UI Layer**: Pure React functional components handling user interactions and rendering.
2. **State Layer**: Zustand stores managing synchronous UI state, optimistic updates, and undo history.
3. **Service Layer**: Pure TypeScript classes/objects providing unified API methods and handling payload transformations.
4. **Network/Storage Layer**: `apiClient.ts` and `storageService.ts` managing transport and persistence protocols.

---

## 3. Authentication & JWT Token Lifecycle (Task 01)

### Security Model
- **Access Token**: Stored **strictly in memory** inside `authStore`. When the page reloads, memory is wiped, preventing cross-site scripting (XSS) extraction from permanent storage.
- **Refresh Token**: Stored inside simulated persistent storage via `storageService`.
- **401 Interception & Request Queue**:
  When any API request receives an HTTP 401:
  1. The failed request is paused in a promise queue.
  2. `apiClient` triggers a silent refresh call to `authService.refreshAccessToken()`.
  3. Upon receiving a fresh token, `authStore` updates the in-memory token.
  4. All queued requests in `failedQueue` are replayed with the new `Authorization: Bearer <token>` header.
  5. If the refresh token is expired or rejected, `onAuthFailure` triggers a clean logout and redirects to `/login`.

---

## 4. Kanban Drag-and-Drop & Undo Stack (Task 02)

### `@dnd-kit` Architecture
- **Sensors**: `PointerSensor` configured with an activation constraint of `distance: 5px`. This allows smooth clicks (to open the Task Details Drawer) without accidental drag triggers.
- **Collision Detection**: Uses `closestCorners` to provide fluid inter-column and intra-column movement.
- **Undo History**:
  When a task is dragged between columns, `boardStore.moveTask()` pushes a `DragActionHistory` record `{ taskId, sourceStatus, destStatus, sourceIndex, destIndex, timestamp }` onto `undoStack`.
  Clicking the "Undo" button on the toast triggers `undoLastAction()`, which repositions the task back to its exact prior column and index.

---

## 5. Tab-Aware Real-Time Notification Polling (Task 05)

### Visibility Lifecycle
```
User active on tab ──► Polling active every 20s ──► Ingests new IDs ──► Shows Toast alert
         │
User switches tab / minimizes
         │
`document.visibilitychange` ('hidden') ──► clearInterval(timerRef) ──► Polling paused (0 network requests)
         │
User returns to tab
         │
`document.visibilitychange` ('visible') ──► Immediate fetch ──► Restarts interval
```
