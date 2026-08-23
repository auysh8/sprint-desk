/**
 * mockDataService.ts
 *
 * Dedicated data access service for public/mock-data.json.
 * Adheres strictly to Section 7.3:
 * UI Components -> Hooks -> mockDataService -> mock-data.json
 */

import type { User, Sprint, Task, Comment, MockDataPayload } from '../types/board';
import type { NotificationItem } from '../types/notification';

class MockDataService {
  private cache: MockDataPayload | null = null;
  private fetchPromise: Promise<MockDataPayload> | null = null;

  /**
   * Fetch and cache raw mock data from /mock-data.json
   */
  async getAllData(): Promise<MockDataPayload> {
    if (this.cache) {
      return this.cache;
    }

    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = (async () => {
      try {
        const response = await fetch('/mock-data.json');
        if (!response.ok) {
          throw new Error(`Failed to load mock data: ${response.statusText}`);
        }
        const data: MockDataPayload = await response.json();
        this.cache = data;
        return data;
      } catch (error) {
        console.error('[mockDataService] Error fetching /mock-data.json:', error);
        throw error;
      } finally {
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  async getUsers(): Promise<User[]> {
    const data = await this.getAllData();
    return data.users || [];
  }

  async getSprints(): Promise<Sprint[]> {
    const data = await this.getAllData();
    return data.sprints || [];
  }

  async getInitialTasks(): Promise<Task[]> {
    const data = await this.getAllData();
    // Return first 30 tasks as required by Task 02
    return (data.tasks || []).slice(0, 30);
  }

  async getComments(taskId?: number): Promise<Comment[]> {
    const data = await this.getAllData();
    if (taskId !== undefined) {
      return (data.comments || []).filter((c) => c.taskId === taskId);
    }
    return data.comments || [];
  }

  async getInitialNotifications(): Promise<NotificationItem[]> {
    const data = await this.getAllData();
    return (data.notifications || []).map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      createdAt: n.createdAt,
    }));
  }
}

export const mockDataService = new MockDataService();
