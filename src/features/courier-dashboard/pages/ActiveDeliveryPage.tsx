import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PackageOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  useGetActiveDeliveryQuery,
  useUpdateDeliveryStatusMutation,
  useUpdateCourierLocationMutation,
} from "../courier-dashboard.api";
import { ActiveDeliveryDetails } from "../components/ActiveDeliveryDetails";
import type { CourierDeliveryStatusUpdate } from "../courier-dashboard.types";

export function ActiveDeliveryPage() {
  const { t } = useTranslation("courier-dashboard");
  const navigate = useNavigate();

  const { data, isLoading } = useGetActiveDeliveryQuery(undefined, {
    pollingInterval: 15_000, // Poll every 15s
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateDeliveryStatusMutation();

  const [updateLocation, { isLoading: isSendingLocation }] =
    useUpdateCourierLocationMutation();

  const delivery = data?.data ?? null;

  const handleUpdateStatus = async (status: CourierDeliveryStatusUpdate) => {
    if (!delivery) return;
    try {
      await updateStatus({
        id: delivery.id,
        body: { status },
      }).unwrap();
      toast.success(t("success.statusUpdated"));

      // If delivered or failed, redirect to history
      if (status === "DELIVERED" || status === "FAILED") {
        navigate("/courier/history");
      }
    } catch {
      toast.error(t("errors.updateFailed"));
    }
  };

  const handleSendLocation = () => {
    if (!delivery) return;

    if (!navigator.geolocation) {
      toast.error(t("active.locationError"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await updateLocation({
            id: delivery.id,
            body: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }).unwrap();
          toast.success(t("active.locationSent"));
        } catch {
          toast.error(t("errors.locationFailed"));
        }
      },
      () => {
        toast.error(t("active.locationError"));
      },
    );
  };

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    );
  }

  // No active delivery
  if (!delivery) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <PackageOpen size={28} className="text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">{t("active.noActive")}</h2>
        <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
          {t("active.noActiveDesc")}
        </p>
        <Button className="mt-6" onClick={() => navigate("/courier/dashboard")}>
          {t("active.goToAvailable")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          {t("active.title")}
        </h1>
        {delivery.order_number && (
          <span className="text-sm text-muted-foreground">
            — #{delivery.order_number}
          </span>
        )}
        {(isUpdating || isSendingLocation) && (
          <Loader2 size={16} className="animate-spin text-primary" />
        )}
      </div>

      <ActiveDeliveryDetails
        delivery={delivery}
        onUpdateStatus={handleUpdateStatus}
        onSendLocation={handleSendLocation}
        isUpdating={isUpdating}
        isSendingLocation={isSendingLocation}
      />
    </div>
  );
}
