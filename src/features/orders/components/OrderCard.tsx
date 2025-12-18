import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Clock, Eye, Navigation, Store } from "lucide-react";
import { formatCHF, formatDateTime } from "@/shared/utils/formatters";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { OrderListItem } from "../orders.types";

interface OrderCardProps {
  order: OrderListItem;
}

const activeStatuses = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "PICKED_UP",
  "IN_TRANSIT",
];

export function OrderCard({ order }: OrderCardProps) {
  const { t } = useTranslation("orders");
  const isActive = activeStatuses.includes(order.status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Restaurant logo */}
          <div className="flex items-center justify-center bg-muted p-4 sm:w-24 sm:min-h-full">
            {order.restaurant?.logo_url ? (
              <img
                src={order.restaurant.logo_url}
                alt={order.restaurant_name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>

          {/* Order info */}
          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">
                  {order.restaurant_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("orderNumber", { number: order.order_number })}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDateTime(order.placed_at || order.created_at)}
              </span>
              <span>{t("items", { count: itemCount })}</span>
              <span className="font-medium text-foreground">
                {formatCHF(order.total)}
              </span>
            </div>

            {/* Items preview */}
            <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
              {order.items
                .map((item) => `${item.quantity}x ${item.name}`)
                .join(", ")}
            </p>

            <Separator className="my-3" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/account/orders/${order.id}`}>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  {t("viewDetails")}
                </Link>
              </Button>

              {isActive && order.order_type === "delivery" && (
                <Button variant="default" size="sm" asChild>
                  <Link to={`/account/orders/${order.id}/tracking`}>
                    <Navigation className="mr-1 h-3.5 w-3.5" />
                    {t("trackOrder")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
