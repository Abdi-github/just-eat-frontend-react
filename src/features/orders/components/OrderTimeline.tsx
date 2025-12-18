import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ChefHat,
  Package,
  Bike,
  MapPin,
  CircleDot,
} from "lucide-react";
import type { OrderStatus, TimelineEntry } from "../orders.types";
import type { OrderDetail } from "../orders.types";
import { formatDateTime } from "@/shared/utils/formatters";

interface OrderTimelineProps {
  order: OrderDetail;
  className?: string;
}

const STATUS_ORDER: OrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
];

const statusIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  PLACED: Clock,
  ACCEPTED: CheckCircle2,
  REJECTED: XCircle,
  PREPARING: ChefHat,
  READY: Package,
  PICKED_UP: Package,
  IN_TRANSIT: Bike,
  DELIVERED: MapPin,
  CANCELLED: XCircle,
};

function buildTimeline(order: OrderDetail): TimelineEntry[] {
  const timestampMap: Partial<Record<OrderStatus, string | undefined>> = {
    PLACED: order.placed_at,
    ACCEPTED: order.accepted_at,
    REJECTED: order.rejected_at,
    PREPARING: order.preparing_at,
    READY: order.ready_at,
    PICKED_UP: order.picked_up_at,
    IN_TRANSIT: order.in_transit_at,
    DELIVERED: order.delivered_at,
    CANCELLED: order.cancelled_at,
  };

  // If cancelled or rejected, show a different timeline
  if (order.status === "CANCELLED" || order.status === "REJECTED") {
    const entries: TimelineEntry[] = [];
    for (const status of STATUS_ORDER) {
      const ts = timestampMap[status];
      if (ts) {
        entries.push({
          status,
          timestamp: ts,
          isActive: true,
          isCurrent: false,
        });
      }
    }
    // Add the cancelled/rejected step
    const finalStatus = order.status;
    const finalTs = timestampMap[finalStatus];
    if (finalTs) {
      entries.push({
        status: finalStatus,
        timestamp: finalTs,
        isActive: true,
        isCurrent: true,
      });
    }
    return entries;
  }

  // Normal flow
  const currentIdx = STATUS_ORDER.indexOf(order.status);
  return STATUS_ORDER.map((status, idx) => {
    const ts = timestampMap[status];
    return {
      status,
      timestamp: ts || "",
      isActive: idx <= currentIdx && !!ts,
      isCurrent: status === order.status,
    };
  });
}

export function OrderTimeline({ order, className }: OrderTimelineProps) {
  const { t } = useTranslation("orders");
  const entries = buildTimeline(order);

  return (
    <div className={cn("space-y-0", className)}>
      {entries.map((entry, idx) => {
        const Icon = statusIcons[entry.status] || CircleDot;
        const isLast = idx === entries.length - 1;
        const isCancelled =
          entry.status === "CANCELLED" || entry.status === "REJECTED";

        return (
          <div key={entry.status} className="flex gap-3">
            {/* Timeline line + icon */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  entry.isCurrent &&
                    !isCancelled &&
                    "border-primary bg-primary text-white",
                  entry.isActive &&
                    !entry.isCurrent &&
                    "border-green-500 bg-green-50 text-green-600",
                  !entry.isActive && "border-gray-200 bg-gray-50 text-gray-400",
                  isCancelled &&
                    entry.isCurrent &&
                    "border-red-500 bg-red-50 text-red-600",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-6",
                    entry.isActive ? "bg-green-500" : "bg-gray-200",
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-6">
              <p
                className={cn(
                  "text-sm font-medium leading-8",
                  entry.isActive ? "text-foreground" : "text-muted-foreground",
                  isCancelled && entry.isCurrent && "text-red-600",
                )}
              >
                {t(`timeline.${entry.status}`)}
              </p>
              {entry.timestamp && (
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(entry.timestamp)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
