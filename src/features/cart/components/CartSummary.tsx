import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import { formatCHF } from "@/shared/utils/formatters";
import { useCart } from "@/shared/hooks/useCart";

interface CartSummaryProps {
  compact?: boolean;
}

export function CartSummary({ compact = false }: CartSummaryProps) {
  const { t } = useTranslation("cart");
  const {
    subtotal,
    total,
    delivery_fee,
    minimum_order,
    order_type,
    itemCount,
    meetsMinimumOrder,
  } = useCart();

  const belowMinimumAmount = minimum_order - subtotal;
  const isDelivery = order_type === "delivery";

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {/* Item count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {t("summary.itemCount", { count: itemCount })}
        </span>
      </div>

      <Separator />

      {/* Subtotal */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("summary.subtotal")}</span>
        <span className="font-medium text-foreground">
          {formatCHF(subtotal)}
        </span>
      </div>

      {/* Delivery fee */}
      {isDelivery && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t("summary.deliveryFee")}
          </span>
          <span className="font-medium text-foreground">
            {delivery_fee > 0
              ? formatCHF(delivery_fee)
              : t("summary.freeDelivery")}
          </span>
        </div>
      )}

      <Separator />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span
          className={compact ? "text-sm font-semibold" : "text-base font-bold"}
        >
          {t("summary.total")}
        </span>
        <span
          className={`font-bold text-foreground ${compact ? "text-sm" : "text-lg"}`}
        >
          {formatCHF(total)}
        </span>
      </div>

      {/* Minimum order warning */}
      {!meetsMinimumOrder && minimum_order > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div className="text-xs">
            <p className="font-medium text-warning">
              {t("summary.minimumOrder", { amount: formatCHF(minimum_order) })}
            </p>
            <p className="mt-0.5 text-muted-foreground">
              {t("summary.belowMinimum", {
                amount: formatCHF(belowMinimumAmount),
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
