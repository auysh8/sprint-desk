# ⚡ SprintDesk — High-Velocity Agile Project Management

> A streamlined, enterprise-grade sprint and project management web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **@dnd-kit**, featuring a handcrafted Linear-inspired obsidian dark aesthetic.

![SprintDesk](https://img.shields.io/badge/SprintDesk-v1.0_Pro-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-100%25_Passing-729B1B?style=for-the-badge&logo=vitest)

---

## 🚀 Live Demo & Demo Credentials

| Role | Username | Password | Features |
| :--- | :--- | :--- | :--- |
| **Lead Engineer** | `emilys` | `emilyspass` | Full sprint permissions, drag-and-drop, task deletion, comment moderation |
| **Frontend Dev** | `michaelw` | `michaelwpass` | Task updates, filtering, real-time notifications, analytics export |

*Note: Quick-fill buttons are provided directly on the Login screen for 1-click access.*

---

## 🛠️ Tech Stack & Constraints

- **Framework**: React 19 + TypeScript (Strict Mode)
- **Bundler**: Vite
- **Styling**: 100% custom Tailwind CSS v4 design system (Linear-inspired obsidian aesthetic) — **Zero third-party UI libraries (No MUI / AntD / Shadcn)**
- **Routing**: React Router v7 with route code splitting (`React.lazy` + `Suspense`)
- **State Management**: Zustand v5 with selective `localStorage` persistence
- **Drag-and-Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Charts / Visualizations**: Recharts
- **Testing**: Vitest + React Testing Library + JSDOM

---

## 🌟 Key Features

### 1. 🔐 Authentication & Session Security (Task 01)
- **DummyJSON API Integration**: Authentic POST request to `https://dummyjson.com/auth/login`.
- **In-Memory JWT Access Token**: Access token is stored strictly in memory for security against XSS.
- **Simulated Refresh Token**: Long-lived refresh token stored in simulated persistent storage.
- **HTTP Interceptor**: Automatic `Authorization: Bearer <token>` injection, 401 interception, silent token refresh, and request retry queue.
- **Route Guards**: `<ProtectedRoute>` and `<PublicRoute>` with branded full-screen loading skeleton on session restore.
- **Bonus**: Real-time password strength meter and 30-day "Remember Me" session support.

### 2. 📋 Interactive Kanban Sprint Board (Task 02)
- **4 Workflow Columns**: `Backlog`, `In Progress`, `Review`, `Done`.
- **30 Initial Tasks**: Preloaded from dataset with status, priority, due date, and assignee metadata.
- **`@dnd-kit` Mechanics**: Smooth pointer & keyboard drag-and-drop with floating `DragOverlay` and collision detection.
- **Bonus - Undo Move**: Moving a task immediately triggers a Toast with an **Undo** button that reverses the move.
- **Task Details Drawer**: Slide-in panel for editing title, description, priority, assignee, status, due date, and comment thread.
- **Modals**: Create Task with input validation and Delete Task confirmation modal.
- **Filters**: Live search query, Priority filter, and Assignee filter.

### 3. 📊 Sprint Analytics & Recharts (Task 03)
- **Sprint Velocity**: Planned vs completed tasks per sprint cycle.
- **Status Distribution**: Donut chart with center count and status percentages.
- **Priority Matrix**: Stacked bar chart showing High, Medium, Low severity across columns.
- **Completion Trend**: Area chart showing cumulative completed velocity over time.
- **Bonus**: Date range filtering (7d, 14d, 30d) and structured JSON snapshot export.

### 4. 🔔 Tab-Aware Real-Time Notifications (Task 05)
- **Live Event Stream**: Simulated polling against `https://jsonplaceholder.typicode.com/posts?_limit=5`.
- **Tab-Aware Lifecycle**: Automatically pauses polling when the browser tab is inactive (`visibilityState === 'hidden'`) and resumes instantly when active.
- **Notification Dropdown**: Top bell icon with live unread count badge (`3 new`, `9+`), read/unread toggle, and toast alert triggers.

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Run

```bash
# 1. Clone or navigate to the project directory
cd sprint-desk

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run test suites
npm run test

# 5. Build for production
npm run build
```

---

## 🧪 Testing Suite (Task 06)

Run all unit tests with:
```bash
npm run test
```

Test coverage includes:
- `src/test/useToast.test.tsx` (Toast creation, auto-dismiss, action callbacks, clear all)
- `src/test/boardStore.test.ts` (Task creation, status moves, reordering, deletion, and Undo history)
- `src/test/apiClient.test.ts` (Bearer token header injection, 401 interception, and retry queue)
