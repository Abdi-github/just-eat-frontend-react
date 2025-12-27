import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bike, Filter, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  useGetAvailableDeliveriesQuery,
  useAcceptDeliveryMutation,
} from "../courier-dashboard.api";
import { AvailableDeliveryCard } from "../components/AvailableDeliveryCard";
import type { AvailableDeliveriesParams } from "../courier-dashboard.types";

export function CourierDashboardPage() {
  const { t } = useTranslation("courier-dashboard");

  const [params, setParams] = useState<AvailableDeliveriesParams>({
    page: 1,
    limit: 20,
  });
  const [filterCity, setFilterCity] = useState("");
  const [filterPostal, setFilterPostal] = useState("");

  const { data, isLoading, isFetching } =
    useGetAvailableDeliveriesQuery(params);
  const [acceptDelivery, { isLoading: isAccepting }] =
    useAcceptDeliveryMutation();

  const deliveries = data?.data ?? [];
  const meta = data?.meta;

  const handleAccept = async (id: string) => {
    try {
      await acceptDelivery(id).unwrap();
      toast.success(t("success.accepted"));
    } catch {
      toast.error(t("errors.acceptFailed"));
    }
  };

  const handleApplyFilters = () => {
    setParams({
      page: 1,
      limit: 20,
      ...(filterCity && { city: filterCity }),
      ...(filterPostal && { postal_code: filterPostal }),
    });
  };

  const handleResetFilters = () => {
    setFilterCity("");
    setFilterPostal("");
    setParams({ page: 1, limit: 20 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("available.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("available.subtitle")}
          </p>
        </div>

        {/* Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter size={14} className="mr-2" />
              {t("available.filters")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="end">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">{t("available.city")}</Label>
                <Input
                  placeholder={t("available.allCities")}
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">{t("available.postalCode")}</Label>
                <Input
                  placeholder="8000"
                  value={filterPostal}
                  onChange={(e) => setFilterPostal(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleApplyFilters}
                  className="flex-1"
                >
                  {t("available.apply")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetFilters}
                  className="flex-1"
                >
                  {t("available.reset")}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && deliveries.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <PackageOpen size={24} className="text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-medium">
            {t("available.noDeliveries")}
          </h3>
          <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
            {t("available.noDeliveriesDesc")}
          </p>
        </div>
      )}

      {/* Delivery grid */}
      {!isLoading && deliveries.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deliveries.map((delivery) => (
            <AvailableDeliveryCard
              key={delivery.id}
              delivery={delivery}
              onAccept={handleAccept}
              isAccepting={isAccepting}
            />
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

      {/* Fetching indicator */}
      {isFetching && !isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Bike size={16} className="animate-bounce" />
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
}
