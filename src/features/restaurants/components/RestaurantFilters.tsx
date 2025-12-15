import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import type { Cuisine } from "../restaurants.types";

export interface FilterState {
  search: string;
  cuisine_id: string;
  min_rating: string;
  max_delivery_fee: string;
  sort: string;
}

interface RestaurantFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  cuisines: Cuisine[];
  isLoadingCuisines?: boolean;
}

const RATING_OPTIONS = ["3", "3.5", "4", "4.5"];
const FEE_OPTIONS = ["0", "3", "5", "8"];

export function RestaurantFilters({
  filters,
  onFilterChange,
  onClearFilters,
  cuisines,
  isLoadingCuisines,
}: RestaurantFiltersProps) {
  const { t } = useTranslation("restaurants");

  const hasActiveFilters =
    filters.search ||
    filters.cuisine_id ||
    filters.min_rating ||
    filters.max_delivery_fee;

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("filters.searchPlaceholder")}
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort */}
        <Select
          value={filters.sort}
          onValueChange={(val) => onFilterChange("sort", val)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("list.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-rating">
              {t("list.sortOptions.rating")}
            </SelectItem>
            <SelectItem value="-review_count">
              {t("list.sortOptions.reviewCount")}
            </SelectItem>
            <SelectItem value="delivery_fee">
              {t("list.sortOptions.deliveryFee")}
            </SelectItem>
            <SelectItem value="name">{t("list.sortOptions.name")}</SelectItem>
            <SelectItem value="-created_at">
              {t("list.sortOptions.newest")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3">
        {/* Cuisine filter */}
        <Select
          value={filters.cuisine_id}
          onValueChange={(val) =>
            onFilterChange("cuisine_id", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("filters.cuisine")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.allCuisines")}</SelectItem>
            {!isLoadingCuisines &&
              cuisines.map((cuisine) => (
                <SelectItem key={cuisine.id} value={cuisine.id}>
                  {cuisine.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Rating filter */}
        <Select
          value={filters.min_rating}
          onValueChange={(val) =>
            onFilterChange("min_rating", val === "any" ? "" : val)
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("filters.rating")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("filters.anyRating")}</SelectItem>
            {RATING_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {t("filters.ratingAbove", { rating: r })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Delivery fee filter */}
        <Select
          value={filters.max_delivery_fee}
          onValueChange={(val) =>
            onFilterChange("max_delivery_fee", val === "any" ? "" : val)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("filters.deliveryFee")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("filters.anyFee")}</SelectItem>
            <SelectItem value="0">{t("filters.freeDelivery")}</SelectItem>
            {FEE_OPTIONS.filter((f) => f !== "0").map((fee) => (
              <SelectItem key={fee} value={fee}>
                {t("filters.maxFee", { amount: fee })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            {t("list.clearFilters")}
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge
              variant="secondary"
              className="cursor-pointer gap-1"
              onClick={() => onFilterChange("search", "")}
            >
              &ldquo;{filters.search}&rdquo;
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.cuisine_id && (
            <Badge
              variant="secondary"
              className="cursor-pointer gap-1"
              onClick={() => onFilterChange("cuisine_id", "")}
            >
              {cuisines.find((c) => c.id === filters.cuisine_id)?.name}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.min_rating && (
            <Badge
              variant="secondary"
              className="cursor-pointer gap-1"
              onClick={() => onFilterChange("min_rating", "")}
            >
              {t("filters.ratingAbove", { rating: filters.min_rating })}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.max_delivery_fee && (
            <Badge
              variant="secondary"
              className="cursor-pointer gap-1"
              onClick={() => onFilterChange("max_delivery_fee", "")}
            >
              {filters.max_delivery_fee === "0"
                ? t("filters.freeDelivery")
                : t("filters.maxFee", { amount: filters.max_delivery_fee })}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
