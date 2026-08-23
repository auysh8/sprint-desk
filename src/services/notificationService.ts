/**
 * notificationService.ts
 *
 * Polling service connecting to JSONPlaceholder (Task 05)
 * Endpoint: https://jsonplaceholder.typicode.com/posts?_limit=5
 */

import type { JsonPlaceholderPost, NotificationItem } from '../types/notification';

const JSONPLACEHOLDER_POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';

const NOTIFICATION_TEMPLATES = [
  {
    type: 'task',
    title: 'Task Requirements Updated',
    message: 'Acceptance criteria and test definitions were revised for Sprint 3.',
  },
  {
    type: 'review',
    title: 'Code Review Requested',
    message: 'Sprint Analytics and Kanban board updates are ready for peer review.',
  },
  {
    type: 'sprint',
    title: 'Sprint Milestone Reached',
    message: 'Team completed 8 story points ahead of the current sprint burndown target.',
  },
  {
    type: 'system',
    title: 'CI/CD Build Succeeded',
    message: 'Automated test suite passed and staging deployment finished successfully.',
  },
  {
    type: 'task',
    title: 'New Comment on Task',
    message: 'Sarah Jenkins left a note regarding drag-and-drop accessibility checks.',
  },
  {
    type: 'review',
    title: 'Pull Request Approved',
    message: 'Dark mode tokens and Material 3 design system updates approved.',
  },
  {
    type: 'task',
    title: 'Task Priority Escalated',
    message: 'Authentication token refresh interceptor set to High priority.',
  },
  {
    type: 'sprint',
    title: 'Sprint Retrospective Scheduled',
    message: 'Sprint 3 retrospective session set for Friday at 4:00 PM UTC.',
  },
] as const;

class NotificationService {
  /**
   * Fetch recent simulated posts from JSONPlaceholder
   */
  async fetchRecentPosts(): Promise<JsonPlaceholderPost[]> {
    const response = await fetch(JSONPLACEHOLDER_POSTS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }
    return (await response.json()) as JsonPlaceholderPost[];
  }

  /**
   * Transform a JSONPlaceholder post into a rich SprintDesk notification item
   * Mapping external simulated IDs to clean, context-rich English notifications
   */
  transformPostToNotification(post: JsonPlaceholderPost): NotificationItem {
    const templateIndex = Math.abs(post.id - 1) % NOTIFICATION_TEMPLATES.length;
    const template = NOTIFICATION_TEMPLATES[templateIndex];

    return {
      id: 1000 + post.id, // Offset to avoid collision with initial mock IDs
      sourcePostId: post.id,
      title: template.title,
      message: template.message,
      type: template.type,
      read: false,
      createdAt: new Date().toISOString(),
    };
  }
}

export const notificationService = new NotificationService();
