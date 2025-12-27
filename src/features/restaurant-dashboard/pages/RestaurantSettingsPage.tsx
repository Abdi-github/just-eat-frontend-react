import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { Upload, Trash2, ImageIcon } from "lucide-react";
import { useRestaurant } from "../hooks/useRestaurant";
import {
  useGetMyRestaurantsQuery,
  useUpdateRestaurantMutation,
  useToggleRestaurantActiveMutation,
  useUploadRestaurantLogoMutation,
  useDeleteRestaurantLogoMutation,
  useUploadRestaurantCoverMutation,
  useDeleteRestaurantCoverMutation,
} from "../restaurant-dashboard.api";

const settingsSchema = z.object({
  name: z.string().min(1).max(300),
  description_en: z.string().max(2000).optional().or(z.literal("")),
  description_fr: z.string().max(2000).optional().or(z.literal("")),
  description_de: z.string().max(2000).optional().or(z.literal("")),
  description_it: z.string().max(2000).optional().or(z.literal("")),
  address: z.string().min(1).max(500),
  postal_code: z.string().length(4),
  city_id: z.string().min(1),
  canton_id: z.string().min(1),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  delivery_fee: z.coerce.number().min(0),
  minimum_order: z.coerce.number().min(0),
  estimated_delivery_min: z.coerce.number().min(0).optional(),
  estimated_delivery_max: z.coerce.number().min(0).optional(),
  supports_delivery: z.boolean(),
  supports_pickup: z.boolean(),
  is_partner_delivery: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function RestaurantSettingsPage() {
  const { t } = useTranslation("restaurant-dashboard");
  const { restaurantId, activeRestaurant, setActiveRestaurant } =
    useRestaurant();

  const { data: restaurantsData } = useGetMyRestaurantsQuery();
  const restaurant = restaurantsData?.data?.find((r) => r.id === restaurantId);

  const [updateRestaurant, { isLoading: saving }] =
    useUpdateRestaurantMutation();
  const [toggleActive, { isLoading: toggling }] =
    useToggleRestaurantActiveMutation();
  const [uploadLogo, { isLoading: uploadingLogo }] =
    useUploadRestaurantLogoMutation();
  const [deleteLogo, { isLoading: deletingLogo }] =
    useDeleteRestaurantLogoMutation();
  const [uploadCover, { isLoading: uploadingCover }] =
    useUploadRestaurantCoverMutation();
  const [deleteCover, { isLoading: deletingCover }] =
    useDeleteRestaurantCoverMutation();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      address: "",
      postal_code: "",
      city_id: "",
      canton_id: "",
      delivery_fee: 0,
      minimum_order: 0,
      supports_delivery: true,
      supports_pickup: false,
      is_partner_delivery: false,
    },
  });

  // Reset form when restaurant data loads
  useEffect(() => {
    if (restaurant) {
      reset({
        name: restaurant.name,
        description_en: restaurant.description?.en ?? "",
        description_fr: restaurant.description?.fr ?? "",
        description_de: restaurant.description?.de ?? "",
        description_it: restaurant.description?.it ?? "",
        address: restaurant.address,
        postal_code: restaurant.postal_code,
        city_id: restaurant.city_id,
        canton_id: restaurant.canton_id,
        phone: restaurant.phone ?? "",
        email: restaurant.email ?? "",
        delivery_fee: restaurant.delivery_fee,
        minimum_order: restaurant.minimum_order,
        estimated_delivery_min: restaurant.estimated_delivery_minutes?.min,
        estimated_delivery_max: restaurant.estimated_delivery_minutes?.max,
        supports_delivery: restaurant.supports_delivery,
        supports_pickup: restaurant.supports_pickup,
        is_partner_delivery: restaurant.is_partner_delivery,
      });
    }
  }, [restaurant, reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    if (!restaurantId) return;
    try {
      const result = await updateRestaurant({
        id: restaurantId,
        body: {
          name: values.name,
          description: {
            en: values.description_en || undefined,
            fr: values.description_fr || undefined,
            de: values.description_de || undefined,
            it: values.description_it || undefined,
          },
          address: values.address,
          postal_code: values.postal_code,
          city_id: values.city_id,
          canton_id: values.canton_id,
          phone: values.phone || undefined,
          email: values.email || undefined,
          delivery_fee: values.delivery_fee,
          minimum_order: values.minimum_order,
          estimated_delivery_minutes:
            values.estimated_delivery_min != null &&
            values.estimated_delivery_max != null
              ? {
                  min: values.estimated_delivery_min,
                  max: values.estimated_delivery_max,
                }
              : undefined,
          supports_delivery: values.supports_delivery,
          supports_pickup: values.supports_pickup,
          is_partner_delivery: values.is_partner_delivery,
        },
      }).unwrap();
      if (result.data) setActiveRestaurant(result.data);
      toast.success(t("settings.saved"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleToggleActive = async () => {
    if (!restaurant || !restaurantId) return;
    try {
      await toggleActive({
        id: restaurantId,
        is_active: !restaurant.is_active,
      }).unwrap();
      toast.success(t("settings.activeToggled"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!restaurantId) return;
    const formData = new FormData();
    formData.append("logo", file);
    try {
      await uploadLogo({ id: restaurantId, formData }).unwrap();
      toast.success(t("settings.logoUploaded"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleCoverUpload = async (file: File) => {
    if (!restaurantId) return;
    const formData = new FormData();
    formData.append("cover_image", file);
    try {
      await uploadCover({ id: restaurantId, formData }).unwrap();
      toast.success(t("settings.coverUploaded"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  if (!restaurantId || !restaurant) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("settings.title")}</h1>

      {/* Status toggle */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">{t("settings.restaurantStatus")}</p>
            <p className="text-sm text-muted-foreground">
              {restaurant.is_active
                ? t("settings.active")
                : t("settings.inactive")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={restaurant.is_active ? "default" : "secondary"}>
              {restaurant.is_active
                ? t("settings.active")
                : t("settings.inactive")}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleActive}
              disabled={toggling}
            >
              {t("settings.toggleActive")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.images")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo */}
          <div>
            <Label>{t("settings.logo")}</Label>
            <div className="mt-2 flex items-center gap-4">
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt="Logo"
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                  <ImageIcon size={24} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={logoInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file);
                    e.target.value = "";
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploadingLogo}
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Upload size={14} className="mr-1" />
                  {t("settings.uploadLogo")}
                </Button>
                {restaurant.logo_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-error"
                    disabled={deletingLogo}
                    onClick={async () => {
                      try {
                        await deleteLogo(restaurantId).unwrap();
                        toast.success(t("settings.logoRemoved"));
                      } catch {
                        toast.error(t("common.error"));
                      }
                    }}
                  >
                    <Trash2 size={14} className="mr-1" />
                    {t("settings.removeLogo")}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Cover Image */}
          <div>
            <Label>{t("settings.coverImage")}</Label>
            <div className="mt-2 space-y-3">
              {restaurant.cover_image_url ? (
                <img
                  src={restaurant.cover_image_url}
                  alt="Cover"
                  className="h-40 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-lg bg-muted">
                  <ImageIcon size={32} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={coverInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverUpload(file);
                    e.target.value = "";
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploadingCover}
                  onClick={() => coverInputRef.current?.click()}
                >
                  <Upload size={14} className="mr-1" />
                  {t("settings.uploadCover")}
                </Button>
                {restaurant.cover_image_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-error"
                    disabled={deletingCover}
                    onClick={async () => {
                      try {
                        await deleteCover(restaurantId).unwrap();
                        toast.success(t("settings.coverRemoved"));
                      } catch {
                        toast.error(t("common.error"));
                      }
                    }}
                  >
                    <Trash2 size={14} className="mr-1" />
                    {t("settings.removeCover")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Info + Delivery Settings Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.generalInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">{t("settings.name")}</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="mt-1 text-xs text-error">
                    {t("common.required")}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="address">{t("settings.address")}</Label>
                <Input id="address" {...register("address")} />
                {errors.address && (
                  <p className="mt-1 text-xs text-error">
                    {t("common.required")}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="postal_code">{t("settings.postalCode")}</Label>
                <Input
                  id="postal_code"
                  {...register("postal_code")}
                  maxLength={4}
                />
                {errors.postal_code && (
                  <p className="mt-1 text-xs text-error">
                    {t("common.required")}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="city_id">{t("settings.city")}</Label>
                <Input id="city_id" {...register("city_id")} />
              </div>
              <div>
                <Label htmlFor="canton_id">{t("settings.canton")}</Label>
                <Input id="canton_id" {...register("canton_id")} />
              </div>
              <div>
                <Label htmlFor="phone">{t("settings.phone")}</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div>
                <Label htmlFor="email">{t("settings.email")}</Label>
                <Input id="email" type="email" {...register("email")} />
              </div>
            </div>

            {/* Descriptions */}
            <Separator />
            <p className="text-sm font-medium">{t("settings.description")}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["en", "fr", "de", "it"] as const).map((lang) => (
                <div key={lang}>
                  <Label htmlFor={`description_${lang}`}>
                    {t(`settings.${lang}`)}
                  </Label>
                  <Textarea
                    id={`description_${lang}`}
                    rows={3}
                    {...register(
                      `description_${lang}` as keyof SettingsFormValues,
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("settings.deliverySettings")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="delivery_fee">
                  {t("settings.deliveryFee")}
                </Label>
                <Input
                  id="delivery_fee"
                  type="number"
                  step="0.5"
                  min="0"
                  {...register("delivery_fee")}
                />
              </div>
              <div>
                <Label htmlFor="minimum_order">
                  {t("settings.minimumOrder")}
                </Label>
                <Input
                  id="minimum_order"
                  type="number"
                  step="0.5"
                  min="0"
                  {...register("minimum_order")}
                />
              </div>
              <div>
                <Label htmlFor="estimated_delivery_min">
                  {t("settings.estimatedDeliveryMin")}
                </Label>
                <Input
                  id="estimated_delivery_min"
                  type="number"
                  min="0"
                  {...register("estimated_delivery_min")}
                />
              </div>
              <div>
                <Label htmlFor="estimated_delivery_max">
                  {t("settings.estimatedDeliveryMax")}
                </Label>
                <Input
                  id="estimated_delivery_max"
                  type="number"
                  min="0"
                  {...register("estimated_delivery_max")}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="supports_delivery"
                  checked={watch("supports_delivery")}
                  onCheckedChange={(val) => setValue("supports_delivery", val)}
                />
                <Label htmlFor="supports_delivery">
                  {t("settings.supportsDelivery")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="supports_pickup"
                  checked={watch("supports_pickup")}
                  onCheckedChange={(val) => setValue("supports_pickup", val)}
                />
                <Label htmlFor="supports_pickup">
                  {t("settings.supportsPickup")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_partner_delivery"
                  checked={watch("is_partner_delivery")}
                  onCheckedChange={(val) =>
                    setValue("is_partner_delivery", val)
                  }
                />
                <Label htmlFor="is_partner_delivery">
                  {t("settings.isPartnerDelivery")}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
