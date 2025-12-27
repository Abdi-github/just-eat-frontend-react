import { useTranslation } from "react-i18next";
import { MapPin, Navigation, Store, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { formatCHF, formatDateTime } from "@/shared/utils/formatters";
import type { Delivery, DeliveryStatus } from "../courier-dashboard.types";

interface DeliveryHistoryCardProps {
  delivery: Delivery;
}

const statusColorMap: Record<DeliveryStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  PICKED_UP: "bg-indigo-100 text-indigo-800",
  IN_TRANSIT: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  FAILED: "bg-red-100 text-red-800",
};

export function DeliveryHistoryCard({ delivery }: DeliveryHistoryCardProps) {
  const { t } = useTranslation("courier-dashboard");

  const completedDate =
    delivery.delivered_at || delivery.cancelled_at || delivery.updated_at;

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="flex items-center gap-2">
              {delivery.order_number && (
                <span className="text-sm font-medium text-muted-foreground">
                  {t("history.orderNumber", { number: delivery.order_number })}
                </span>
              )}
              <Badge className={statusColorMap[delivery.status]}>
                {t(`statuses.${delivery.status}`)}
              </Badge>
            </div>

            {/* Restaurant */}
            {delivery.restaurant_name && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <Store size={14} className="shrink-0 text-primary" />
                <span className="text-sm font-medium truncate">
                  {delivery.restaurant_name}
                </span>
              </div>
            )}

            {/* Addresses */}
            <div className="mt-2 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <MapPin size={12} className="mt-0.5 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground truncate">
                  {delivery.pickup_address}
                </p>
              </div>
              <div className="flex items-start gap-1.5">
                <Navigation
                  size={12}
                  className="mt-0.5 shrink-0 text-success"
                />
                <p className="text-xs text-muted-foreground truncate">
                  {delivery.delivery_address.street}{" "}
                  {delivery.delivery_address.street_number},{" "}
                  {delivery.delivery_address.postal_code}{" "}
                  {delivery.delivery_address.city}
                </p>
              </div>
            </div>
          </div>

          {/* Right side: fee + date */}
          <div className="ml-4 shrink-0 text-right">
            <div className="flex items-center justify-end gap-1">
              <DollarSign size={14} className="text-muted-foreground" />
              <span className="text-sm font-semibold">
                {formatCHF(delivery.delivery_fee)}
              </span>
            </div>
            {delivery.distance_km && (
              <p className="mt-1 text-xs text-muted-foreground">
                {delivery.distance_km.toFixed(1)} {t("history.km")}
              </p>
            )}
            {completedDate && (
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDateTime(completedDate)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
