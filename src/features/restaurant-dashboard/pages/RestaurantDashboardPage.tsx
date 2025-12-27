import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import { DashboardStats } from "../components/DashboardStats";
import { ActiveOrders } from "../components/ActiveOrders";
import { useRestaurant } from "../hooks/useRestaurant";
import {
  useGetDashboardAnalyticsQuery,
  useGetActiveRestaurantOrdersQuery,
  useUpdateRestaurantOrderStatusMutation,
} from "../restaurant-dashboard.api";
import type {
  AnalyticsPreset,
  RestaurantOrderStatus,
} from "../restaurant-dashboard.types";

const presets: AnalyticsPreset[] = [
  "today",
  "yesterday",
  "this_week",
  "this_month",
  "last_7_days",
  "last_30_days",
  "last_90_days",
  "this_year",
];

export function RestaurantDashboardPage() {
  const { t } = useTranslation("restaurant-dashboard");
  const { restaurantId } = useRestaurant();
  const [preset, setPreset] = useState<AnalyticsPreset>("last_7_days");

  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetDashboardAnalyticsQuery(
      { restaurantId: restaurantId!, params: { preset } },
      { skip: !restaurantId },
    );

  const { data: activeOrdersData, isLoading: ordersLoading } =
    useGetActiveRestaurantOrdersQuery(restaurantId!, {
      skip: !restaurantId,
      pollingInterval: 30000, // Poll every 30s for live updates
    });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateRestaurantOrderStatusMutation();

  const handleStatusUpdate = async (
    orderId: string,
    status: RestaurantOrderStatus,
    rejectionReason?: string,
  ) => {
    if (!restaurantId) return;
    try {
      await updateStatus({
        restaurantId,
        orderId,
        body: { status, rejection_reason: rejectionReason },
      }).unwrap();
      toast.success(t("orders.statusUpdated"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  if (!restaurantId) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">{t("dashboard.noRestaurants")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with preset selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("dashboard.overview")}</h1>
        <Select
          value={preset}
          onValueChange={(val) => setPreset(val as AnalyticsPreset)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {presets.map((p) => (
              <SelectItem key={p} value={p}>
                {t(`dashboard.${p}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <DashboardStats
        overview={analyticsData?.data?.overview}
        isLoading={analyticsLoading}
      />

      {/* Active Orders */}
      <ActiveOrders
        orders={activeOrdersData?.data}
        isLoading={ordersLoading}
        onStatusUpdate={handleStatusUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
}
