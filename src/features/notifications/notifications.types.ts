// Notifications feature types

export type NotificationType =
  | "ORDER_PLACED"
  | "ORDER_ACCEPTED"
  | "ORDER_REJECTED"
  | "ORDER_PREPARING"
  | "ORDER_READY"
  | "ORDER_PICKED_UP"
  | "ORDER_IN_TRANSIT"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "WELCOME"
  | "EMAIL_VERIFIED"
  | "PASSWORD_RESET"
  | "REVIEW_REPLY"
  | "REVIEW_APPROVED"
  | "PROMOTION_NEW"
  | "STAMP_COMPLETED"
  | "DELIVERY_ASSIGNED"
  | "RESTAURANT_APPROVED"
  | "RESTAURANT_REJECTED"
  | "SYSTEM";

export type NotificationChannel = "IN_APP" | "EMAIL" | "BOTH";
export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  channel: NotificationChannel;
  priority: NotificationPriority;
  is_read: boolean;
  read_at: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  is_read?: string; // "true" | "false"
}

export interface NotificationCountResponse {
  success: boolean;
  data: {
    total: number;
    unread: number;
  };
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: Notification[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface NotificationResponse {
  success: boolean;
  data: Notification;
}

export interface BulkActionResponse {
  success: boolean;
  message: string;
  data: {
    updated?: number;
    deleted?: number;
  };
}
