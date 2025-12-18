import { useTranslation } from "react-i18next";
import { Receipt, Truck, Percent, Heart, Tag } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import { formatCHF } from "@/shared/utils/formatters";
import { useAppSelector } from "@/app/hooks";
import { useCart } from "@/shared/hooks/useCart";

interface OrderSummaryProps {
  tip: number;
  discount: number;
  couponCode?: string;
}

const SERVICE_FEE = 1.5;

export function OrderSummary({ tip, discount, couponCode }: OrderSummaryProps) {
  const { t } = useTranslation("checkout");
  const cart = useAppSelector((state) => state.cart);
  const { subtotal } = useCart();

  const deliveryFee = cart.order_type === "delivery" ? cart.delivery_fee : 0;
  const total = subtotal + deliveryFee + SERVICE_FEE + tip - discount;

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <Receipt className="h-5 w-5 text-primary" />
        {t("summary.title")}
      </h3>

      {/* Items */}
      <div className="space-y-2">
        {cart.items.map((item) => (
          <div
            key={item.menu_item_id}
            className="flex items-start justify-between text-sm"
          >
            <div className="flex gap-2">
              <span className="font-medium text-muted-foreground">
                {item.quantity}×
              </span>
              <span>{item.name}</span>
            </div>
            <span className="shrink-0 font-medium">
              {formatCHF(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      {/* Fee breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("summary.subtotal")}</span>
          <span className="font-medium">{formatCHF(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            {t("summary.deliveryFee")}
          </span>
          <span className="font-medium">
            {cart.order_type === "delivery"
              ? deliveryFee > 0
                ? formatCHF(deliveryFee)
                : t("summary.free")
              : t("summary.pickup")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Percent className="h-3.5 w-3.5" />
            {t("summary.serviceFee")}
          </span>
          <span className="font-medium">{formatCHF(SERVICE_FEE)}</span>
        </div>

        {tip > 0 && (
          <div className="flex justify-between">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Heart className="h-3.5 w-3.5" />
              {t("summary.tip")}
            </span>
            <span className="font-medium">{formatCHF(tip)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              {t("summary.discount")}
              {couponCode && <span className="text-xs">({couponCode})</span>}
            </span>
            <span className="font-medium">-{formatCHF(discount)}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span>{t("summary.total")}</span>
        <span className="text-primary">{formatCHF(Math.max(0, total))}</span>
      </div>
    </div>
  );
}
