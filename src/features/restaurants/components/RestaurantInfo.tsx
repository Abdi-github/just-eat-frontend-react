import { useTranslation } from "react-i18next";
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCHF, formatRating } from "@/shared/utils/formatters";
import type { Restaurant } from "../restaurants.types";

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop";

export function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  const { t } = useTranslation("restaurants");

  const coverImage = restaurant.cover_image_url || PLACEHOLDER_COVER;
  const cuisineNames = restaurant.cuisines?.map((c) => c.name).join(", ");

  return (
    <div>
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden rounded-lg bg-muted sm:h-64 md:h-72">
        <img
          src={coverImage}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Restaurant name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="flex items-end gap-4">
            {/* Logo */}
            {restaurant.logo_url && (
              <img
                src={restaurant.logo_url}
                alt={`${restaurant.name} logo`}
                className="h-16 w-16 rounded-lg border-2 border-white bg-white object-contain shadow-md sm:h-20 sm:w-20"
              />
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {restaurant.name}
              </h1>
              {cuisineNames && (
                <p className="mt-0.5 text-sm text-white/80">{cuisineNames}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        {/* Rating */}
        {restaurant.review_count > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded-md bg-primary/10 px-2 py-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold text-primary">
                {formatRating(restaurant.rating)}
              </span>
            </div>
            <span className="text-muted-foreground">
              ({restaurant.review_count})
            </span>
          </div>
        )}

        {/* Delivery time */}
        {restaurant.estimated_delivery_minutes && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {restaurant.estimated_delivery_minutes.min}–
              {restaurant.estimated_delivery_minutes.max} min
            </span>
          </div>
        )}

        {/* Delivery fee */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <Truck className="h-4 w-4" />
          <span>
            {!restaurant.delivery_fee || restaurant.delivery_fee === 0
              ? t("detail.freeDelivery")
              : `${t("detail.deliveryFee")}: ${formatCHF(restaurant.delivery_fee)}`}
          </span>
        </div>

        {/* Min order */}
        {restaurant.minimum_order && restaurant.minimum_order > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <ShoppingBag className="h-4 w-4" />
            <span>
              {t("detail.minimumOrder")}: {formatCHF(restaurant.minimum_order)}
            </span>
          </div>
        )}

        {/* Order type badges */}
        <div className="flex gap-1.5">
          {restaurant.supports_delivery && (
            <Badge variant="outline" className="text-xs">
              {t("detail.supportsDelivery")}
            </Badge>
          )}
          {restaurant.supports_pickup && (
            <Badge variant="outline" className="text-xs">
              {t("detail.supportsPickup")}
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      {restaurant.description && (
        <p className="mt-3 text-sm text-muted-foreground">
          {restaurant.description}
        </p>
      )}

      {/* Contact info */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>
            {restaurant.address}
            {restaurant.city?.name && `, ${restaurant.city.name}`}
          </span>
        </div>
        {restaurant.phone && (
          <a
            href={`tel:${restaurant.phone}`}
            className="flex items-center gap-1.5 hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            <span>{restaurant.phone}</span>
          </a>
        )}
        {restaurant.email && (
          <a
            href={`mailto:${restaurant.email}`}
            className="flex items-center gap-1.5 hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            <span>{restaurant.email}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export function RestaurantInfoSkeleton() {
  return (
    <div>
      <Skeleton className="h-48 w-full rounded-lg sm:h-64 md:h-72" />
      <div className="mt-4 flex flex-wrap gap-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-28" />
      </div>
      <Skeleton className="mt-3 h-4 w-3/4" />
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
