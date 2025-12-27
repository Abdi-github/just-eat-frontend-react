import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Truck, ShoppingBag, Clock, MapPin } from "lucide-react";
import { formatCHF, formatDateTime } from "@/shared/utils/formatters";
import { useRestaurant } from "../hooks/useRestaurant";
import {
  useGetActiveRestaurantOrdersQuery,
  useGetRestaurantOrdersQuery,
  useUpdateRestaurantOrderStatusMutation,
} from "../restaurant-dashboard.api";
import type {
  RestaurantOrder,
  RestaurantOrderStatus,
} from "../restaurant-dashboard.types";

const STATUS_OPTIONS: RestaurantOrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "REJECTED",
  "PREPARING",
  "READY",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
];

const statusColors: Record<string, string> = {
  PLACED: "bg-info/10 text-info",
  ACCEPTED: "bg-primary/10 text-primary",
  REJECTED: "bg-error/10 text-error",
  PREPARING: "bg-warning/10 text-warning",
  READY: "bg-success/10 text-success",
  PICKED_UP: "bg-info/10 text-info",
  IN_TRANSIT: "bg-primary/10 text-primary",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-muted text-muted-foreground",
};

function getNextActions(status: RestaurantOrderStatus): Array<{
  nextStatus: RestaurantOrderStatus;
  labelKey: string;
  variant: "default" | "destructive" | "outline";
}> {
  switch (status) {
    case "PLACED":
      return [
        {
          nextStatus: "ACCEPTED",
          labelKey: "orders.accept",
          variant: "default",
        },
        {
          nextStatus: "REJECTED",
          labelKey: "orders.reject",
          variant: "destructive",
        },
      ];
    case "ACCEPTED":
      return [
        {
          nextStatus: "PREPARING",
          labelKey: "orders.startPreparing",
          variant: "default",
        },
      ];
    case "PREPARING":
      return [
        {
          nextStatus: "READY",
          labelKey: "orders.markReady",
          variant: "default",
        },
      ];
    case "READY":
      return [
        {
          nextStatus: "DELIVERED",
          labelKey: "orders.markDelivered",
          variant: "default",
        },
      ];
    default:
      return [];
  }
}

function OrderCard({
  order,
  t,
  onStatusUpdate,
  isUpdating,
}: {
  order: RestaurantOrder;
  t: (key: string, options?: Record<string, unknown>) => string;
  onStatusUpdate: (
    orderId: string,
    status: RestaurantOrderStatus,
    rejectionReason?: string,
  ) => void;
  isUpdating: boolean;
}) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const actions = getNextActions(order.status);

  const handleReject = () => {
    onStatusUpdate(order.id, "REJECTED", rejectionReason);
    setShowRejectDialog(false);
    setRejectionReason("");
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Order info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  {order.order_type === "delivery" ? (
                    <Truck size={18} className="text-primary" />
                  ) : (
                    <ShoppingBag size={18} className="text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-bold">
                    {t("orders.orderNumber", { number: order.order_number })}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={12} />
                    {formatDateTime(order.placed_at)}
                  </div>
                </div>
                <Badge className={statusColors[order.status] ?? ""}>
                  {t(`orderStatus.${order.status}`)}
                </Badge>
                <Badge variant="outline">
                  {order.order_type === "delivery"
                    ? t("orders.delivery")
                    : t("orders.pickup")}
                </Badge>
              </div>

              {/* Customer */}
              {order.customer && (
                <p className="text-sm">
                  <span className="text-muted-foreground">
                    {t("orders.customer")}:
                  </span>{" "}
                  {order.customer.first_name} {order.customer.last_name}
                  {order.customer.phone && ` · ${order.customer.phone}`}
                </p>
              )}

              {/* Delivery address */}
              {order.delivery_address && order.order_type === "delivery" && (
                <div className="flex items-start gap-1.5 text-sm">
                  <MapPin
                    size={14}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <span>
                    {order.delivery_address.street}{" "}
                    {order.delivery_address.street_number},{" "}
                    {order.delivery_address.postal_code}{" "}
                    {order.delivery_address.city}
                  </span>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  {t("orders.items")}:
                </p>
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}× {item.name}
                      </span>
                      <span className="text-muted-foreground">
                        {formatCHF(item.total_price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.special_instructions && (
                <p className="rounded-md bg-muted p-2 text-sm">
                  <span className="font-medium">
                    {t("orders.specialInstructions")}:
                  </span>{" "}
                  {order.special_instructions}
                </p>
              )}

              <Separator />

              {/* Totals */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("orders.subtotal")}
                  </span>
                  <span>{formatCHF(order.subtotal)}</span>
                </div>
                {order.delivery_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("orders.deliveryFee")}
                    </span>
                    <span>{formatCHF(order.delivery_fee)}</span>
                  </div>
                )}
                {order.tip > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("orders.tip")}
                    </span>
                    <span>{formatCHF(order.tip)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>{t("orders.discount")}</span>
                    <span>-{formatCHF(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>{t("orders.total")}</span>
                  <span>{formatCHF(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex shrink-0 gap-2 lg:flex-col">
                {actions.map((action) =>
                  action.nextStatus === "REJECTED" ? (
                    <Button
                      key={action.nextStatus}
                      size="sm"
                      variant={action.variant}
                      disabled={isUpdating}
                      onClick={() => setShowRejectDialog(true)}
                    >
                      {t(action.labelKey)}
                    </Button>
                  ) : (
                    <Button
                      key={action.nextStatus}
                      size="sm"
                      variant={action.variant}
                      disabled={isUpdating}
                      onClick={() =>
                        onStatusUpdate(order.id, action.nextStatus)
                      }
                    >
                      {t(action.labelKey)}
                    </Button>
                  ),
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rejection dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("orders.rejectOrder")}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={t("orders.rejectionReasonPlaceholder")}
            rows={3}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim() || isUpdating}
            >
              {t("orders.rejectOrder")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function RestaurantOrdersPage() {
  const { t } = useTranslation("restaurant-dashboard");
  const { restaurantId } = useRestaurant();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: activeData, isLoading: activeLoading } =
    useGetActiveRestaurantOrdersQuery(restaurantId!, {
      skip: !restaurantId,
      pollingInterval: 15000,
    });

  const { data: allData, isLoading: allLoading } = useGetRestaurantOrdersQuery(
    {
      restaurantId: restaurantId!,
      params: {
        page,
        limit: 20,
        status:
          statusFilter !== "all"
            ? (statusFilter as RestaurantOrderStatus)
            : undefined,
        sort: "-placed_at",
      },
    },
    { skip: !restaurantId },
  );

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
      <h1 className="text-2xl font-bold">{t("orders.title")}</h1>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            {t("orders.activeOrders")}
            {activeData?.data && activeData.data.length > 0 && (
              <Badge
                variant="default"
                className="ml-2 h-5 w-5 justify-center rounded-full p-0 text-xs"
              >
                {activeData.data.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">{t("orders.allOrders")}</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-4">
          {activeLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : !activeData?.data || activeData.data.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {t("orders.noActiveOrders")}
                </p>
              </CardContent>
            </Card>
          ) : (
            activeData.data.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                t={t}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={isUpdating}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("orders.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("orders.allStatuses")}</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`orderStatus.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {allLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : !allData?.data || allData.data.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{t("orders.noOrders")}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {allData.data.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  t={t}
                  onStatusUpdate={handleStatusUpdate}
                  isUpdating={isUpdating}
                />
              ))}
              {/* Simple pagination */}
              {allData.meta && allData.meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!allData.meta.hasPrevPage}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ←
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page} / {allData.meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!allData.meta.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    →
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
