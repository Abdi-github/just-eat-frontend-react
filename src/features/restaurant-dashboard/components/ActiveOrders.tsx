import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCHF } from "@/shared/utils/formatters";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type {
  RestaurantOrder,
  RestaurantOrderStatus,
} from "../restaurant-dashboard.types";
import { Truck, ShoppingBag } from "lucide-react";

dayjs.extend(relativeTime);

interface ActiveOrdersProps {
  orders: RestaurantOrder[] | undefined;
  isLoading: boolean;
  onStatusUpdate: (
    orderId: string,
    status: RestaurantOrderStatus,
    rejectionReason?: string,
  ) => void;
  isUpdating: boolean;
}

const statusColors: Record<string, string> = {
  PLACED: "bg-info/10 text-info",
  ACCEPTED: "bg-primary/10 text-primary",
  PREPARING: "bg-warning/10 text-warning",
  READY: "bg-success/10 text-success",
  PICKED_UP: "bg-info/10 text-info",
  IN_TRANSIT: "bg-primary/10 text-primary",
};

function getNextActions(status: RestaurantOrderStatus): Array<{
  nextStatus: RestaurantOrderStatus;
  labelKey: string;
  variant: "default" | "destructive" | "outline";
}> {
  switch (status) {
    case "PLACED":
      return [
        {
          nextStatus: "ACCEPTED",
          labelKey: "orders.accept",
          variant: "default",
        },
        {
          nextStatus: "REJECTED",
          labelKey: "orders.reject",
          variant: "destructive",
        },
      ];
    case "ACCEPTED":
      return [
        {
          nextStatus: "PREPARING",
          labelKey: "orders.startPreparing",
          variant: "default",
        },
      ];
    case "PREPARING":
      return [
        {
          nextStatus: "READY",
          labelKey: "orders.markReady",
          variant: "default",
        },
      ];
    case "READY":
      return [
        {
          nextStatus: "DELIVERED",
          labelKey: "orders.markDelivered",
          variant: "default",
        },
      ];
    default:
      return [];
  }
}

export function ActiveOrders({
  orders,
  isLoading,
  onStatusUpdate,
  isUpdating,
}: ActiveOrdersProps) {
  const { t } = useTranslation("restaurant-dashboard");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.activeOrders")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.activeOrders")}</CardTitle>
      </CardHeader>
      <CardContent>
        {!orders || orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("dashboard.noActiveOrders")}
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const actions = getNextActions(order.status);
              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      {order.order_type === "delivery" ? (
                        <Truck size={18} className="text-primary" />
                      ) : (
                        <ShoppingBag size={18} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {t("orders.orderNumber", {
                          number: order.order_number,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} {t("orders.items")} ·{" "}
                        {formatCHF(order.total)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {dayjs(order.placed_at).fromNow()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={statusColors[order.status] ?? ""}
                    >
                      {t(`orderStatus.${order.status}`)}
                    </Badge>
                    {actions.map((action) => (
                      <Button
                        key={action.nextStatus}
                        size="sm"
                        variant={action.variant}
                        disabled={isUpdating}
                        onClick={() =>
                          onStatusUpdate(order.id, action.nextStatus)
                        }
                      >
                        {t(action.labelKey)}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
