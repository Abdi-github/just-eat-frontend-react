import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { FavoriteCard } from "../components/FavoriteCard";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../favorites.api";

export function FavoritesPage() {
  const { t } = useTranslation("favorites");

  const { data, isLoading } = useGetFavoritesQuery();
  const [removeFavorite, { isLoading: isRemoving }] =
    useRemoveFavoriteMutation();

  const favorites = data?.data || [];

  const handleRemove = async (restaurantId: string) => {
    try {
      await removeFavorite(restaurantId).unwrap();
      toast.success(t("removed"));
    } catch {
      toast.error(t("removeError"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[16/9] w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Heart className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">
            {t("noFavorites")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("noFavoritesDescription")}
          </p>
          <Button asChild className="mt-4">
            <Link to="/restaurants">{t("browseRestaurants")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <FavoriteCard
              key={fav.id}
              favorite={fav}
              onRemove={handleRemove}
              isRemoving={isRemoving}
            />
          ))}
        </div>
      )}
    </div>
  );
}
