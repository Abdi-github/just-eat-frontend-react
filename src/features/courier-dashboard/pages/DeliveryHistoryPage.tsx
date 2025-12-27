import { useState } from "react";
import { useTranslation } from "react-i18next";
import { History, Filter, PackageOpen } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useGetDeliveryHistoryQuery } from "../courier-dashboard.api";
import { DeliveryHistoryCard } from "../components/DeliveryHistoryCard";
import type {
  DeliveryHistoryParams,
  DeliveryStatus,
} from "../courier-dashboard.types";

const filterableStatuses: DeliveryStatus[] = [
  "DELIVERED",
  "CANCELLED",
  "FAILED",
];

export function DeliveryHistoryPage() {
  const { t } = useTranslation("courier-dashboard");

  const [params, setParams] = useState<DeliveryHistoryParams>({
    page: 1,
    limit: 20,
    sort: "-created_at",
  });
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const { data, isLoading, isFetching } = useGetDeliveryHistoryQuery(params);

  const deliveries = data?.data ?? [];
  const meta = data?.meta;

  const handleApplyFilters = () => {
    setParams({
      page: 1,
      limit: 20,
      sort: params.sort,
      ...(filterStatus && { status: filterStatus as DeliveryStatus }),
      ...(filterDateFrom && { date_from: filterDateFrom }),
      ...(filterDateTo && { date_to: filterDateTo }),
    });
  };

  const handleResetFilters = () => {
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setParams({ page: 1, limit: 20, sort: "-created_at" });
  };

  const handleSortChange = (value: string) => {
    setParams((prev) => ({ ...prev, sort: value, page: 1 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("history.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("history.subtitle")}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Sort */}
          <Select value={params.sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t("history.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-created_at">{t("history.newest")}</SelectItem>
              <SelectItem value="created_at">{t("history.oldest")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter size={14} className="mr-2" />
                {t("history.filters")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">{t("history.status")}</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t("history.allStatuses")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("history.allStatuses")}
                      </SelectItem>
                      {filterableStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {t(`statuses.${s}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">{t("history.dateFrom")}</Label>
                  <Input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">{t("history.dateTo")}</Label>
                  <Input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleApplyFilters}
                    className="flex-1"
                  >
                    {t("history.apply")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetFilters}
                    className="flex-1"
                  >
                    {t("history.reset")}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && deliveries.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <History size={24} className="text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-medium">
            {t("history.noHistory")}
          </h3>
          <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
            {t("history.noHistoryDesc")}
          </p>
        </div>
      )}

      {/* Delivery list */}
      {!isLoading && deliveries.length > 0 && (
        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <DeliveryHistoryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1 || isFetching}
            onClick={() =>
              setParams((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))
            }
          >
            ←
          </Button>
          <span className="text-sm text-muted-foreground">
            {meta.page} / {meta.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.pages || isFetching}
            onClick={() =>
              setParams((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))
            }
          >
            →
          </Button>
        </div>
      )}
    </div>
  );
}
