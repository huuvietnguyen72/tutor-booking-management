export type NotificationType = 'REQUEST' | 'APPROVAL' | 'SUCCESS' | 'REMINDER' | 'SYSTEM';

export interface NotificationRecord {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}
