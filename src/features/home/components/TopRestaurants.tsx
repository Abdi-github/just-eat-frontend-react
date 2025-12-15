import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronRight, Star, Clock, Bike, MapPin } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { useGetHomeRestaurantsQuery } from "../home.api";
import { formatCHF } from "@/shared/utils/formatters";
import { useUserLocation } from "@/shared/hooks/useUserLocation";

export function TopRestaurants() {
  const { t } = useTranslation("home");
  const { cityId, cityName, isLoading: locationLoading } = useUserLocation();

  const { data, isLoading, isError } = useGetHomeRestaurantsQuery({
    limit: 8,
    sort: "-rating",
    is_active: true,
    status: "PUBLISHED",
    ...(cityId ? { city_id: cityId } : {}),
  });

  const restaurants = data?.data ?? [];

  if (isError) return null;

  return (
    <section className="bg-muted/50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {cityName
                ? t("topRestaurants.titleInCity", { city: cityName })
                : t("topRestaurants.title")}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {cityName ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {t("topRestaurants.subtitleInCity", { city: cityName })}
                </span>
              ) : (
                t("topRestaurants.subtitle")
              )}
            </p>
          </div>
          <Link
            to="/restaurants"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
          >
            {t("topRestaurants.viewAll")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Restaurant Grid */}
        {isLoading || locationLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-card"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {restaurant.cover_image_url || restaurant.logo_url ? (
                    <img
                      src={
                        restaurant.cover_image_url ?? restaurant.logo_url ?? ""
                      }
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}
                  {restaurant.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-primary text-white">
                      {t("topRestaurants.featured")}
                    </Badge>
                  )}
                  {restaurant.logo_url && restaurant.cover_image_url && (
                    <div className="absolute bottom-2 left-2 h-10 w-10 overflow-hidden rounded-lg border-2 border-white bg-white shadow-sm">
                      <img
                        src={restaurant.logo_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-3">
                  <h3 className="truncate text-base font-semibold text-foreground group-hover:text-primary">
                    {restaurant.name}
                  </h3>

                  {/* Cuisines */}
                  {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {restaurant.cuisines
                        .slice(0, 3)
                        .map((c) => c.name)
                        .join(" • ")}
                    </p>
                  )}

                  {/* Rating + Delivery Info */}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="font-semibold text-foreground">
                        {restaurant.rating.toFixed(1)}
                      </span>
                      <span>({restaurant.review_count})</span>
                    </div>

                    {/* Delivery Time */}
                    {restaurant.estimated_delivery_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {restaurant.estimated_delivery_minutes.min}–
                          {restaurant.estimated_delivery_minutes.max} min
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Delivery Fee */}
                  <div className="mt-2 flex items-center gap-2">
                    <Bike className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">
                      {restaurant.delivery_fee != null &&
                      restaurant.delivery_fee > 0
                        ? t("topRestaurants.deliveryFee", {
                            fee: formatCHF(restaurant.delivery_fee),
                          })
                        : t("topRestaurants.freeDelivery")}
                    </span>
                    {restaurant.minimum_order != null &&
                      restaurant.minimum_order > 0 && (
                        <span className="text-xs text-muted-foreground">
                          •{" "}
                          {t("topRestaurants.minOrder", {
                            amount: formatCHF(restaurant.minimum_order),
                          })}
                        </span>
                      )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile "View All" Link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("topRestaurants.viewAll")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RestaurantCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
