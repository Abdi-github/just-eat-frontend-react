import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tag, X, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useValidateCheckoutCouponMutation } from "../checkout.api";
import type { CouponValidation } from "../checkout.types";

interface CouponInputProps {
  restaurantId: string;
  subtotal: number;
  appliedCoupon: CouponValidation | null;
  onApply: (coupon: CouponValidation) => void;
  onRemove: () => void;
}

export function CouponInput({
  restaurantId,
  subtotal,
  appliedCoupon,
  onApply,
  onRemove,
}: CouponInputProps) {
  const { t } = useTranslation("checkout");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validateCoupon, { isLoading }] = useValidateCheckoutCouponMutation();

  const handleApply = async () => {
    if (!code.trim()) return;
    setError(null);

    try {
      const result = await validateCoupon({
        code: code.trim(),
        restaurant_id: restaurantId,
        subtotal,
      }).unwrap();

      if (result.data.valid) {
        onApply(result.data);
        setCode("");
      } else {
        setError(result.data.message || t("coupon.invalid"));
      }
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: { message?: string } } };
      setError(apiErr?.data?.error?.message || t("coupon.error"));
    }
  };

  if (appliedCoupon) {
    return (
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Tag className="h-5 w-5 text-primary" />
          {t("coupon.title")}
        </h3>
        <div className="flex items-center justify-between rounded-lg border border-success/30 bg-success/5 p-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" />
            <span className="font-medium text-success">
              {appliedCoupon.coupon?.code}
            </span>
            <span className="text-sm text-muted-foreground">
              {t("coupon.applied")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-error"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <Tag className="h-5 w-5 text-primary" />
        {t("coupon.title")}
      </h3>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder={t("coupon.placeholder")}
          disabled={isLoading}
          className="flex-1 uppercase"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
        />
        <Button
          type="button"
          onClick={handleApply}
          disabled={!code.trim() || isLoading}
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t("coupon.apply")
          )}
        </Button>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-sm text-error">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
