import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { MapPin, Bike, Clock, CheckCircle2 } from "lucide-react";
import { formatDateTime } from "@/shared/utils/formatters";
import { useTrackDeliveryQuery } from "../orders.api";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { OrderStatus } from "../orders.types";

interface DeliveryTrackerProps {
  orderId: string;
  orderStatus: OrderStatus;
}

export function DeliveryTracker({
  orderId,
  orderStatus,
}: DeliveryTrackerProps) {
  const { t } = useTranslation("orders");
  const { data, isLoading, isError } = useTrackDeliveryQuery(orderId, {
    pollingInterval: orderStatus === "IN_TRANSIT" ? 10000 : 30000,
    skip:
      orderStatus === "DELIVERED" ||
      orderStatus === "CANCELLED" ||
      orderStatus === "REJECTED",
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-4 w-60" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data?.data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            {t("tracking.noTrackingAvailable")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const tracking = data.data;
  const isDelivered = orderStatus === "DELIVERED";

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Bike className="h-5 w-5 text-primary" />
            {t("tracking.liveTracking")}
          </h3>
          <OrderStatusBadge status={orderStatus} />
        </div>

        {/* Map placeholder — real Leaflet integration will come in Phase 4 */}
        <div className="relative h-48 rounded-lg bg-muted flex items-center justify-center border">
          {tracking.courier_location ? (
            <div className="text-center space-y-2">
              <MapPin className="h-8 w-8 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                {t("tracking.courierLocation")}
              </p>
              <p className="text-xs text-muted-foreground">
                {tracking.courier_location.lat.toFixed(4)},{" "}
                {tracking.courier_location.lng.toFixed(4)}
              </p>
              {tracking.courier_location.updated_at && (
                <p className="text-xs text-muted-foreground">
                  {t("tracking.lastUpdated", {
                    time: formatDateTime(tracking.courier_location.updated_at),
                  })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("tracking.noTrackingAvailable")}
            </p>
          )}
        </div>

        {/* Delivery info */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Pickup */}
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {t("tracking.pickupAddress")}
              </p>
              <p className="text-sm">
                {tracking.pickup_address || tracking.restaurant_name}
              </p>
            </div>
          </div>

          {/* Delivery */}
          {tracking.delivery_address && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t("tracking.deliveryAddress")}
                </p>
                <p className="text-sm">
                  {tracking.delivery_address.street}{" "}
                  {tracking.delivery_address.street_number},{" "}
                  {tracking.delivery_address.postal_code}{" "}
                  {tracking.delivery_address.city}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Estimated delivery / delivered */}
        {isDelivered && tracking.delivered_at ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              {t("tracking.orderDelivered")}
            </span>
            <span className="text-xs">
              {t("tracking.deliveredAt", {
                time: formatDateTime(tracking.delivered_at),
              })}
            </span>
          </div>
        ) : tracking.estimated_delivery_at ? (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">
              {t("tracking.estimatedDelivery")}
            </span>
            <span className="text-xs">
              {formatDateTime(tracking.estimated_delivery_at)}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
