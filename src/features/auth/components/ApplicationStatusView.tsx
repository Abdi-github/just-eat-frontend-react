import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Store,
  Bike,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useGetApplicationStatusQuery } from "../auth.api";
import { useAuth } from "@/shared/hooks/useAuth";

const STATUS_CONFIG = {
  none: {
    icon: AlertCircle,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  pending_approval: {
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  approved: {
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  rejected: {
    icon: XCircle,
    color: "text-error",
    bgColor: "bg-error/10",
  },
} as const;

export function ApplicationStatusView() {
  const { t } = useTranslation(["auth", "common"]);
  const { isAuthenticated } = useAuth();
  const {
    data: statusData,
    isLoading,
    isError,
  } = useGetApplicationStatusQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-secondary">
          {t("auth:applicationStatus.loginRequired")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth:applicationStatus.loginRequiredDesc")}
        </p>
        <Button asChild className="mt-6">
          <Link to="/login">{t("common:nav.login")}</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !statusData) {
    return (
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-error" />
        <h2 className="text-xl font-semibold text-secondary">
          {t("auth:applicationStatus.errorTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth:applicationStatus.errorDesc")}
        </p>
      </div>
    );
  }

  const { application_status, application_type, application_rejection_reason, restaurant } =
    statusData.data;

  // If no application was submitted
  if (application_status === "none") {
    return (
      <div className="mx-auto max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-secondary">
          {t("auth:applicationStatus.noApplication")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth:applicationStatus.noApplicationDesc")}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link to="/partner">{t("common:nav.partnerWithUs")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/become-courier">{t("common:nav.becomeCourier")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[application_status];
  const StatusIcon = config.icon;
  const TypeIcon = application_type === "restaurant_owner" ? Store : Bike;

  return (
    <div className="mx-auto max-w-lg">
      <div className="text-center">
        <div
          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${config.bgColor}`}
        >
          <StatusIcon className={`h-10 w-10 ${config.color}`} />
        </div>
        <h1 className="text-2xl font-bold text-secondary">
          {t("auth:applicationStatus.title")}
        </h1>
      </div>

      <div className="mt-8 space-y-6">
        {/* Status Card */}
        <div className="rounded-lg border border-border p-6">
          <div className="flex items-center gap-3">
            <TypeIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {application_type === "restaurant_owner"
                ? t("auth:applicationStatus.typeRestaurant")
                : t("auth:applicationStatus.typeCourier")}
            </span>
          </div>

          <div className="mt-4">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${config.bgColor} ${config.color}`}
            >
              <StatusIcon className="h-4 w-4" />
              {t(`auth:applicationStatus.status.${application_status}`)}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {t(`auth:applicationStatus.statusDesc.${application_status}`)}
          </p>

          {/* Rejection reason */}
          {application_status === "rejected" &&
            application_rejection_reason && (
              <div className="mt-4 rounded-md bg-error/5 p-4">
                <h3 className="text-sm font-medium text-error">
                  {t("auth:applicationStatus.rejectionReason")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {application_rejection_reason}
                </p>
              </div>
            )}

          {/* Restaurant info for approved owners */}
          {application_status === "approved" &&
            application_type === "restaurant_owner" &&
            restaurant && (
              <div className="mt-4 rounded-md bg-success/5 p-4">
                <h3 className="text-sm font-medium text-success">
                  {t("auth:applicationStatus.restaurantCreated")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {restaurant.name}
                </p>
                <Button asChild size="sm" className="mt-3">
                  <Link to="/restaurant/dashboard">
                    {t("auth:applicationStatus.goToDashboard")}
                  </Link>
                </Button>
              </div>
            )}

          {/* Approved courier */}
          {application_status === "approved" &&
            application_type === "courier" && (
              <div className="mt-4 rounded-md bg-success/5 p-4">
                <h3 className="text-sm font-medium text-success">
                  {t("auth:applicationStatus.courierApproved")}
                </h3>
                <Button asChild size="sm" className="mt-3">
                  <Link to="/courier/dashboard">
                    {t("auth:applicationStatus.goToCourierDashboard")}
                  </Link>
                </Button>
              </div>
            )}
        </div>

        {/* Pending: what happens next */}
        {application_status === "pending_approval" && (
          <div className="rounded-lg border border-border bg-muted/50 p-6">
            <h3 className="font-semibold text-secondary">
              {t("auth:applicationStatus.whatNext")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                  1
                </span>
                {t("auth:applicationStatus.step1")}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                  2
                </span>
                {t("auth:applicationStatus.step2")}
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                  3
                </span>
                {t("auth:applicationStatus.step3")}
              </li>
            </ul>
          </div>
        )}

        <div className="text-center">
          <Button asChild variant="outline">
            <Link to="/">{t("auth:applicationStatus.backToHome")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
