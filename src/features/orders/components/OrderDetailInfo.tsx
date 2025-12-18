import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Store, MapPin, CreditCard, User } from "lucide-react";
import { formatCHF } from "@/shared/utils/formatters";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { OrderDetail as OrderDetailType } from "../orders.types";

interface OrderDetailInfoProps {
  order: OrderDetailType;
}

export function OrderDetailInfo({ order }: OrderDetailInfoProps) {
  const { t } = useTranslation("orders");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {t("detail.orderNumber", { number: order.order_number })}
          </CardTitle>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Restaurant info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            {order.restaurant?.logo_url ? (
              <img
                src={order.restaurant.logo_url}
                alt={order.restaurant_name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <Store className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{t("detail.restaurant")}</p>
            <p className="text-sm text-muted-foreground">
              {order.restaurant_name}
            </p>
          </div>
        </div>

        <Separator />

        {/* Order type */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("detail.orderType")}
            </p>
            <p className="text-sm">
              {order.order_type === "delivery"
                ? t("detail.delivery")
                : t("detail.pickup")}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("detail.total")}
            </p>
            <p className="text-sm font-semibold">{formatCHF(order.total)}</p>
          </div>
        </div>

        {/* Delivery address */}
        {order.delivery_address && order.order_type === "delivery" && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {t("detail.deliveryAddress")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.delivery_address.street}{" "}
                  {order.delivery_address.street_number}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.delivery_address.postal_code}{" "}
                  {order.delivery_address.label}
                </p>
                {order.delivery_address.floor && (
                  <p className="text-xs text-muted-foreground">
                    {t("detail.floor", { floor: order.delivery_address.floor })}
                  </p>
                )}
                {order.delivery_address.instructions && (
                  <p className="text-xs italic text-muted-foreground mt-1">
                    {order.delivery_address.instructions}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Courier */}
        {order.courier && (
          <>
            <Separator />
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("detail.courier")}</p>
                <p className="text-sm text-muted-foreground">
                  {order.courier.first_name} {order.courier.last_name}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Payment */}
        <Separator />
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {t("detail.paymentMethod")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(`paymentMethods.${order.payment_method}`)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {t("detail.paymentStatus")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(`paymentStatus.${order.payment_status}`)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation reason */}
        {order.cancellation_reason && (
          <>
            <Separator />
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">
                {t("cancel.reason")}
              </p>
              <p className="text-sm text-red-700 mt-1">
                {order.cancellation_reason}
              </p>
            </div>
          </>
        )}

        {/* Rejection reason */}
        {order.rejection_reason && (
          <>
            <Separator />
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">
                {t("timeline.REJECTED")}
              </p>
              <p className="text-sm text-red-700 mt-1">
                {order.rejection_reason}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
