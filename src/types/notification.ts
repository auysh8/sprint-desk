export type NotificationType = 'task' | 'review' | 'system' | 'sprint';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  sourcePostId?: number; // Linked JSONPlaceholder post ID if simulated
}

export interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface NotificationFilter {
  status: 'all' | 'unread' | 'read';
}
