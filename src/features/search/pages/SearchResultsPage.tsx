import { useMemo, useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchX, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSearchRestaurantsQuery } from "../search.api";
import { SearchBar } from "../components/SearchBar";
import {
  SearchFilters,
  type SearchFilterState,
} from "../components/SearchFilters";
import { SearchResultCard } from "../components/SearchResultCard";
import { LocationSearch } from "../components/LocationSearch";
import type { SearchQueryParams, City } from "../search.types";

const PAGE_SIZE = 12;

export function SearchResultsPage() {
  const { t } = useTranslation("search");
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected city for location filtering
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Parse URL params into search query
  const queryParams = useMemo<SearchQueryParams>(() => {
    const params: SearchQueryParams = {};

    const q = searchParams.get("q");
    if (q) params.q = q;

    const page = searchParams.get("page");
    params.page = page ? parseInt(page, 10) : 1;
    params.limit = PAGE_SIZE;

    const cuisine_id = searchParams.get("cuisine_id");
    if (cuisine_id) params.cuisine_id = cuisine_id;

    const min_rating = searchParams.get("min_rating");
    if (min_rating) params.min_rating = parseFloat(min_rating);

    const max_delivery_fee = searchParams.get("max_delivery_fee");
    if (max_delivery_fee)
      params.max_delivery_fee = parseFloat(max_delivery_fee);

    const order_type = searchParams.get("order_type");
    if (order_type === "delivery" || order_type === "pickup") {
      params.order_type = order_type;
    }

    const sort = searchParams.get("sort");
    if (sort) params.sort = sort;

    const city_id = searchParams.get("city_id");
    if (city_id) params.city_id = city_id;

    return params;
  }, [searchParams]);

  // Fetch search results
  const {
    data: searchData,
    isLoading,
    isFetching,
  } = useSearchRestaurantsQuery(queryParams);

  const restaurants = searchData?.data ?? [];
  const meta = searchData?.meta;
  const totalResults = meta?.total ?? 0;
  const currentPage = meta?.page ?? 1;
  const totalPages = meta?.totalPages ?? 1;

  // Current filter state from URL
  const filterState = useMemo<SearchFilterState>(
    () => ({
      cuisine_id: queryParams.cuisine_id,
      min_rating: queryParams.min_rating,
      max_delivery_fee: queryParams.max_delivery_fee,
      order_type: queryParams.order_type,
      sort: queryParams.sort,
    }),
    [queryParams],
  );

  // Update URL params when filters change
  const handleFilterChange = useCallback(
    (newFilters: SearchFilterState) => {
      const params = new URLSearchParams(searchParams);

      // Preserve query
      const q = params.get("q");

      // Reset to page 1 on filter change
      params.delete("page");

      // Update filter params
      const filterKeys: Array<keyof SearchFilterState> = [
        "cuisine_id",
        "min_rating",
        "max_delivery_fee",
        "order_type",
        "sort",
      ];

      for (const key of filterKeys) {
        if (newFilters[key] !== undefined && newFilters[key] !== null) {
          params.set(key, String(newFilters[key]));
        } else {
          params.delete(key);
        }
      }

      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Handle city selection
  const handleCitySelect = useCallback(
    (city: City) => {
      setSelectedCity(city);
      const params = new URLSearchParams(searchParams);
      params.set("city_id", city.id);
      params.delete("page");
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleCityClear = useCallback(() => {
    setSelectedCity(null);
    const params = new URLSearchParams(searchParams);
    params.delete("city_id");
    params.delete("page");
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  // Pagination
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      setSearchParams(params, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, setSearchParams],
  );

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchParams({}, { replace: true });
    setSelectedCity(null);
  }, [setSearchParams]);

  const queryText = queryParams.q ?? "";
  const pageTitle = queryText
    ? t("pageTitle", { query: queryText })
    : t("pageTitleNoQuery");

  const from = (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, totalResults);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Page header with search bar */}
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {pageTitle}
        </h1>

        <div className="flex flex-col gap-3 md:flex-row md:items-start">
          {/* Search bar */}
          <SearchBar
            initialQuery={queryText}
            variant="full"
            className="flex-1"
          />

          {/* Location filter */}
          <LocationSearch
            selectedCity={selectedCity}
            onCitySelect={handleCitySelect}
            onClear={handleCityClear}
            className="md:w-64"
          />
        </div>
      </div>

      {/* Filters */}
      <SearchFilters
        filters={filterState}
        onFilterChange={handleFilterChange}
        className="mb-6"
      />

      {/* Results count */}
      {!isLoading && totalResults > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("resultsCount", { count: totalResults })}
          </p>
          {totalPages > 1 && (
            <p className="text-xs text-muted-foreground">
              {t("showingResults", { from, to, total: totalResults })}
            </p>
          )}
        </div>
      )}

      {/* Loading indicator for refetch */}
      {isFetching && !isLoading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{t("title")}...</span>
        </div>
      )}

      {/* Results grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-border"
            >
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : restaurants.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {restaurants.map((restaurant) => (
            <SearchResultCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            {t("noResults")}
          </h2>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            {t("noResultsDescription")}
          </p>
          <Button variant="outline" onClick={handleClearSearch}>
            {t("tryAgain")}
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {t("common:actions.back")}
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              let page: number;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }

              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {t("common:actions.next")}
          </Button>
        </div>
      )}
    </div>
  );
}
