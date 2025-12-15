import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import { UtensilsCrossed, Loader2, List, Infinity } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

const INITIAL_FILTERS: FilterState = {
  search: "",
  cuisine_id: "",
  min_rating: "",
  max_delivery_fee: "",
  sort: "-rating",
};

const PAGE_SIZE = 12;

export function RestaurantExplorePage() {
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

  // Read filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || INITIAL_FILTERS.search,
    cuisine_id: searchParams.get("cuisine") || INITIAL_FILTERS.cuisine_id,
    min_rating: searchParams.get("rating") || INITIAL_FILTERS.min_rating,
    max_delivery_fee:
      searchParams.get("fee") || INITIAL_FILTERS.max_delivery_fee,
    sort: searchParams.get("sort") || INITIAL_FILTERS.sort,
  });

  // Build query params for the cursor API
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
    if (!nextCursor || !hasMore) return;

    // Accumulate current restaurants
    setAccumulatedRestaurants((prev) => [...prev, ...currentPageRestaurants]);
    setCurrentCursor(nextCursor);
    setHasLoadedMore(true);
  }, [nextCursor, hasMore, currentPageRestaurants]);

  // Filter change handler — resets cursor & accumulated data
  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setAccumulatedRestaurants([]);
      setCurrentCursor(undefined);
      setHasLoadedMore(false);

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
    [searchParams, setSearchParams],
  );

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setAccumulatedRestaurants([]);
    setCurrentCursor(undefined);
    setHasLoadedMore(false);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header with tab switcher */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("explore.title")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("explore.subtitle")}
          </p>
        </div>

        {/* View mode switcher */}
        <Tabs defaultValue="explore" className="w-auto">
          <TabsList>
            <TabsTrigger value="paginated" asChild>
              <Link to="/restaurants" className="flex items-center gap-1.5">
                <List className="h-4 w-4" />
                {t("explore.paginatedView")}
              </Link>
            </TabsTrigger>
            <TabsTrigger value="explore" asChild>
              <Link
                to="/restaurants/explore"
                className="flex items-center gap-1.5"
              >
                <Infinity className="h-4 w-4" />
                {t("explore.infiniteView")}
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
          {t("explore.showing", {
            loaded: displayRestaurants.length,
            total,
          })}
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

      {/* End of results */}
      {!hasMore && !isLoading && displayRestaurants.length > 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("explore.endOfResults")}
        </p>
      )}
    </div>
  );
}
