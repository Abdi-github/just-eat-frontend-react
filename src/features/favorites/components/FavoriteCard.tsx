import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Star, Clock, Truck, Store, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { formatCHF } from "@/shared/utils/formatters";
import type { FavoriteRestaurant } from "../favorites.types";

interface FavoriteCardProps {
  favorite: FavoriteRestaurant;
  onRemove: (restaurantId: string) => void;
  isRemoving?: boolean;
}

export function FavoriteCard({
  favorite,
  onRemove,
  isRemoving,
}: FavoriteCardProps) {
  const { t } = useTranslation("favorites");
  const r = favorite.restaurant;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/restaurants/${r.slug}`} className="block">
        {r.cover_image_url ? (
          <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
            <img
              src={r.cover_image_url}
              alt={r.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-muted">
            <Store className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link to={`/restaurants/${r.slug}`} className="hover:text-primary">
              <h3 className="truncate text-base font-semibold text-secondary">
                {r.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span>
                {t("rating", {
                  rating: r.rating.toFixed(1),
                  count: r.review_count,
                })}
              </span>
            </div>

            {/* Delivery info */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {r.supports_delivery && (
                <Badge variant="outline" className="text-xs font-normal">
                  <Truck className="mr-1 h-3 w-3" />
                  {t("delivery")}
                </Badge>
              )}
              {r.supports_pickup && (
                <Badge variant="outline" className="text-xs font-normal">
                  <Store className="mr-1 h-3 w-3" />
                  {t("pickup")}
                </Badge>
              )}
              {!r.is_active && (
                <Badge
                  variant="secondary"
                  className="bg-error/10 text-xs text-error"
                >
                  {t("closed")}
                </Badge>
              )}
            </div>

            {/* Delivery fee & time */}
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              {r.delivery_fee !== undefined && (
                <span>
                  {r.delivery_fee === 0
                    ? t("deliveryFree")
                    : t("deliveryFee", { fee: formatCHF(r.delivery_fee) })}
                </span>
              )}
              {r.estimated_delivery_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {t("deliveryTime", {
                    min: r.estimated_delivery_minutes.min,
                    max: r.estimated_delivery_minutes.max,
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Remove button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onRemove(r.id);
            }}
            disabled={isRemoving}
            className="shrink-0 text-error hover:bg-error/10 hover:text-error"
          >
            <Heart className="h-5 w-5 fill-current" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
