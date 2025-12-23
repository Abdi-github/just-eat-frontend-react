import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Gift, Ticket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  useGetMyStampProgressQuery,
  useRedeemStampCardMutation,
  useValidateCouponMutation,
} from "../promotions.api";
import { StampCardProgress } from "../components/StampCardProgress";
import { CouponBadge } from "../components/CouponBadge";
import type { CouponValidationResult } from "../promotions.types";

export function PromotionsPage() {
  const { t } = useTranslation("promotions");

  // Stamp cards
  const { data: stampData, isLoading: stampsLoading } =
    useGetMyStampProgressQuery();
  const [redeemStamp, { isLoading: isRedeeming }] =
    useRedeemStampCardMutation();

  // Coupon validation
  const [validateCoupon, { isLoading: isValidating }] =
    useValidateCouponMutation();
  const [couponCode, setCouponCode] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [validationResult, setValidationResult] =
    useState<CouponValidationResult | null>(null);

  const stampProgress = stampData?.data ?? [];

  const handleRedeem = async (id: string) => {
    try {
      await redeemStamp(id).unwrap();
      toast.success(t("success.redeemed"));
    } catch {
      toast.error(t("errors.redeemFailed"));
    }
  };

  const handleValidateCoupon = async () => {
    if (!couponCode.trim() || !restaurantId.trim() || !subtotal.trim()) return;

    try {
      const result = await validateCoupon({
        code: couponCode.trim().toUpperCase(),
        restaurant_id: restaurantId.trim(),
        subtotal: parseFloat(subtotal),
      }).unwrap();
      setValidationResult(result.data);
    } catch {
      toast.error(t("errors.validateFailed"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="stamps">
        <TabsList>
          <TabsTrigger value="stamps" className="gap-2">
            <Gift size={14} />
            {t("tabs.stamps")}
          </TabsTrigger>
          <TabsTrigger value="coupons" className="gap-2">
            <Ticket size={14} />
            {t("tabs.coupons")}
          </TabsTrigger>
        </TabsList>

        {/* Stamp Cards Tab */}
        <TabsContent value="stamps" className="mt-6">
          {stampsLoading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          )}

          {!stampsLoading && stampProgress.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Gift size={24} className="text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-base font-medium">
                {t("stamps.empty")}
              </h3>
              <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
                {t("stamps.emptyDesc")}
              </p>
            </div>
          )}

          {!stampsLoading && stampProgress.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {stampProgress.map((progress) => (
                <StampCardProgress
                  key={progress.id}
                  progress={progress}
                  onRedeem={handleRedeem}
                  isRedeeming={isRedeeming}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("coupons.title")}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("coupons.subtitle")}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label className="text-xs">{t("coupons.code")}</Label>
                  <Input
                    placeholder={t("coupons.codePlaceholder")}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="mt-1 uppercase"
                  />
                </div>
                <div>
                  <Label className="text-xs">{t("coupons.restaurant")}</Label>
                  <Input
                    placeholder="Restaurant ID"
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">{t("coupons.subtotal")}</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="25.00"
                    value={subtotal}
                    onChange={(e) => setSubtotal(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                onClick={handleValidateCoupon}
                disabled={
                  isValidating ||
                  !couponCode.trim() ||
                  !restaurantId.trim() ||
                  !subtotal.trim()
                }
              >
                {isValidating && (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                )}
                {isValidating ? t("coupons.validating") : t("coupons.validate")}
              </Button>

              {/* Validation result */}
              {validationResult && <CouponBadge result={validationResult} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
