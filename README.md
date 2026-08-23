# ⚡ SprintDesk — High-Velocity Agile Project Management

> A streamlined, enterprise-grade sprint and project management web application built with **React 18+**, **TypeScript (Strict Mode)**, **Tailwind CSS**, and **@dnd-kit**, featuring a bespoke **Pure AMOLED Dark (`#000000`) & Crisp White** design system with vibrant token accents.

![SprintDesk](https://img.shields.io/badge/SprintDesk-v1.0-000000?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict_Mode-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Vitest-100%25_Passing-729B1B?style=for-the-badge&logo=vitest)

---

## 📚 Technical Documentation & Architecture

- 🏛️ [**ARCHITECTURE.md**](ARCHITECTURE.md) — Comprehensive system architecture, state management rationale, JWT lifecycle, and data flow.
- 📡 [**API.md**](API.md) — REST & simulated API endpoint schemas, request/response structures, and mock data contracts.

---

## 🚀 Live Demo & Demo Credentials

| Role | Username | Password | Features |
| :--- | :--- | :--- | :--- |
| **Lead Engineer** | `emilys` | `emilyspass` | Full sprint permissions, drag-and-drop, task deletion, comment moderation |
| **Frontend Dev** | `michaelw` | `michaelwpass` | Task updates, filtering, real-time notifications, analytics export |

*Note: Quick-fill buttons are provided directly on the Login screen for 1-click access.*

---

## 🛠️ Tech Stack & Mandatory Requirements

- **Framework**: React 18+ (Strict Mode)
- **Language**: TypeScript (Strict Mode)
- **Bundler**: Vite
- **Styling**: 100% custom Tailwind CSS design system — **Zero third-party UI libraries (No MUI / AntD / Chakra / Shadcn)**
- **Routing**: React Router v6+ with route code splitting (`React.lazy` + `Suspense`)
- **State Management**: 
  - **Client State**: Zustand v5 with selective `localStorage` persistence
  - **Server State**: TanStack Query v5 / Service Layer Data Abstraction
- **Drag-and-Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Charts / Visualizations**: Recharts (fully responsive, animated, derived from live state)
- **Testing**: Vitest + React Testing Library + JSDOM

---

## 🌟 Functional Implementation Overview

### 1. 🔐 Authentication & Session Security (Task 01)
- **DummyJSON API Integration**: Authentic POST request to `https://dummyjson.com/auth/login`.
- **In-Memory JWT Access Token**: Access token is stored strictly in memory for security against XSS.
- **Simulated Refresh Token**: Long-lived refresh token stored in simulated persistent storage.
- **HTTP Interceptor**: Automatic `Authorization: Bearer <token>` injection, 401 interception, silent token refresh, and request retry queue.
- **Route Guards**: `<ProtectedRoute>` and `<PublicRoute>` with branded full-screen loading state on session restore.
- **Bonus Features**: Real-time password strength meter and 30-day "Remember Me" session support.

### 2. 📋 Interactive Kanban Sprint Board (Task 02)
- **4 Workflow Columns**: `Backlog`, `In Progress`, `Review`, `Done`.
- **30 Preloaded Tasks**: Sourced from `public/mock-data.json` with priority, assignee, status, and due date.
- **`@dnd-kit` Mechanics**: Fluid pointer & keyboard drag-and-drop with floating `DragOverlay` and collision detection.
- **Bonus - Undo Move**: Moving a task immediately triggers a Toast alert with an **Undo** button that reverses the move.
- **Task Details Drawer**: Slide-in panel for editing title, description, priority, assignee, status, due date, and comment thread.
- **Modals**: Create Task modal with input validation and Delete Task confirmation modal.
- **Live Board Filters**: Real-time search query, Priority filter, and Assignee filter.

### 3. 📊 Sprint Analytics & Recharts (Task 03)
- **Sprint Velocity**: Planned vs completed tasks per sprint cycle.
- **Status Distribution**: Donut chart with status counts and percentages.
- **Priority Matrix**: Stacked bar chart showing High, Medium, Low severity across columns.
- **Completion Trend**: Area chart showing cumulative completed velocity over time.
- **Bonus Features**: Date range filtering (7d, 14d, 30d, all) and structured report export.

### 4. 🎨 Design System & Custom UI Primitives (Task 04)
Built completely from scratch with Tailwind CSS (no external component libraries):
- `Button` (Primary white, secondary neutral, outline, ghost, danger)
- `Input` & `Select` (AMOLED dark elevation, accessible focus rings)
- `Modal` & `Drawer` (Accessible with ESC key listeners and backdrop traps)
- `DataTable` (Search, sorting arrows, pagination, stable container height, transition animations)
- `Toast` (Context-driven notifications with action triggers)
- `Skeleton` (Neutral AMOLED shimmer placeholders)

### 5. 🔔 Tab-Aware Real-Time Notifications (Task 05)
- **Live Event Stream**: Simulated polling against `https://jsonplaceholder.typicode.com/posts?_limit=5`.
- **Tab-Aware Lifecycle**: Automatically pauses polling when the browser tab is inactive (`visibilityState === 'hidden'`) and resumes instantly when active.
- **Notification Dropdown**: Bell icon with live unread count badge, read/unread toggle, pagination, and toast alerts for incoming notifications.

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
