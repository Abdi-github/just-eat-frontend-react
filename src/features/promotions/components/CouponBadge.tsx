import { useTranslation } from "react-i18next";
import { Ticket, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { formatCHF, formatDate } from "@/shared/utils/formatters";
import type { CouponValidationResult } from "../promotions.types";

interface CouponBadgeProps {
  result: CouponValidationResult;
}

export function CouponBadge({ result }: CouponBadgeProps) {
  const { t } = useTranslation("promotions");

  if (!result.valid) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <XCircle size={20} className="mt-0.5 shrink-0 text-error" />
        <div>
          <p className="text-sm font-medium text-error">
            {t("coupons.invalid")}
          </p>
          <p className="mt-0.5 text-xs text-red-600">{result.message}</p>
        </div>
      </div>
    );
  }

  const coupon = result.coupon!;

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
      <div className="flex items-start gap-3">
        <CheckCircle size={20} className="mt-0.5 shrink-0 text-success" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-success">
              {t("coupons.valid")}
            </p>
            <Badge className="bg-primary/10 text-primary">
              <Ticket size={12} className="mr-1" />
              {coupon.code}
            </Badge>
          </div>

          {coupon.description && (
            <p className="text-xs text-muted-foreground">
              {coupon.description}
            </p>
          )}

          {/* Discount info */}
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="font-medium">
              {t("coupons.discount")}:{" "}
              {coupon.discount_type === "PERCENTAGE"
                ? t("coupons.percentage", { value: coupon.discount_value })
                : t("coupons.flat", {
                    amount: formatCHF(coupon.discount_value),
                  })}
            </span>

            {result.discount_amount !== undefined && (
              <span className="font-semibold text-success">
                {t("coupons.discountAmount", {
                  amount: formatCHF(result.discount_amount),
                })}
              </span>
            )}
          </div>

          {/* Constraints */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {coupon.minimum_order > 0 && (
              <span>
                {t("coupons.minimumOrder", {
                  amount: formatCHF(coupon.minimum_order),
                })}
              </span>
            )}
            {coupon.maximum_discount && (
              <span>
                {t("coupons.maxDiscount", {
                  amount: formatCHF(coupon.maximum_discount),
                })}
              </span>
            )}
            {coupon.valid_until && (
              <span>
                {t("coupons.validUntil", {
                  date: formatDate(coupon.valid_until),
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
