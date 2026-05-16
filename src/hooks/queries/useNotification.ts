import { getNotifications } from '@/api/notification';
import { NotificationItem } from '@/types/notification/notification.type';
import { useQuery } from '@tanstack/react-query';

export function useNotifications(enabled: boolean) {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    enabled,
    refetchInterval: enabled ? 60000 : false,
  });
}

