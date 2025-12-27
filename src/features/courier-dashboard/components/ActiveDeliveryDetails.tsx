import { useTranslation } from "react-i18next";
import {
  MapPin,
  Navigation,
  Store,
  DollarSign,
  Map,
  FileText,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { formatCHF } from "@/shared/utils/formatters";
import type { Delivery, DeliveryStatus } from "../courier-dashboard.types";

interface ActiveDeliveryDetailsProps {
  delivery: Delivery;
  onUpdateStatus: (
    status: "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "FAILED",
  ) => void;
  onSendLocation: () => void;
  isUpdating: boolean;
  isSendingLocation: boolean;
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

function getNextStatuses(
  current: DeliveryStatus,
): Array<"PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "FAILED"> {
  switch (current) {
    case "ASSIGNED":
      return ["PICKED_UP"];
    case "PICKED_UP":
      return ["IN_TRANSIT", "FAILED"];
    case "IN_TRANSIT":
      return ["DELIVERED", "FAILED"];
    default:
      return [];
  }
}

const statusButtonMap: Record<
  string,
  { key: string; variant: "default" | "destructive" | "outline" }
> = {
  PICKED_UP: { key: "active.markPickedUp", variant: "default" },
  IN_TRANSIT: { key: "active.markInTransit", variant: "default" },
  DELIVERED: { key: "active.markDelivered", variant: "default" },
  FAILED: { key: "active.markFailed", variant: "destructive" },
};

export function ActiveDeliveryDetails({
  delivery,
  onUpdateStatus,
  onSendLocation,
  isUpdating,
  isSendingLocation,
}: ActiveDeliveryDetailsProps) {
  const { t } = useTranslation("courier-dashboard");
  const nextStatuses = getNextStatuses(delivery.status);

  return (
    <div className="space-y-6">
      {/* Status + Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {t("active.currentStatus")}
            </CardTitle>
            <Badge className={statusColorMap[delivery.status]}>
              {t(`statuses.${delivery.status}`)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <DeliveryTimeline status={delivery.status} t={t} />
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t("active.deliveryDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Restaurant */}
          {delivery.restaurant_name && (
            <div className="flex items-start gap-3">
              <Store size={16} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t("available.restaurant")}
                </p>
                <p className="text-sm font-medium">
                  {delivery.restaurant_name}
                </p>
              </div>
            </div>
          )}

          {/* Pickup address */}
          <div className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {t("active.pickupAddress")}
              </p>
              <p className="text-sm">{delivery.pickup_address}</p>
            </div>
          </div>

          <Separator />

          {/* Delivery address */}
          <div className="flex items-start gap-3">
            <Navigation size={16} className="mt-0.5 shrink-0 text-success" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {t("active.deliveryAddress")}
              </p>
              <p className="text-sm">
                {delivery.delivery_address.street}{" "}
                {delivery.delivery_address.street_number},{" "}
                {delivery.delivery_address.postal_code}{" "}
                {delivery.delivery_address.city}
              </p>
              {delivery.delivery_address.floor && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("active.floor")}: {delivery.delivery_address.floor}
                </p>
              )}
              {delivery.delivery_address.instructions && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("active.instructions")}:{" "}
                  {delivery.delivery_address.instructions}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Fee + Distance */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("active.fee")}
                </p>
                <p className="text-sm font-medium">
                  {formatCHF(delivery.delivery_fee)}
                </p>
              </div>
            </div>
            {delivery.distance_km && (
              <div className="flex items-center gap-2">
                <Map size={14} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t("active.distance")}
                  </p>
                  <p className="text-sm font-medium">
                    {delivery.distance_km.toFixed(1)} {t("active.km")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {delivery.notes && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <FileText
                  size={16}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("active.notes")}
                  </p>
                  <p className="text-sm">{delivery.notes}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t("active.updateStatus")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Status buttons */}
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((status) => {
              const btn = statusButtonMap[status];
              return (
                <Button
                  key={status}
                  variant={btn.variant}
                  onClick={() => {
                    if (status === "FAILED") {
                      if (window.confirm(t("active.confirmFailed"))) {
                        onUpdateStatus(status);
                      }
                    } else {
                      onUpdateStatus(status);
                    }
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating && (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  )}
                  {t(btn.key)}
                </Button>
              );
            })}
          </div>

          {/* GPS Location */}
          {(delivery.status === "PICKED_UP" ||
            delivery.status === "IN_TRANSIT") && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onSendLocation}
              disabled={isSendingLocation}
            >
              {isSendingLocation && (
                <Loader2 size={14} className="mr-2 animate-spin" />
              )}
              <MapPin size={14} className="mr-2" />
              {t("active.sendLocation")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Timeline Sub-component ────────────────────────
interface TimelineProps {
  status: DeliveryStatus;
  t: (key: string) => string;
}

const timelineSteps: Array<{ status: DeliveryStatus; key: string }> = [
  { status: "ASSIGNED", key: "active.assigned" },
  { status: "PICKED_UP", key: "active.pickedUp" },
  { status: "IN_TRANSIT", key: "active.inTransit" },
  { status: "DELIVERED", key: "active.delivered" },
];

const statusOrder: Record<string, number> = {
  ASSIGNED: 0,
  PICKED_UP: 1,
  IN_TRANSIT: 2,
  DELIVERED: 3,
};

function DeliveryTimeline({ status, t }: TimelineProps) {
  const currentIdx = statusOrder[status] ?? -1;

  return (
    <div className="flex items-center gap-1">
      {timelineSteps.map((step, idx) => {
        const isCompleted = idx <= currentIdx;
        const isCurrent = idx === currentIdx;

        return (
          <div key={step.status} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {idx > 0 && (
                <div
                  className={`h-0.5 flex-1 ${
                    idx <= currentIdx ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  isCurrent
                    ? "bg-primary text-white"
                    : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </div>
              {idx < timelineSteps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    idx < currentIdx ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
            <p
              className={`mt-1 text-center text-xs ${
                isCurrent
                  ? "font-medium text-primary"
                  : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
              }`}
            >
              {t(step.key)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
