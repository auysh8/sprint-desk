/**
 * notificationService.ts
 *
 * Polling service connecting to JSONPlaceholder (Task 05)
 * Endpoint: https://jsonplaceholder.typicode.com/posts?_limit=5
 */

import type { JsonPlaceholderPost, NotificationItem } from '../types/notification';

const JSONPLACEHOLDER_POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';

const NOTIFICATION_TEMPLATES = [
  { type: 'task', title: 'New Task Update', message: 'A team member updated task requirements.' },
  { type: 'review', title: 'Code Review Requested', message: 'Pull request is ready for sprint review.' },
  { type: 'sprint', title: 'Sprint Milestone Reached', message: 'Velocity increased by 15% this cycle.' },
  { type: 'system', title: 'CI/CD Pipeline', message: 'Automated tests and deployment succeeded.' },
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
   */
  transformPostToNotification(post: JsonPlaceholderPost): NotificationItem {
    const templateIndex = post.id % NOTIFICATION_TEMPLATES.length;
    const template = NOTIFICATION_TEMPLATES[templateIndex];

    return {
      id: 1000 + post.id, // Offset to avoid collision with initial mock IDs
      sourcePostId: post.id,
      title: post.title ? post.title.slice(0, 35) + '...' : template.title,
      message: post.body ? post.body.slice(0, 80) + '...' : template.message,
      type: template.type,
      read: false,
      createdAt: new Date().toISOString(),
    };
  }
}

export const notificationService = new NotificationService();
