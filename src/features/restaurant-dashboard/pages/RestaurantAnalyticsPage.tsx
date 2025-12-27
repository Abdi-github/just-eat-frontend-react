import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Star,
  Clock,
} from "lucide-react";
import { useRestaurant } from "../hooks/useRestaurant";
import {
  useGetDashboardAnalyticsQuery,
  useGetRevenueAnalyticsQuery,
  useGetTopItemsQuery,
} from "../restaurant-dashboard.api";
import type { AnalyticsPreset } from "../restaurant-dashboard.types";
import { formatCHF } from "@/shared/utils/formatters";

const presets: AnalyticsPreset[] = [
  "today",
  "yesterday",
  "last_7_days",
  "last_30_days",
  "this_month",
  "last_month",
  "this_year",
  "all_time",
];

export function RestaurantAnalyticsPage() {
  const { t } = useTranslation("restaurant-dashboard");
  const { restaurantId } = useRestaurant();
  const [period, setPeriod] = useState<AnalyticsPreset>("last_30_days");

  const { data: dashboardData, isLoading: dashLoading } =
    useGetDashboardAnalyticsQuery(
      { restaurantId: restaurantId!, preset: period },
      { skip: !restaurantId },
    );

  const { data: revenueData, isLoading: revLoading } =
    useGetRevenueAnalyticsQuery(
      { restaurantId: restaurantId!, preset: period },
      { skip: !restaurantId },
    );

  const { data: topItemsData, isLoading: topLoading } = useGetTopItemsQuery(
    { restaurantId: restaurantId!, preset: period, limit: 10 },
    { skip: !restaurantId },
  );

  const dashboard = dashboardData?.data;
  const revenue = revenueData?.data ?? [];
  const topItems = topItemsData?.data ?? [];

  if (!restaurantId) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("analytics.title")}</h1>
        <Select
          value={period}
          onValueChange={(v) => setPeriod(v as AnalyticsPreset)}
        >
          <SelectTrigger className="w-44">
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

      {/* Stats Cards */}
      {dashLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : dashboard ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t("analytics.totalRevenue")}
            value={formatCHF(dashboard.total_revenue ?? 0)}
            icon={<DollarSign size={20} />}
            color="bg-success/10 text-success"
          />
          <StatCard
            label={t("analytics.totalOrders")}
            value={String(dashboard.total_orders ?? 0)}
            icon={<ShoppingCart size={20} />}
            color="bg-primary/10 text-primary"
          />
          <StatCard
            label={t("analytics.avgOrderValue")}
            value={formatCHF(dashboard.avg_order_value ?? 0)}
            icon={<TrendingUp size={20} />}
            color="bg-info/10 text-info"
          />
          <StatCard
            label={t("analytics.avgRating")}
            value={`${(dashboard.avg_rating ?? 0).toFixed(1)} ★`}
            icon={<Star size={20} />}
            color="bg-warning/10 text-warning"
          />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart (Simple bar chart with CSS) */}
        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.revenueOverTime")}</CardTitle>
          </CardHeader>
          <CardContent>
            {revLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : revenue.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t("analytics.noData")}
              </p>
            ) : (
              <RevenueChart data={revenue} />
            )}
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.topItems")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : topItems.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t("analytics.noData")}
              </p>
            ) : (
              <div className="space-y-2">
                {topItems.map((item, idx) => (
                  <div
                    key={item.menu_item_id}
                    className="flex items-center justify-between rounded px-3 py-2 hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity_sold} {t("analytics.sold")}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {formatCHF(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional metrics */}
      {dashboard && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label={t("analytics.deliveredOrders")}
            value={String(dashboard.delivered_orders ?? 0)}
            icon={<TrendingUp size={20} />}
            color="bg-success/10 text-success"
          />
          <StatCard
            label={t("analytics.cancelledOrders")}
            value={String(dashboard.cancelled_orders ?? 0)}
            icon={<TrendingDown size={20} />}
            color="bg-error/10 text-error"
          />
          <StatCard
            label={t("analytics.reviewCount")}
            value={String(dashboard.review_count ?? 0)}
            icon={<Star size={20} />}
            color="bg-warning/10 text-warning"
          />
        </div>
      )}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Simple Revenue Bar Chart ─── */
function RevenueChart({
  data,
}: {
  data: { date: string; revenue: number; orders: number }[];
}) {
  const { t } = useTranslation("restaurant-dashboard");
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="space-y-1">
      {data.slice(-14).map((point) => (
        <div key={point.date} className="flex items-center gap-2">
          <span className="w-20 shrink-0 text-xs text-muted-foreground">
            {point.date}
          </span>
          <div className="relative h-6 flex-1 rounded bg-muted">
            <div
              className="absolute left-0 top-0 h-full rounded bg-primary/80 transition-all"
              style={{ width: `${(point.revenue / maxRevenue) * 100}%` }}
            />
            <span className="relative z-10 flex h-full items-center px-2 text-xs font-medium">
              {formatCHF(point.revenue)}
            </span>
          </div>
          <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
            {point.orders} {t("analytics.orders")}
          </span>
        </div>
      ))}
    </div>
  );
}
