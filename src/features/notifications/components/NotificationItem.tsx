import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Star,
  Gift,
  Bell,
  Mail,
  Shield,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { Notification, NotificationType } from "../notifications.types";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeIconMap: Record<NotificationType, React.ElementType> = {
  ORDER_PLACED: ShoppingBag,
  ORDER_ACCEPTED: CheckCircle,
  ORDER_REJECTED: XCircle,
  ORDER_PREPARING: Clock,
  ORDER_READY: CheckCircle,
  ORDER_PICKED_UP: Truck,
  ORDER_IN_TRANSIT: Truck,
  ORDER_DELIVERED: CheckCircle,
  ORDER_CANCELLED: XCircle,
  WELCOME: Bell,
  EMAIL_VERIFIED: Mail,
  PASSWORD_RESET: Shield,
  REVIEW_REPLY: Star,
  REVIEW_APPROVED: Star,
  PROMOTION_NEW: Gift,
  STAMP_COMPLETED: Gift,
  DELIVERY_ASSIGNED: Truck,
  RESTAURANT_APPROVED: CheckCircle,
  RESTAURANT_REJECTED: XCircle,
  SYSTEM: Bell,
};

const typeColorMap: Record<string, string> = {
  ORDER_PLACED: "text-blue-600 bg-blue-50",
  ORDER_ACCEPTED: "text-green-600 bg-green-50",
  ORDER_REJECTED: "text-red-600 bg-red-50",
  ORDER_PREPARING: "text-yellow-600 bg-yellow-50",
  ORDER_READY: "text-green-600 bg-green-50",
  ORDER_PICKED_UP: "text-indigo-600 bg-indigo-50",
  ORDER_IN_TRANSIT: "text-purple-600 bg-purple-50",
  ORDER_DELIVERED: "text-green-600 bg-green-50",
  ORDER_CANCELLED: "text-red-600 bg-red-50",
  WELCOME: "text-primary bg-primary/10",
  EMAIL_VERIFIED: "text-green-600 bg-green-50",
  PASSWORD_RESET: "text-yellow-600 bg-yellow-50",
  REVIEW_REPLY: "text-blue-600 bg-blue-50",
  REVIEW_APPROVED: "text-green-600 bg-green-50",
  PROMOTION_NEW: "text-primary bg-primary/10",
  STAMP_COMPLETED: "text-primary bg-primary/10",
  DELIVERY_ASSIGNED: "text-indigo-600 bg-indigo-50",
  RESTAURANT_APPROVED: "text-green-600 bg-green-50",
  RESTAURANT_REJECTED: "text-red-600 bg-red-50",
  SYSTEM: "text-gray-600 bg-gray-50",
};

function timeAgo(
  dateStr: string,
  t: (key: string, opts?: Record<string, unknown>) => string,
): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t("justNow");
  if (minutes < 60) return t("minutesAgo", { count: minutes });
  if (hours < 24) return t("hoursAgo", { count: hours });
  return t("daysAgo", { count: days });
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const { t } = useTranslation("notifications");
  const Icon = typeIconMap[notification.type] || Bell;
  const colorClass =
    typeColorMap[notification.type] || "text-gray-600 bg-gray-50";

  return (
    <div
      className={`group flex gap-3 rounded-lg border p-4 transition-colors ${
        notification.is_read
          ? "border-border bg-white"
          : "border-primary/20 bg-primary/5"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}
      >
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm ${notification.is_read ? "font-normal" : "font-semibold"}`}
            >
              {notification.title}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {notification.body}
            </p>
          </div>
          <span className="ml-2 shrink-0 text-xs text-muted-foreground">
            {timeAgo(notification.created_at, t)}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onMarkRead(notification.id)}
            >
              {t("markRead")}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-error hover:text-error"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 size={12} className="mr-1" />
            {t("delete")}
          </Button>
        </div>
      </div>

      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </div>
  );
}
