import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { ShoppingBag } from "lucide-react";
import { useGetMyOrdersQuery } from "../orders.api";
import { OrderList } from "../components/OrderList";
import type { OrderStatus } from "../orders.types";

type FilterStatus = "all" | "active" | "completed" | "cancelled";

const statusFilterMap: Record<FilterStatus, OrderStatus | undefined> = {
  all: undefined,
  active: undefined, // will use multiple statuses client-side
  completed: "DELIVERED",
  cancelled: "CANCELLED",
};

const activeStatuses: OrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "PICKED_UP",
  "IN_TRANSIT",
];

export function OrdersPage() {
  const { t } = useTranslation("orders");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sort, setSort] = useState("-created_at");

  // Build query params
  const queryParams = {
    page,
    limit: 10,
    sort,
    ...(filter === "completed" && { status: "DELIVERED" as OrderStatus }),
    ...(filter === "cancelled" && { status: "CANCELLED" as OrderStatus }),
  };

  const { data, isLoading, isFetching } = useGetMyOrdersQuery(queryParams);

  // Client-side filter for "active" since the API may not support multiple statuses
  let orders = data?.data ?? [];
  if (filter === "active") {
    orders = orders.filter((o) => activeStatuses.includes(o.status));
  }

  const pagination = data?.meta;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(["all", "active", "completed", "cancelled"] as FilterStatus[]).map(
            (f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
              >
                {t(`filters.${f}`)}
              </Button>
            ),
          )}
        </div>

        <Select
          value={sort}
          onValueChange={(v) => {
            setSort(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-created_at">{t("sort.newest")}</SelectItem>
            <SelectItem value="created_at">{t("sort.oldest")}</SelectItem>
            <SelectItem value="-total">{t("sort.highestTotal")}</SelectItem>
            <SelectItem value="total">{t("sort.lowestTotal")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Order list */}
      <OrderList orders={orders} isLoading={isLoading || isFetching} />

      {/* Empty state */}
      {!isLoading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">{t("noOrders")}</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {t("noOrdersDescription")}
          </p>
          <Button asChild className="mt-4">
            <Link to="/restaurants">{t("browseRestaurants")}</Link>
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <span key={p} className="flex items-center">
                    {showEllipsis && (
                      <PaginationItem>
                        <span className="px-2 text-muted-foreground">…</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setPage(p)}
                        isActive={p === page}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  </span>
                );
              })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
