export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Comment {
  id: number;
  taskId: number;
  authorId: number;
  message: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number;
  dueDate: string;
  sprintId: number;
  order: number;
  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  description?: string;
}

export interface BoardFilters {
  searchQuery: string;
  priority: TaskPriority | 'all';
  assigneeId: number | 'all';
  sprintId: number | 'all';
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number;
  dueDate: string;
  sprintId: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: number;
  dueDate?: string;
  sprintId?: number;
  order?: number;
  completedAt?: string | null;
}

export interface DragActionHistory {
  taskId: number;
  sourceStatus: TaskStatus;
  destStatus: TaskStatus;
  sourceIndex: number;
  destIndex: number;
  timestamp: number;
}

export interface MockDataPayload {
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
  comments: Comment[];
  notifications: Array<{
    id: number;
    title: string;
    message: string;
    type: 'task' | 'review' | 'system';
    read: boolean;
    createdAt: string;
  }>;
}
