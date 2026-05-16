'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessStore } from '@/store/business.store';
import { useReadNotification } from '@/hooks/mutation/useNotification';
import { useNotifications } from '@/hooks/queries/useNotification';
import { useNotificationSse } from '@/hooks/useNotificationSse';
import { NotificationItem } from '@/types/notification/notification.type';
import ToastMessage from './ToastMessage';

function BellIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9.5 20a2.5 2.5 0 0 0 5 0M18 8.5a6 6 0 1 0-12 0c0 6-2 7.5-2 7.5h16s-2-1.5-2-7.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatNotificationDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getNotificationTarget(notification: NotificationItem) {
  if (
    notification.type === 'AI_REPORT_COMPLETED' &&
    typeof notification.referenceId === 'number'
  ) {
    return {
      route: '/report',
      planId: notification.referenceId,
    };
  }

  return null;
}

export default function NotificationBell({
  isHomePage,
}: {
  isHomePage: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recentNotificationIdsRef = useRef<Set<number>>(new Set());
  const recentNotificationOrderRef = useRef<number[]>([]);
  const router = useRouter();
  const setPlanId = useBusinessStore((state) => state.setPlanId);
  const { data: notifications = [], isLoading } = useNotifications(true);
  const { mutateAsync: markAsRead, isPending } = useReadNotification();

  const clearToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(null);
  };

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 4000);
  };

  useNotificationSse(true, {
    onNotification: (message) => {
      if (recentNotificationIdsRef.current.has(message.notificationId)) {
        return;
      }

      recentNotificationIdsRef.current.add(message.notificationId);
      recentNotificationOrderRef.current.push(message.notificationId);

      if (recentNotificationOrderRef.current.length > 50) {
        const oldestNotificationId = recentNotificationOrderRef.current.shift();
        if (typeof oldestNotificationId === 'number') {
          recentNotificationIdsRef.current.delete(oldestNotificationId);
        }
      }

      showToast(`${message.title} ${message.message}`);
    },
  });

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );
  const visibleNotifications = useMemo(
    () => notifications.filter((notification) => !notification.read),
    [notifications]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      recentNotificationIdsRef.current.clear();
      recentNotificationOrderRef.current = [];
    };
  }, []);

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.read) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
      }
    }

    setIsOpen(false);

    const target = getNotificationTarget(notification);
    if (!target) {
      return;
    }

    setPlanId(target.planId);
    router.push(target.route);
  };

  return (
    <div ref={wrapperRef} className="relative mr-3">
      <button
        type="button"
        aria-label="알림"
        data-notification-toast-anchor
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/5 ${
          isHomePage ? 'text-white' : 'text-gray-900'
        }`}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] rounded-full bg-primary-500 px-1 text-center text-[10px] font-semibold leading-[18px] text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 z-20 w-[340px] overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="ds-subtitle font-semibold text-gray-900">알림</div>
            {unreadCount > 0 && (
              <div className="ds-caption font-medium text-primary-500">
                미읽음 {unreadCount}
              </div>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {isLoading && (
              <div className="ds-text px-4 py-6 text-gray-500">불러오는 중...</div>
            )}

            {!isLoading && visibleNotifications.length === 0 && (
              <div className="ds-text px-4 py-6 text-gray-500">
                도착한 알림이 없습니다.
              </div>
            )}

            {!isLoading &&
              visibleNotifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  disabled={isPending}
                  className="w-full cursor-pointer bg-primary-50/40 px-4 py-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-500" />
                    <div className="min-w-0 flex-1">
                      <div className="ds-subtext font-semibold text-gray-900">
                        {notification.title}
                      </div>
                      <p className="ds-caption mt-1 whitespace-pre-line text-gray-700">
                        {notification.message}
                      </p>
                      <div className="ds-caption mt-2 text-gray-500">
                        {formatNotificationDate(notification.createdAt)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {toastMessage && (
        <ToastMessage
          message={toastMessage}
          onClose={clearToast}
          variant="notification"
          anchorSelector='[data-notification-toast-anchor]'
          verticalOffset={-4}
          horizontalOffset={-300}
        />
      )}
    </div>
  );
}
