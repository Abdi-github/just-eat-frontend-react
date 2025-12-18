import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useGetOrderDetailQuery } from "../orders.api";
import { OrderTimeline } from "../components/OrderTimeline";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { DeliveryTracker } from "../components/DeliveryTracker";
import { formatDateTime } from "@/shared/utils/formatters";

export function OrderTrackingPage() {
  const { t } = useTranslation("orders");
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useGetOrderDetailQuery(id!, {
    skip: !id,
    pollingInterval: 15000, // Poll order status every 15s
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">{t("common:error.notFound")}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/account/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("detail.backToOrders")}
          </Link>
        </Button>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to={`/account/orders/${order.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">{t("tracking.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("tracking.orderNumber", { number: order.order_number })}
            </p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} className="text-sm" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Delivery tracker */}
        <div className="lg:col-span-2">
          <DeliveryTracker orderId={order.id} orderStatus={order.status} />
        </div>

        {/* Right: Timeline */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("detail.status")}</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline order={order} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
