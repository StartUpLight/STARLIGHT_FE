import api from './api';
import {
  NotificationItem,
  NotificationListResponse,
} from '@/types/notification/notification.type';

export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await api.get<NotificationListResponse>('/v1/notifications');
  if (response.data.result === 'ERROR') {
    const error = response.data.error;
    throw new Error(
      error?.message
        ? `알림 목록 조회 실패: ${error.message}`
        : '알림 목록 조회에 실패했습니다.'
    );
  }

  return response.data.data;
}

export async function readNotification(notificationId: number): Promise<void> {
  await api.patch(`/v1/notifications/${notificationId}/read`);
}
