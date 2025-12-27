import { useTranslation } from "react-i18next";
import { MapPin, Clock, DollarSign, Navigation, Store } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { formatCHF, formatDateTime } from "@/shared/utils/formatters";
import type { Delivery } from "../courier-dashboard.types";

interface AvailableDeliveryCardProps {
  delivery: Delivery;
  onAccept: (id: string) => void;
  isAccepting: boolean;
}

export function AvailableDeliveryCard({
  delivery,
  onAccept,
  isAccepting,
}: AvailableDeliveryCardProps) {
  const { t } = useTranslation("courier-dashboard");

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            {delivery.order_number && (
              <p className="text-sm font-medium text-muted-foreground">
                {t("available.orderNumber", { number: delivery.order_number })}
              </p>
            )}
            {delivery.restaurant_name && (
              <div className="mt-1 flex items-center gap-1.5">
                <Store size={14} className="text-primary" />
                <span className="font-semibold">
                  {delivery.restaurant_name}
                </span>
              </div>
            )}
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {t("statuses.PENDING")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Pickup */}
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <MapPin size={12} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {t("available.pickup")}
            </p>
            <p className="text-sm">
              {delivery.pickup_address || delivery.restaurant_address}
            </p>
          </div>
        </div>

        {/* Delivery */}
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
            <Navigation size={12} className="text-success" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {t("available.delivery")}
            </p>
            <p className="text-sm">
              {delivery.delivery_address.street}{" "}
              {delivery.delivery_address.street_number},{" "}
              {delivery.delivery_address.postal_code}{" "}
              {delivery.delivery_address.city}
            </p>
          </div>
        </div>

        {/* Fee + Distance */}
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-sm">
            <DollarSign size={14} className="text-muted-foreground" />
            <span className="font-medium">
              {formatCHF(delivery.delivery_fee)}
            </span>
          </div>
          {delivery.distance_km && (
            <div className="flex items-center gap-1.5 text-sm">
              <Navigation size={14} className="text-muted-foreground" />
              <span>
                {delivery.distance_km.toFixed(1)} {t("available.km")}
              </span>
            </div>
          )}
          {delivery.estimated_delivery_at && (
            <div className="flex items-center gap-1.5 text-sm">
              <Clock size={14} className="text-muted-foreground" />
              <span>{formatDateTime(delivery.estimated_delivery_at)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onAccept(delivery.id)}
          disabled={isAccepting}
        >
          {isAccepting ? t("available.accepting") : t("available.accept")}
        </Button>
      </CardFooter>
    </Card>
  );
}
