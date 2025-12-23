import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useGetNotificationCountQuery } from "../notifications.api";

export function NotificationBell() {
  const { t } = useTranslation("notifications");
  const { isAuthenticated } = useAuth();

  const { data } = useGetNotificationCountQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 30_000, // Poll every 30 seconds
  });

  const unreadCount = data?.data?.unread ?? 0;

  if (!isAuthenticated) return null;

  return (
    <Link
      to="/account/notifications"
      className="relative text-foreground hover:text-primary"
      title={t("title")}
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
