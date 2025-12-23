import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "../notifications.api";
import { NotificationItem } from "../components/NotificationItem";
import type { NotificationListParams } from "../notifications.types";

type FilterType = "all" | "unread" | "orders" | "promotions" | "system";

export function NotificationsPage() {
  const { t } = useTranslation("notifications");
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);

  const params: NotificationListParams = {
    page,
    limit: 20,
    ...(filter === "unread" && { is_read: "false" }),
    ...(filter === "orders" && { type: "ORDER_PLACED" }), // Will show order-related
    ...(filter === "promotions" && { type: "PROMOTION_NEW" }),
    ...(filter === "system" && { type: "SYSTEM" }),
  };

  const { data, isLoading, isFetching } = useGetNotificationsQuery(params);
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();
  const [deleteOne] = useDeleteNotificationMutation();
  const [deleteAll, { isLoading: isDeletingAll }] =
    useDeleteAllNotificationsMutation();

  const notifications = data?.data ?? [];
  const meta = data?.meta;

  const handleMarkRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
      toast.success(t("success.markedRead"));
    } catch {
      toast.error(t("errors.markReadFailed"));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
      toast.success(t("success.allMarkedRead"));
    } catch {
      toast.error(t("errors.markReadFailed"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOne(id).unwrap();
      toast.success(t("success.deleted"));
    } catch {
      toast.error(t("errors.deleteFailed"));
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(t("confirmDeleteAll"))) return;
    try {
      await deleteAll().unwrap();
      toast.success(t("success.allDeleted"));
    } catch {
      toast.error(t("errors.deleteFailed"));
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value as FilterType);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.all")}</SelectItem>
              <SelectItem value="unread">{t("filters.unread")}</SelectItem>
              <SelectItem value="orders">{t("filters.orders")}</SelectItem>
              <SelectItem value="promotions">
                {t("filters.promotions")}
              </SelectItem>
              <SelectItem value="system">{t("filters.system")}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
          >
            <CheckCheck size={14} className="mr-1.5" />
            {t("markAllRead")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAll}
            disabled={isDeletingAll}
            className="text-error hover:text-error"
          >
            <Trash2 size={14} className="mr-1.5" />
            {t("deleteAll")}
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Bell size={24} className="text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-medium">{t("empty")}</h3>
          <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
            {t("emptyDesc")}
          </p>
        </div>
      )}

      {/* Notification list */}
      {!isLoading && notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasPrevPage || isFetching}
            onClick={() => setPage((p) => p - 1)}
          >
            ←
          </Button>
          <span className="text-sm text-muted-foreground">
            {meta.page} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasNextPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            →
          </Button>
        </div>
      )}
    </div>
  );
}
