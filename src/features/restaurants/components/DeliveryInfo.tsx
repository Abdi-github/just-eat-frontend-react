import { useTranslation } from "react-i18next";
import { Truck, Clock, ShoppingBag, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { formatCHF } from "@/shared/utils/formatters";
import type { Restaurant } from "../restaurants.types";

interface DeliveryInfoProps {
  restaurant: Restaurant;
}

export function DeliveryInfo({ restaurant }: DeliveryInfoProps) {
  const { t } = useTranslation("restaurants");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t("detail.deliveryInfo")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {/* Delivery fee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Truck className="h-4 w-4" />
            {t("detail.deliveryFee")}
          </div>
          <span className="font-medium">
            {!restaurant.delivery_fee || restaurant.delivery_fee === 0
              ? t("detail.freeDelivery")
              : formatCHF(restaurant.delivery_fee)}
          </span>
        </div>

        <Separator />

        {/* Minimum order */}
        {restaurant.minimum_order && restaurant.minimum_order > 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                {t("detail.minimumOrder")}
              </div>
              <span className="font-medium">
                {formatCHF(restaurant.minimum_order)}
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Estimated delivery time */}
        {restaurant.estimated_delivery_minutes && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {t("detail.estimatedTime")}
              </div>
              <span className="font-medium">
                {restaurant.estimated_delivery_minutes.min}–
                {restaurant.estimated_delivery_minutes.max} min
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Address */}
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium text-foreground">{t("detail.address")}</p>
            <p className="mt-0.5">
              {restaurant.address}
              {restaurant.city?.name && (
                <>
                  <br />
                  {restaurant.postal_code} {restaurant.city.name}
                </>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
