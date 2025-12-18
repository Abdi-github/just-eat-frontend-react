import { useTranslation } from "react-i18next";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { OrderStatus } from "../orders.types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusStyles: Record<OrderStatus, string> = {
  PLACED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  ACCEPTED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
  PREPARING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  READY: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  PICKED_UP: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  IN_TRANSIT: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
  DELIVERED: "bg-green-100 text-green-800 hover:bg-green-100",
  CANCELLED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { t } = useTranslation("orders");

  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-xs font-medium capitalize",
        statusStyles[status] || "bg-gray-100 text-gray-800",
        className,
      )}
    >
      {t(`status.${status}`)}
    </Badge>
  );
}
