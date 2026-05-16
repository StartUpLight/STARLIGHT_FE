import api from './api';
import {
  NotificationItem,
  NotificationListResponse,
} from '@/types/notification/notification.type';

export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await api.get<NotificationListResponse>('/v1/notifications');
  return response.data.data;
}

export async function readNotification(notificationId: number): Promise<void> {
  await api.patch(`/v1/notifications/${notificationId}/read`);
}

