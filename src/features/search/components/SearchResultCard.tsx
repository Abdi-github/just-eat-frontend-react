import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, Clock, Truck, Award } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { formatCHF } from "@/shared/utils/formatters";
import type { RestaurantSearchResult } from "../search.types";

interface SearchResultCardProps {
  restaurant: RestaurantSearchResult;
}

const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop";

export function SearchResultCard({ restaurant }: SearchResultCardProps) {
  const { t } = useTranslation("search");

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
          {/* Featured badge */}
          {restaurant.is_featured && (
            <Badge className="absolute top-2 left-2 gap-1 bg-primary text-primary-foreground">
              <Award className="h-3 w-3" />
              {t("card.sponsored")}
            </Badge>
          )}
          {/* Rating badge */}
          {restaurant.rating > 0 && (
            <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {restaurant.rating.toFixed(1)}
              <span className="ml-0.5 font-normal text-white/70">
                ({restaurant.review_count})
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-3">
          {/* Restaurant name */}
          <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
            {restaurant.name}
          </h3>

          {/* Cuisines */}
          {cuisineNames && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {cuisineNames}
            </p>
          )}

          {/* Delivery info */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {/* Delivery time */}
            {restaurant.estimated_delivery_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {restaurant.estimated_delivery_minutes.min}–
                {restaurant.estimated_delivery_minutes.max} min
              </span>
            )}

            {/* Delivery fee */}
            {restaurant.supports_delivery && (
              <span className="flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" />
                {restaurant.delivery_fee != null && restaurant.delivery_fee > 0
                  ? formatCHF(restaurant.delivery_fee)
                  : t("card.freeDelivery")}
              </span>
            )}

            {/* Minimum order */}
            {restaurant.minimum_order != null &&
              restaurant.minimum_order > 0 && (
                <span className="text-xs">
                  {t("card.minOrder", {
                    amount: formatCHF(restaurant.minimum_order),
                  })}
                </span>
              )}
          </div>

          {/* City */}
          {restaurant.city?.name && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              📍 {restaurant.city.name}
              {restaurant.canton?.code && ` (${restaurant.canton.code})`}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
