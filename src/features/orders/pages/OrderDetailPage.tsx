import { useState } from "react";
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
import { ArrowLeft, Navigation, XCircle } from "lucide-react";
import { useGetOrderDetailQuery } from "../orders.api";
import { OrderDetailInfo } from "../components/OrderDetailInfo";
import { OrderItems } from "../components/OrderItems";
import { OrderTimeline } from "../components/OrderTimeline";
import { CancelOrderDialog } from "../components/CancelOrderDialog";

const cancellableStatuses = ["PLACED", "ACCEPTED"];
const trackableStatuses = [
  "ACCEPTED",
  "PREPARING",
  "READY",
  "PICKED_UP",
  "IN_TRANSIT",
];

export function OrderDetailPage() {
  const { t } = useTranslation("orders");
  const { id } = useParams<{ id: string }>();
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data, isLoading, isError } = useGetOrderDetailQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
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
  const canCancel = cancellableStatuses.includes(order.status);
  const canTrack =
    trackableStatuses.includes(order.status) && order.order_type === "delivery";

  return (
    <div className="space-y-6">
      {/* Back link + actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/account/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("detail.backToOrders")}
          </Link>
        </Button>

        <div className="flex gap-2">
          {canTrack && (
            <Button asChild size="sm">
              <Link to={`/account/orders/${order.id}/tracking`}>
                <Navigation className="mr-2 h-4 w-4" />
                {t("trackOrder")}
              </Link>
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {t("cancelOrder")}
            </Button>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Order info + items */}
        <div className="lg:col-span-2 space-y-6">
          <OrderDetailInfo order={order} />

          <Card>
            <CardContent className="p-6">
              <OrderItems order={order} />
            </CardContent>
          </Card>
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

      {/* Cancel dialog */}
      {canCancel && (
        <CancelOrderDialog
          orderId={order.id}
          open={cancelOpen}
          onOpenChange={setCancelOpen}
        />
      )}
    </div>
  );
}
