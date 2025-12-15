import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, Clock, Truck, Award } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { formatCHF } from "@/shared/utils/formatters";
import type { Restaurant } from "../restaurants.types";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop";

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { t } = useTranslation("restaurants");

  const coverImage = restaurant.cover_image_url || PLACEHOLDER_COVER;
  const cuisineNames = restaurant.cuisines?.map((c) => c.name).join(", ");

  return (
    <Link to={`/restaurants/${restaurant.slug}`} className="group block">
      <Card className="overflow-hidden border-border/60 transition-shadow duration-200 hover:shadow-lg">
        {/* Cover Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={coverImage}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges overlay */}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
            {restaurant.is_featured && (
              <Badge className="bg-primary text-primary-foreground shadow-sm">
                <Award className="mr-1 h-3 w-3" />
                {t("card.featured")}
              </Badge>
            )}
            {!restaurant.is_active && (
              <Badge variant="destructive" className="shadow-sm">
                {t("card.closed")}
              </Badge>
            )}
          </div>

          {/* Delivery fee badge */}
          <div className="absolute bottom-2 right-2">
            {restaurant.delivery_fee === 0 || !restaurant.delivery_fee ? (
              <Badge
                variant="secondary"
                className="bg-success text-white shadow-sm"
              >
                {t("card.freeDelivery")}
              </Badge>
            ) : (
              <Badge variant="secondary" className="shadow-sm">
                {t("card.deliveryFee", {
                  fee: formatCHF(restaurant.delivery_fee),
                })}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Restaurant name */}
          <h3 className="line-clamp-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>

          {/* Cuisines */}
          {cuisineNames && (
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
              {cuisineNames}
            </p>
          )}

          {/* Meta row: rating, delivery time, min order */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {/* Rating */}
            {restaurant.review_count > 0 && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {restaurant.rating.toFixed(1)}
                <span className="font-normal text-muted-foreground">
                  ({restaurant.review_count})
                </span>
              </span>
            )}

            {/* Delivery time */}
            {restaurant.estimated_delivery_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {t("card.deliveryTime", {
                  min: restaurant.estimated_delivery_minutes.min,
                  max: restaurant.estimated_delivery_minutes.max,
                })}
              </span>
            )}

            {/* Min order */}
            {restaurant.minimum_order && restaurant.minimum_order > 0 && (
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" />
                {t("card.minOrder", {
                  amount: formatCHF(restaurant.minimum_order),
                })}
              </span>
            )}
          </div>

          {/* Order type tags */}
          <div className="mt-2.5 flex gap-1.5">
            {restaurant.supports_delivery && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-normal",
                  "border-primary/20 text-primary",
                )}
              >
                {t("card.delivery")}
              </Badge>
            )}
            {restaurant.supports_pickup && (
              <Badge variant="outline" className="text-xs font-normal">
                {t("card.pickup")}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-1.5 h-4 w-1/2" />
        <div className="mt-3 flex gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
