import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Task,
  TaskStatus,
  User,
  Sprint,
  Comment,
  BoardFilters,
  CreateTaskPayload,
  UpdateTaskPayload,
  DragActionHistory,
} from '../types/board';
import { mockDataService } from '../services/mockDataService';

interface BoardState {
  tasks: Task[];
  users: User[];
  sprints: Sprint[];
  comments: Comment[];
  isLoading: boolean;
  selectedTaskId: number | null;
  filters: BoardFilters;
  undoStack: DragActionHistory[];

  // Actions
  loadBoardData: () => Promise<void>;
  setSelectedTaskId: (id: number | null) => void;
  setFilters: (filters: Partial<BoardFilters>) => void;
  resetFilters: () => void;
  addTask: (payload: CreateTaskPayload) => Task;
  updateTask: (id: number, payload: UpdateTaskPayload) => void;
  deleteTask: (id: number) => void;
  moveTask: (taskId: number, destStatus: TaskStatus, destIndex?: number) => void;
  reorderTask: (taskId: number, destIndex: number) => void;
  undoLastAction: () => DragActionHistory | null;
  addComment: (taskId: number, authorId: number, message: string) => Comment;
}

const initialFilters: BoardFilters = {
  searchQuery: '',
  priority: 'all',
  assigneeId: 'all',
  sprintId: 'all',
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      tasks: [],
      users: [],
      sprints: [],
      comments: [],
      isLoading: false,
      selectedTaskId: null,
      filters: initialFilters,
      undoStack: [],

      loadBoardData: async () => {
        const state = get();
        // If data is already hydrated, load auxiliary data if missing
        if (state.tasks.length > 0 && state.users.length > 0 && state.sprints.length > 0) {
          return;
        }

        set({ isLoading: true });
        try {
          const [users, sprints, tasks, comments] = await Promise.all([
            mockDataService.getUsers(),
            mockDataService.getSprints(),
            mockDataService.getInitialTasks(),
            mockDataService.getComments(),
          ]);

          set({
            users,
            sprints,
            tasks: state.tasks.length > 0 ? state.tasks : tasks,
            comments: state.comments.length > 0 ? state.comments : comments,
            isLoading: false,
          });
        } catch (error) {
          console.error('[boardStore] Failed to load mock data:', error);
          set({ isLoading: false });
        }
      },

      setSelectedTaskId: (id: number | null) => set({ selectedTaskId: id }),

      setFilters: (newFilters: Partial<BoardFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      resetFilters: () => set({ filters: initialFilters }),

      addTask: (payload: CreateTaskPayload) => {
        const tasks = get().tasks;
        const columnTasks = tasks.filter((t) => t.status === payload.status);
        const maxOrder = columnTasks.reduce((max, t) => Math.max(max, t.order), -1);

        const newTask: Task = {
          id: Date.now(),
          title: payload.title,
          description: payload.description,
          status: payload.status,
          priority: payload.priority,
          assigneeId: payload.assigneeId,
          dueDate: payload.dueDate,
          sprintId: payload.sprintId,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
          completedAt: payload.status === 'done' ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        };

        set({ tasks: [newTask, ...tasks] });
        return newTask;
      },

      updateTask: (id: number, payload: UpdateTaskPayload) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;

            const isDone = payload.status === 'done' || (payload.status === undefined && task.status === 'done');
            return {
              ...task,
              ...payload,
              completedAt: isDone ? task.completedAt || new Date().toISOString() : null,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteTask: (id: number) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
        }));
      },

      moveTask: (taskId: number, destStatus: TaskStatus, destIndex?: number) => {
        const tasks = [...get().tasks];
        const taskIndex = tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return;

        const currentTask = tasks[taskIndex];
        const sourceStatus = currentTask.status;
        const sourceColumnTasks = tasks.filter((t) => t.status === sourceStatus);
        const sourceIndex = sourceColumnTasks.findIndex((t) => t.id === taskId);

        // Record for undo action
        const historyRecord: DragActionHistory = {
          taskId,
          sourceStatus,
          destStatus,
          sourceIndex: sourceIndex >= 0 ? sourceIndex : 0,
          destIndex: destIndex ?? 0,
          timestamp: Date.now(),
        };

        // Update task status
        const updatedTask: Task = {
          ...currentTask,
          status: destStatus,
          completedAt: destStatus === 'done' ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        };

        tasks.splice(taskIndex, 1);

        // Position in destination column
        const destColumnTasks = tasks.filter((t) => t.status === destStatus);
        const targetIndex = destIndex !== undefined ? Math.min(destIndex, destColumnTasks.length) : destColumnTasks.length;

        destColumnTasks.splice(targetIndex, 0, updatedTask);

        // Reassign clean order numbers to destination column
        destColumnTasks.forEach((t, idx) => {
          t.order = idx;
        });

        // Merge updated column back with other tasks
        const otherTasks = tasks.filter((t) => t.status !== destStatus);
        set({
          tasks: [...otherTasks, ...destColumnTasks],
          undoStack: [historyRecord, ...get().undoStack.slice(0, 19)], // Keep up to 20 undos
        });
      },

      reorderTask: (taskId: number, destIndex: number) => {
        const tasks = [...get().tasks];
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const columnTasks = tasks.filter((t) => t.status === task.status).sort((a, b) => a.order - b.order);
        const currentIndex = columnTasks.findIndex((t) => t.id === taskId);
        if (currentIndex === -1 || currentIndex === destIndex) return;

        const [movedTask] = columnTasks.splice(currentIndex, 1);
        columnTasks.splice(destIndex, 0, movedTask);

        columnTasks.forEach((t, idx) => {
          t.order = idx;
        });

        const otherTasks = tasks.filter((t) => t.status !== task.status);
        set({ tasks: [...otherTasks, ...columnTasks] });
      },

      undoLastAction: () => {
        const undoStack = [...get().undoStack];
        if (undoStack.length === 0) return null;

        const lastAction = undoStack.shift()!;
        const { taskId, sourceStatus, sourceIndex } = lastAction;

        // Restore task to previous status and index
        const tasks = [...get().tasks];
        const taskIndex = tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return null;

        const currentTask = {
          ...tasks[taskIndex],
          status: sourceStatus,
          completedAt: sourceStatus === 'done' ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        };

        tasks.splice(taskIndex, 1);
        const sourceColumnTasks = tasks.filter((t) => t.status === sourceStatus);
        sourceColumnTasks.splice(sourceIndex, 0, currentTask);

        sourceColumnTasks.forEach((t, idx) => {
          t.order = idx;
        });

        const otherTasks = tasks.filter((t) => t.status !== sourceStatus);
        set({
          tasks: [...otherTasks, ...sourceColumnTasks],
          undoStack,
        });

        return lastAction;
      },

      addComment: (taskId: number, authorId: number, message: string) => {
        const newComment: Comment = {
          id: Date.now(),
          taskId,
          authorId,
          message,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          comments: [...state.comments, newComment],
        }));

        return newComment;
      },
    }),
    {
      name: 'sprintdesk_board_store',
      partialize: (state) => ({
        tasks: state.tasks,
        comments: state.comments,
        filters: state.filters,
      }),
    }
  )
);
