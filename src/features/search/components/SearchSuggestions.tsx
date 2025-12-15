import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Store, UtensilsCrossed } from "lucide-react";
import type { SearchSuggestion } from "../search.types";

interface SearchSuggestionsProps {
  suggestions: {
    restaurants: SearchSuggestion[];
    cuisines: SearchSuggestion[];
  } | null;
  isLoading: boolean;
  query: string;
  onSelect: (suggestion: SearchSuggestion) => void;
  onViewAll: () => void;
}

export function SearchSuggestions({
  suggestions,
  isLoading,
  query,
  onSelect,
  onViewAll,
}: SearchSuggestionsProps) {
  const { t } = useTranslation("search");
  const navigate = useNavigate();

  const hasRestaurants = (suggestions?.restaurants?.length ?? 0) > 0;
  const hasCuisines = (suggestions?.cuisines?.length ?? 0) > 0;
  const hasResults = hasRestaurants || hasCuisines;

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasResults && query.length >= 2) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {t("suggestions.noSuggestions")}
      </div>
    );
  }

  if (query.length < 2) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {t("suggestions.typeToSearch")}
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {/* Restaurant suggestions */}
      {hasRestaurants && (
        <div>
          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
            <Store className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("suggestions.restaurants")}
            </span>
          </div>
          {suggestions!.restaurants.map((item) => (
            <button
              key={`restaurant-${item.id}`}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
              onClick={() => {
                navigate(`/restaurants/${item.slug}`);
              }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Store className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.name}
                </p>
                {item.extra && (
                  <p className="truncate text-xs text-muted-foreground">
                    {item.extra}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Cuisine suggestions */}
      {hasCuisines && (
        <div>
          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
            <UtensilsCrossed className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("suggestions.cuisines")}
            </span>
          </div>
          {suggestions!.cuisines.map((item) => (
            <button
              key={`cuisine-${item.id}`}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
              onClick={() => onSelect(item)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                <UtensilsCrossed className="h-4 w-4 text-warning" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.name}
                </p>
                {item.extra && (
                  <p className="truncate text-xs text-muted-foreground">
                    {item.extra}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* View all results link */}
      {hasResults && (
        <button
          className="flex w-full items-center justify-center border-t border-border px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent"
          onClick={onViewAll}
        >
          {t("suggestions.viewAll", { query })}
        </button>
      )}
    </div>
  );
}
