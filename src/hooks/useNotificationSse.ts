'use client';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const NOTIFICATION_SUBSCRIBE_PATH = '/v1/notifications/subscribe';

type NotificationSseMessage = {
  notificationId: number;
  type: string;
  title: string;
  message: string;
  referenceId: number | null;
  createdAt: string;
};

export function useNotificationSse(
  enabled: boolean,
  options?: {
    onNotification?: (message: NotificationSseMessage) => void;
  }
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return;
    }

    const controller = new AbortController();
    const subscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${NOTIFICATION_SUBSCRIBE_PATH}`;

    void fetchEventSource(subscribeUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${accessToken}`,
      },
      openWhenHidden: true,
      async onopen(response) {
        if (response.ok) {
          return;
        }

        if (response.status >= 400 && response.status < 500) {
          throw new Error(`SSE connection failed with status ${response.status}`);
        }
      },
      onmessage(message) {
        if (message.event !== 'notification') {
          return;
        }

        try {
          const payload = JSON.parse(message.data) as NotificationSseMessage;
          options?.onNotification?.(payload);
        } catch (error) {
          console.error('알림 SSE payload 파싱 실패:', error);
        }

        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
      onerror(error) {
        console.error('알림 SSE 연결 오류:', error);
      },
    });

    return () => {
      controller.abort();
    };
  }, [enabled, options, queryClient]);
}
