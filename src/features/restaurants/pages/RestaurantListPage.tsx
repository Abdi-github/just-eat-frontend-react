import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import {
  useGetRestaurantsCursorQuery,
  useGetCuisinesForFilterQuery,
} from "../restaurants.api";
import type { Restaurant, RestaurantCursorQueryParams } from "../restaurants.types";
import { RestaurantGrid } from "../components/RestaurantGrid";
import {
  RestaurantFilters,
  type FilterState,
} from "../components/RestaurantFilters";
import { Button } from "@/shared/components/ui/button";

const INITIAL_FILTERS: FilterState = {
  search: "",
  cuisine_id: "",
  min_rating: "",
  max_delivery_fee: "",
  sort: "-rating",
};

const PAGE_SIZE = 12;

export function RestaurantListPage() {
  const { t } = useTranslation("restaurants");
  const [searchParams, setSearchParams] = useSearchParams();

  // Accumulated restaurants from all loaded pages
  const [accumulatedRestaurants, setAccumulatedRestaurants] = useState<
    Restaurant[]
  >([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(
    undefined,
  );
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Sentinel ref for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Read filters from URL params with defaults
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || INITIAL_FILTERS.search,
    cuisine_id: searchParams.get("cuisine") || INITIAL_FILTERS.cuisine_id,
    min_rating: searchParams.get("rating") || INITIAL_FILTERS.min_rating,
    max_delivery_fee:
      searchParams.get("fee") || INITIAL_FILTERS.max_delivery_fee,
    sort: searchParams.get("sort") || INITIAL_FILTERS.sort,
  });

  // Build query params for cursor API
  const queryParams: RestaurantCursorQueryParams = {
    limit: PAGE_SIZE,
    cursor: currentCursor,
    direction: currentCursor ? "next" : undefined,
    sort: filters.sort || "-rating",
    search: filters.search || undefined,
    cuisine_id: filters.cuisine_id || undefined,
    min_rating: filters.min_rating ? Number(filters.min_rating) : undefined,
    is_active: true,
    status: "published",
  };

  const { data, isLoading, isFetching } =
    useGetRestaurantsCursorQuery(queryParams);
  const { data: cuisinesData, isLoading: isLoadingCuisines } =
    useGetCuisinesForFilterQuery({ limit: 50 });

  // Current page restaurants from API
  const currentPageRestaurants = data?.data?.restaurants ?? [];
  const nextCursor = data?.data?.nextCursor ?? null;
  const hasMore = data?.data?.hasMore ?? false;
  const total = data?.data?.total ?? 0;
  const cuisines = cuisinesData?.data ?? [];

  // Combine accumulated + current page
  const displayRestaurants = hasLoadedMore
    ? [...accumulatedRestaurants, ...currentPageRestaurants]
    : currentPageRestaurants;

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!nextCursor || !hasMore || isFetching) return;

    // Accumulate current restaurants
    setAccumulatedRestaurants((prev) => [...prev, ...currentPageRestaurants]);
    setCurrentCursor(nextCursor);
    setHasLoadedMore(true);
  }, [nextCursor, hasMore, isFetching, currentPageRestaurants]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isFetching && !isLoading) {
          handleLoadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, isFetching, isLoading]);

  // Reset accumulation
  const resetPagination = useCallback(() => {
    setAccumulatedRestaurants([]);
    setCurrentCursor(undefined);
    setHasLoadedMore(false);
  }, []);

  // Filter change handler — updates URL & resets cursor
  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      resetPagination();

      // Sync to URL
      const params = new URLSearchParams(searchParams);
      const paramMap: Record<string, string> = {
        search: "search",
        cuisine_id: "cuisine",
        min_rating: "rating",
        max_delivery_fee: "fee",
        sort: "sort",
      };
      if (value) {
        params.set(paramMap[key]!, value);
      } else {
        params.delete(paramMap[key]!);
      }
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams, resetPagination],
  );

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    resetPagination();
    setSearchParams({}, { replace: true });
  }, [setSearchParams, resetPagination]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("list.title")}
        </h1>
        <p className="mt-1 text-muted-foreground">{t("list.subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <RestaurantFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          cuisines={cuisines}
          isLoadingCuisines={isLoadingCuisines}
        />
      </div>

      {/* Results count */}
      {!isLoading && total > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          {t("list.showing", { count: displayRestaurants.length, total })}
        </p>
      )}

      {/* Grid or empty state */}
      {!isLoading && displayRestaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <UtensilsCrossed className="h-16 w-16 text-muted-foreground/40" />
          <h2 className="mt-4 text-xl font-semibold text-muted-foreground">
            {t("list.noResults")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("list.noResultsDescription")}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleClearFilters}
          >
            {t("list.clearFilters")}
          </Button>
        </div>
      ) : (
        <RestaurantGrid
          restaurants={displayRestaurants}
          isLoading={isLoading}
        />
      )}

      {/* Load More button */}
      {hasMore && !isLoading && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <Button
            onClick={handleLoadMore}
            disabled={isFetching}
            size="lg"
            className="min-w-[200px]"
          >
            {isFetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("explore.loading")}
              </>
            ) : (
              t("explore.loadMore")
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            {t("explore.loadMoreHint", {
              remaining: total - displayRestaurants.length,
            })}
          </p>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && !isLoading && <div ref={sentinelRef} className="h-1" />}

      {/* End of results */}
      {!hasMore && !isLoading && displayRestaurants.length > 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("explore.endOfResults")}
        </p>
      )}
    </div>
  );
}
