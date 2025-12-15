import { useTranslation } from "react-i18next";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { useGetSearchCuisinesQuery } from "../search.api";

export interface SearchFilterState {
  cuisine_id?: string;
  min_rating?: number;
  max_delivery_fee?: number;
  order_type?: "delivery" | "pickup";
  sort?: string;
}

interface SearchFiltersProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  className?: string;
}

const RATING_OPTIONS = [
  { value: "4", label: "4+ ★" },
  { value: "3", label: "3+ ★" },
  { value: "2", label: "2+ ★" },
];

const DELIVERY_FEE_OPTIONS = [
  { value: "0", label: "CHF 0" },
  { value: "3", label: "CHF 3" },
  { value: "5", label: "CHF 5" },
  { value: "8", label: "CHF 8" },
];

const SORT_OPTIONS = [
  { value: "-rating", key: "rating" },
  { value: "delivery_fee", key: "deliveryFee" },
  { value: "-review_count", key: "reviewCount" },
  { value: "name", key: "name" },
];

export function SearchFilters({
  filters,
  onFilterChange,
  className = "",
}: SearchFiltersProps) {
  const { t } = useTranslation("search");

  const { data: cuisinesData } = useGetSearchCuisinesQuery();
  const cuisines = cuisinesData?.data ?? [];

  // Count active filters
  const activeCount = [
    filters.cuisine_id,
    filters.min_rating,
    filters.max_delivery_fee !== undefined
      ? String(filters.max_delivery_fee)
      : undefined,
    filters.order_type,
    filters.sort,
  ].filter(Boolean).length;

  const updateFilter = (
    key: keyof SearchFilterState,
    value: string | number | undefined,
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter icon + label */}
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">{t("filters.title")}</span>
        </div>

        {/* Order type toggle */}
        <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
          <button
            onClick={() => updateFilter("order_type", undefined)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              !filters.order_type
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("filters.all")}
          </button>
          <button
            onClick={() => updateFilter("order_type", "delivery")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filters.order_type === "delivery"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("filters.delivery")}
          </button>
          <button
            onClick={() => updateFilter("order_type", "pickup")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filters.order_type === "pickup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("filters.pickup")}
          </button>
        </div>

        {/* Cuisine filter */}
        <Select
          value={filters.cuisine_id ?? "all"}
          onValueChange={(v) =>
            updateFilter("cuisine_id", v === "all" ? undefined : v)
          }
        >
          <SelectTrigger className="h-8 w-auto min-w-[140px] text-xs">
            <SelectValue placeholder={t("filters.allCuisines")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.allCuisines")}</SelectItem>
            {cuisines.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rating filter */}
        <Select
          value={filters.min_rating ? String(filters.min_rating) : "any"}
          onValueChange={(v) =>
            updateFilter("min_rating", v === "any" ? undefined : Number(v))
          }
        >
          <SelectTrigger className="h-8 w-auto min-w-[100px] text-xs">
            <SelectValue placeholder={t("filters.anyRating")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("filters.anyRating")}</SelectItem>
            {RATING_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Max delivery fee */}
        <Select
          value={
            filters.max_delivery_fee !== undefined
              ? String(filters.max_delivery_fee)
              : "any"
          }
          onValueChange={(v) =>
            updateFilter(
              "max_delivery_fee",
              v === "any" ? undefined : Number(v),
            )
          }
        >
          <SelectTrigger className="h-8 w-auto min-w-[110px] text-xs">
            <SelectValue placeholder={t("filters.anyFee")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t("filters.anyFee")}</SelectItem>
            {DELIVERY_FEE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                ≤ {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sort ?? "relevance"}
          onValueChange={(v) =>
            updateFilter("sort", v === "relevance" ? undefined : v)
          }
        >
          <SelectTrigger className="h-8 w-auto min-w-[140px] text-xs">
            <SelectValue placeholder={t("filters.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">
              {t("filters.sortOptions.relevance")}
            </SelectItem>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(`filters.sortOptions.${opt.key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Active filter count + clear */}
        {activeCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {t("filters.activeFilters", { count: activeCount })}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
            >
              <X className="h-3 w-3" />
              {t("filters.clearFilters")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
