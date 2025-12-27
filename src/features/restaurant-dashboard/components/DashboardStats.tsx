import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatCHF } from "@/shared/utils/formatters";
import type { DashboardOverview } from "../restaurant-dashboard.types";
import {
  ShoppingBag,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Star,
  MessageSquare,
} from "lucide-react";

interface DashboardStatsProps {
  overview: DashboardOverview | undefined;
  isLoading: boolean;
}

export function DashboardStats({ overview, isLoading }: DashboardStatsProps) {
  const { t } = useTranslation("restaurant-dashboard");

  const stats = [
    {
      label: t("dashboard.totalOrders"),
      value: overview?.total_orders ?? 0,
      icon: ShoppingBag,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: t("dashboard.deliveredOrders"),
      value: overview?.delivered_orders ?? 0,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: t("dashboard.cancelledOrders"),
      value: overview?.cancelled_orders ?? 0,
      icon: XCircle,
      color: "text-error",
      bgColor: "bg-error/10",
    },
    {
      label: t("dashboard.totalRevenue"),
      value: formatCHF(overview?.total_revenue ?? 0),
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
      isFormatted: true,
    },
    {
      label: t("dashboard.avgOrderValue"),
      value: formatCHF(overview?.avg_order_value ?? 0),
      icon: TrendingUp,
      color: "text-info",
      bgColor: "bg-info/10",
      isFormatted: true,
    },
    {
      label: t("dashboard.avgRating"),
      value: overview?.avg_rating?.toFixed(1) ?? "0.0",
      icon: Star,
      color: "text-warning",
      bgColor: "bg-warning/10",
      isFormatted: true,
    },
    {
      label: t("dashboard.reviewCount"),
      value: overview?.review_count ?? 0,
      icon: MessageSquare,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {stat.isFormatted ? stat.value : stat.value.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
