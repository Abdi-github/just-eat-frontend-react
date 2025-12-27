import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Ticket, Stamp } from "lucide-react";
import { useRestaurant } from "../hooks/useRestaurant";
import {
  useGetRestaurantCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetOwnerStampCardsQuery,
  useCreateStampCardMutation,
  useUpdateStampCardMutation,
  useDeleteStampCardMutation,
} from "../restaurant-dashboard.api";
import type { Coupon, StampCard } from "../restaurant-dashboard.types";

/* ─── Coupon Form ─── */
const couponSchema = z.object({
  code: z.string().min(3).max(30),
  description: z.string().max(300).optional().or(z.literal("")),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.coerce.number().min(0),
  minimum_order_amount: z.coerce.number().min(0).optional(),
  max_uses: z.coerce.number().min(0).optional(),
  max_uses_per_user: z.coerce.number().min(0).optional(),
  valid_from: z.string().optional().or(z.literal("")),
  valid_until: z.string().optional().or(z.literal("")),
  is_active: z.boolean(),
});
type CouponFormValues = z.infer<typeof couponSchema>;

function CouponForm({
  open,
  onClose,
  coupon,
  restaurantId,
}: {
  open: boolean;
  onClose: () => void;
  coupon?: Coupon;
  restaurantId: string;
}) {
  const { t } = useTranslation("restaurant-dashboard");
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const saving = creating || updating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon
      ? {
          code: coupon.code,
          description: coupon.description ?? "",
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          minimum_order_amount: coupon.minimum_order_amount,
          max_uses: coupon.max_uses,
          max_uses_per_user: coupon.max_uses_per_user,
          valid_from: coupon.valid_from
            ? dayjs(coupon.valid_from).format("YYYY-MM-DD")
            : "",
          valid_until: coupon.valid_until
            ? dayjs(coupon.valid_until).format("YYYY-MM-DD")
            : "",
          is_active: coupon.is_active,
        }
      : {
          code: "",
          discount_type: "percentage",
          discount_value: 0,
          is_active: true,
        },
  });

  const onSubmit = async (values: CouponFormValues) => {
    try {
      const body = {
        ...values,
        valid_from: values.valid_from || undefined,
        valid_until: values.valid_until || undefined,
        description: values.description || undefined,
      };
      if (coupon) {
        await updateCoupon({
          restaurantId,
          couponId: coupon.id,
          body,
        }).unwrap();
        toast.success(t("promotions.couponUpdated"));
      } else {
        await createCoupon({ restaurantId, body }).unwrap();
        toast.success(t("promotions.couponCreated"));
      }
      reset();
      onClose();
    } catch {
      toast.error(t("common.error"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {coupon ? t("promotions.editCoupon") : t("promotions.createCoupon")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t("promotions.couponCode")}</Label>
              <Input {...register("code")} />
              {errors.code && (
                <p className="mt-1 text-xs text-error">
                  {t("common.required")}
                </p>
              )}
            </div>
            <div>
              <Label>{t("promotions.discountType")}</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                {...register("discount_type")}
              >
                <option value="percentage">{t("promotions.percentage")}</option>
                <option value="fixed">{t("promotions.fixed")}</option>
              </select>
            </div>
            <div>
              <Label>{t("promotions.discountValue")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register("discount_value")}
              />
            </div>
            <div>
              <Label>{t("promotions.minimumOrder")}</Label>
              <Input
                type="number"
                step="0.5"
                min="0"
                {...register("minimum_order_amount")}
              />
            </div>
            <div>
              <Label>{t("promotions.maxUses")}</Label>
              <Input type="number" min="0" {...register("max_uses")} />
            </div>
            <div>
              <Label>{t("promotions.maxUsesPerUser")}</Label>
              <Input type="number" min="0" {...register("max_uses_per_user")} />
            </div>
            <div>
              <Label>{t("promotions.validFrom")}</Label>
              <Input type="date" {...register("valid_from")} />
            </div>
            <div>
              <Label>{t("promotions.validUntil")}</Label>
              <Input type="date" {...register("valid_until")} />
            </div>
          </div>

          <div>
            <Label>{t("promotions.descriptionLabel")}</Label>
            <Textarea rows={2} {...register("description")} />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={watch("is_active")}
              onCheckedChange={(val) => setValue("is_active", val)}
            />
            <Label>{t("promotions.active")}</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {coupon ? t("common.save") : t("common.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Stamp Card Form ─── */
const stampSchema = z.object({
  name: z.string().min(1).max(200),
  stamps_required: z.coerce.number().min(2).max(50),
  reward_description: z.string().min(1).max(500),
  reward_type: z.enum(["free_item", "discount_percentage", "discount_fixed"]),
  reward_value: z.coerce.number().min(0).optional(),
  is_active: z.boolean(),
});
type StampFormValues = z.infer<typeof stampSchema>;

function StampCardForm({
  open,
  onClose,
  stampCard,
  restaurantId,
}: {
  open: boolean;
  onClose: () => void;
  stampCard?: StampCard;
  restaurantId: string;
}) {
  const { t } = useTranslation("restaurant-dashboard");
  const [createStampCard, { isLoading: creating }] =
    useCreateStampCardMutation();
  const [updateStampCard, { isLoading: updating }] =
    useUpdateStampCardMutation();
  const saving = creating || updating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<StampFormValues>({
    resolver: zodResolver(stampSchema),
    defaultValues: stampCard
      ? {
          name: stampCard.name,
          stamps_required: stampCard.stamps_required,
          reward_description: stampCard.reward_description,
          reward_type: stampCard.reward_type,
          reward_value: stampCard.reward_value,
          is_active: stampCard.is_active,
        }
      : {
          name: "",
          stamps_required: 10,
          reward_description: "",
          reward_type: "free_item",
          is_active: true,
        },
  });

  const onSubmit = async (values: StampFormValues) => {
    try {
      if (stampCard) {
        await updateStampCard({
          restaurantId,
          stampCardId: stampCard.id,
          body: values,
        }).unwrap();
        toast.success(t("promotions.stampCardUpdated"));
      } else {
        await createStampCard({ restaurantId, body: values }).unwrap();
        toast.success(t("promotions.stampCardCreated"));
      }
      reset();
      onClose();
    } catch {
      toast.error(t("common.error"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {stampCard
              ? t("promotions.editStampCard")
              : t("promotions.createStampCard")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>{t("promotions.stampCardName")}</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="mt-1 text-xs text-error">{t("common.required")}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t("promotions.stampsRequired")}</Label>
              <Input
                type="number"
                min="2"
                max="50"
                {...register("stamps_required")}
              />
            </div>
            <div>
              <Label>{t("promotions.rewardType")}</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                {...register("reward_type")}
              >
                <option value="free_item">{t("promotions.freeItem")}</option>
                <option value="discount_percentage">
                  {t("promotions.discountPercentage")}
                </option>
                <option value="discount_fixed">
                  {t("promotions.discountFixed")}
                </option>
              </select>
            </div>
          </div>
          <div>
            <Label>{t("promotions.rewardValue")}</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register("reward_value")}
            />
          </div>
          <div>
            <Label>{t("promotions.rewardDescription")}</Label>
            <Textarea rows={2} {...register("reward_description")} />
            {errors.reward_description && (
              <p className="mt-1 text-xs text-error">{t("common.required")}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={watch("is_active")}
              onCheckedChange={(val) => setValue("is_active", val)}
            />
            <Label>{t("promotions.active")}</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {stampCard ? t("common.save") : t("common.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Promotions Page ─── */
export function RestaurantPromotionsPage() {
  const { t } = useTranslation("restaurant-dashboard");
  const { restaurantId } = useRestaurant();

  // Coupons
  const { data: couponsData, isLoading: couponsLoading } =
    useGetRestaurantCouponsQuery(
      { restaurantId: restaurantId! },
      { skip: !restaurantId },
    );
  const [deleteCoupon] = useDeleteCouponMutation();
  const [couponFormOpen, setCouponFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon>();
  const [deletingCouponId, setDeletingCouponId] = useState<string>();

  // Stamp Cards
  const { data: stampCardsData, isLoading: stampCardsLoading } =
    useGetOwnerStampCardsQuery(
      { restaurantId: restaurantId! },
      { skip: !restaurantId },
    );
  const [deleteStampCard] = useDeleteStampCardMutation();
  const [stampFormOpen, setStampFormOpen] = useState(false);
  const [editingStamp, setEditingStamp] = useState<StampCard>();
  const [deletingStampId, setDeletingStampId] = useState<string>();

  const coupons = couponsData?.data ?? [];
  const stampCards = stampCardsData?.data ?? [];

  if (!restaurantId) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("promotions.title")}</h1>

      <Tabs defaultValue="coupons">
        <TabsList>
          <TabsTrigger value="coupons" className="gap-1">
            <Ticket size={14} /> {t("promotions.coupons")}
          </TabsTrigger>
          <TabsTrigger value="stampCards" className="gap-1">
            <Stamp size={14} /> {t("promotions.stampCards")}
          </TabsTrigger>
        </TabsList>

        {/* ─── Coupons Tab ─── */}
        <TabsContent value="coupons" className="mt-4">
          <div className="mb-4 flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setEditingCoupon(undefined);
                setCouponFormOpen(true);
              }}
            >
              <Plus size={14} className="mr-1" /> {t("promotions.addCoupon")}
            </Button>
          </div>

          {couponsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t("promotions.noCoupons")}
            </p>
          ) : (
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <Card key={coupon.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">
                          {coupon.code}
                        </span>
                        <Badge
                          variant={coupon.is_active ? "default" : "secondary"}
                        >
                          {coupon.is_active
                            ? t("promotions.active")
                            : t("promotions.inactive")}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `CHF ${coupon.discount_value.toFixed(2)}`}{" "}
                        {t("promotions.off")}
                        {coupon.minimum_order_amount
                          ? ` · min CHF ${coupon.minimum_order_amount.toFixed(2)}`
                          : ""}
                      </p>
                      {coupon.valid_until && (
                        <p className="text-xs text-muted-foreground">
                          {t("promotions.expires")}:{" "}
                          {dayjs(coupon.valid_until).format("DD.MM.YYYY")}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {t("promotions.used")}: {coupon.current_uses ?? 0}
                        {coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setCouponFormOpen(true);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-error"
                        onClick={() => setDeletingCouponId(coupon.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── Stamp Cards Tab ─── */}
        <TabsContent value="stampCards" className="mt-4">
          <div className="mb-4 flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setEditingStamp(undefined);
                setStampFormOpen(true);
              }}
            >
              <Plus size={14} className="mr-1" /> {t("promotions.addStampCard")}
            </Button>
          </div>

          {stampCardsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : stampCards.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t("promotions.noStampCards")}
            </p>
          ) : (
            <div className="space-y-3">
              {stampCards.map((card) => (
                <Card key={card.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{card.name}</span>
                        <Badge
                          variant={card.is_active ? "default" : "secondary"}
                        >
                          {card.is_active
                            ? t("promotions.active")
                            : t("promotions.inactive")}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {card.stamps_required} {t("promotions.stamps")} →{" "}
                        {card.reward_description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("promotions.rewardType")}:{" "}
                        {t(
                          `promotions.${card.reward_type === "free_item" ? "freeItem" : card.reward_type === "discount_percentage" ? "discountPercentage" : "discountFixed"}`,
                        )}
                        {card.reward_value ? ` (${card.reward_value})` : ""}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingStamp(card);
                          setStampFormOpen(true);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-error"
                        onClick={() => setDeletingStampId(card.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Coupon Form Dialog */}
      <CouponForm
        open={couponFormOpen}
        onClose={() => {
          setCouponFormOpen(false);
          setEditingCoupon(undefined);
        }}
        coupon={editingCoupon}
        restaurantId={restaurantId}
      />

      {/* Stamp Card Form Dialog */}
      <StampCardForm
        open={stampFormOpen}
        onClose={() => {
          setStampFormOpen(false);
          setEditingStamp(undefined);
        }}
        stampCard={editingStamp}
        restaurantId={restaurantId}
      />

      {/* Delete Coupon Confirm */}
      <AlertDialog
        open={!!deletingCouponId}
        onOpenChange={(v) => !v && setDeletingCouponId(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("promotions.deleteCoupon")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("promotions.deleteCouponConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-error text-white hover:bg-error/90"
              onClick={async () => {
                if (deletingCouponId) {
                  try {
                    await deleteCoupon({
                      restaurantId,
                      couponId: deletingCouponId,
                    }).unwrap();
                    toast.success(t("promotions.couponDeleted"));
                  } catch {
                    toast.error(t("common.error"));
                  }
                }
                setDeletingCouponId(undefined);
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Stamp Card Confirm */}
      <AlertDialog
        open={!!deletingStampId}
        onOpenChange={(v) => !v && setDeletingStampId(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("promotions.deleteStampCard")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("promotions.deleteStampCardConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-error text-white hover:bg-error/90"
              onClick={async () => {
                if (deletingStampId) {
                  try {
                    await deleteStampCard({
                      restaurantId,
                      stampCardId: deletingStampId,
                    }).unwrap();
                    toast.success(t("promotions.stampCardDeleted"));
                  } catch {
                    toast.error(t("common.error"));
                  }
                }
                setDeletingStampId(undefined);
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
