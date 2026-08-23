import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from '../store/boardStore';

describe('useBoardStore', () => {
  beforeEach(() => {
    // Reset store state
    useBoardStore.setState({
      tasks: [],
      users: [
        { id: 1, name: 'Emily Johnson', email: 'emily@example.com', avatar: '' },
        { id: 2, name: 'Michael Williams', email: 'michael@example.com', avatar: '' },
      ],
      sprints: [{ id: 1, name: 'Sprint 34', startDate: '2026-08-01', endDate: '2026-08-15' }],
      comments: [],
      undoStack: [],
    });
  });

  it('adds a new task with correct defaults', () => {
    const store = useBoardStore.getState();

    const createdTask = store.addTask({
      title: 'Fix authentication cookie bug',
      description: 'Session cookie expires too early',
      status: 'backlog',
      priority: 'high',
      assigneeId: 1,
      dueDate: '2026-08-30',
      sprintId: 1,
    });

    const updatedTasks = useBoardStore.getState().tasks;
    expect(updatedTasks).toHaveLength(1);
    expect(updatedTasks[0].title).toBe('Fix authentication cookie bug');
    expect(updatedTasks[0].priority).toBe('high');
    expect(updatedTasks[0].id).toBe(createdTask.id);
  });

  it('moves task between columns and records undo history', () => {
    const store = useBoardStore.getState();
    const task = store.addTask({
      title: 'Implement Dark Mode',
      description: 'Add Tailwind dark theme',
      status: 'backlog',
      priority: 'medium',
      assigneeId: 2,
      dueDate: '2026-08-25',
      sprintId: 1,
    });

    expect(useBoardStore.getState().tasks[0].status).toBe('backlog');

    // Move to in-progress
    useBoardStore.getState().moveTask(task.id, 'in-progress');

    const movedTask = useBoardStore.getState().tasks.find((t) => t.id === task.id);
    expect(movedTask?.status).toBe('in-progress');
    expect(useBoardStore.getState().undoStack).toHaveLength(1);
  });

  it('successfully undos last drag movement', () => {
    const store = useBoardStore.getState();
    const task = store.addTask({
      title: 'Setup Vitest suite',
      description: 'Unit test setup',
      status: 'review',
      priority: 'low',
      assigneeId: 1,
      dueDate: '2026-08-28',
      sprintId: 1,
    });

    // Move to done
    useBoardStore.getState().moveTask(task.id, 'done');
    expect(useBoardStore.getState().tasks.find((t) => t.id === task.id)?.status).toBe('done');

    // Undo action
    const undone = useBoardStore.getState().undoLastAction();
    expect(undone).not.toBeNull();
    expect(useBoardStore.getState().tasks.find((t) => t.id === task.id)?.status).toBe('review');
  });

  it('deletes a task', () => {
    const store = useBoardStore.getState();
    const task = store.addTask({
      title: 'Temporary Task',
      description: 'To be removed',
      status: 'backlog',
      priority: 'low',
      assigneeId: 1,
      dueDate: '2026-08-30',
      sprintId: 1,
    });

    expect(useBoardStore.getState().tasks).toHaveLength(1);

    useBoardStore.getState().deleteTask(task.id);
    expect(useBoardStore.getState().tasks).toHaveLength(0);
  });

  it('adds a comment to a task', () => {
    const store = useBoardStore.getState();
    const task = store.addTask({
      title: 'Task with comments',
      description: 'Discussing specs',
      status: 'in-progress',
      priority: 'medium',
      assigneeId: 1,
      dueDate: '2026-08-30',
      sprintId: 1,
    });

    const comment = useBoardStore.getState().addComment(task.id, 1, 'Initial draft is ready for review.');
    expect(comment.message).toBe('Initial draft is ready for review.');
    expect(useBoardStore.getState().comments).toHaveLength(1);
  });
});
