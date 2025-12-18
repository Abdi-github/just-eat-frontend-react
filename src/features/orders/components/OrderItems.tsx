import { useTranslation } from "react-i18next";
import { Separator } from "@/shared/components/ui/separator";
import { formatCHF } from "@/shared/utils/formatters";
import type { OrderDetail } from "../orders.types";

interface OrderItemsProps {
  order: OrderDetail;
}

export function OrderItems({ order }: OrderItemsProps) {
  const { t } = useTranslation("orders");

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{t("detail.items")}</h3>

      <div className="space-y-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-12 w-12 rounded-md object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium">
                  {item.quantity}x {item.name}
                </p>
                {item.options && item.options.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {item.options.map((opt) => opt.name).join(", ")}
                  </p>
                )}
                {item.special_instructions && (
                  <p className="text-xs italic text-muted-foreground">
                    {item.special_instructions}
                  </p>
                )}
              </div>
            </div>
            <span className="text-sm font-medium whitespace-nowrap">
              {formatCHF(item.total_price ?? item.unit_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {order.special_instructions && (
        <>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t("detail.specialInstructions")}
            </p>
            <p className="text-sm mt-1">{order.special_instructions}</p>
          </div>
        </>
      )}

      <Separator />

      {/* Price summary */}
      <div className="space-y-2">
        <h3 className="font-semibold">{t("detail.summary")}</h3>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("detail.subtotal")}</span>
          <span>{formatCHF(order.subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {t("detail.deliveryFee")}
          </span>
          <span>
            {order.delivery_fee === 0
              ? t("detail.free")
              : formatCHF(order.delivery_fee)}
          </span>
        </div>

        {order.service_fee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t("detail.serviceFee")}
            </span>
            <span>{formatCHF(order.service_fee)}</span>
          </div>
        )}

        {order.tip > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("detail.tip")}</span>
            <span>{formatCHF(order.tip)}</span>
          </div>
        )}

        {order.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>{t("detail.discount")}</span>
            <span>-{formatCHF(order.discount)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between font-semibold text-base">
          <span>{t("detail.total")}</span>
          <span>{formatCHF(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
