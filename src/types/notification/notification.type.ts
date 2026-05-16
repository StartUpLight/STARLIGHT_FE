export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  referenceId: number | null;
  read: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationListResponse {
  result: 'SUCCESS' | 'ERROR';
  data: NotificationItem[];
  error: {
    code: string;
    message: string;
  } | null;
}

