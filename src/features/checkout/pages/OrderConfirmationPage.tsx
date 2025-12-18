import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useGetPaymentStatusQuery } from "../checkout.api";
import { formatCHF } from "@/shared/utils/formatters";
import { useAppDispatch } from "@/app/hooks";
import { clearCart } from "@/shared/state/cart.slice";
import dayjs from "dayjs";

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("checkout");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const cartClearedRef = useRef(false);

  // Stripe redirects back with these query params
  const redirectStatus = searchParams.get("redirect_status");

  // Clear the cart once when arriving at confirmation page
  useEffect(() => {
    if (!cartClearedRef.current) {
      dispatch(clearCart());
      cartClearedRef.current = true;
    }
  }, [dispatch]);

  const { data, isLoading, isError } = useGetPaymentStatusQuery(id!, {
    skip: !id,
    pollingInterval: 5000,
  });

  const payment = data?.data;
  const isPaid = payment?.status === "PAID";
  const isFailed =
    payment?.status === "FAILED" || redirectStatus === "failed";
  const isPending =
    !isPaid && !isFailed && (payment?.status === "PENDING" || payment?.status === "PROCESSING");

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="space-y-6 text-center">
          <Skeleton className="mx-auto h-20 w-20 rounded-full" />
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-4 w-48" />
          <Skeleton className="mx-auto h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-success" />
        <h1 className="mt-6 text-3xl font-bold">{t("confirmation.title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("confirmation.subtitle")}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => navigate("/account/orders")}>
            {t("confirmation.viewOrders")}
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            {t("confirmation.backHome")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        {/* Status icon */}
        {isPaid && (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
        )}
        {isPending && (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
            <Loader2 className="h-12 w-12 animate-spin text-warning" />
          </div>
        )}
        {isFailed && (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
            <CreditCard className="h-12 w-12 text-error" />
          </div>
        )}

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold">
          {isPaid && t("confirmation.title")}
          {isPending && t("confirmation.pendingTitle")}
          {isFailed && t("confirmation.failedTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isPaid && t("confirmation.subtitle")}
          {isPending && t("confirmation.pendingSubtitle")}
          {isFailed && t("confirmation.failedSubtitle")}
        </p>
      </div>

      {/* Order details card */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {/* Order ID */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("confirmation.orderId")}
            </span>
            <span className="font-mono font-medium">{payment.order_id}</span>
          </div>

          {/* Payment method */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              {t("confirmation.paymentMethod")}
            </span>
            <span className="font-medium capitalize">
              {payment.payment_method}
            </span>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("confirmation.amount")}
            </span>
            <span className="text-lg font-bold text-primary">
              {formatCHF(payment.amount)}
            </span>
          </div>

          {/* Payment status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("confirmation.paymentStatus")}
            </span>
            <Badge
              variant={
                isPaid ? "default" : isPending ? "secondary" : "destructive"
              }
            >
              {payment.status}
            </Badge>
          </div>

          <Separator />

          {/* Timestamp */}
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {t("confirmation.placedAt")}
            </span>
            <span>{dayjs(payment.created_at).format("DD.MM.YYYY HH:mm")}</span>
          </div>
        </div>
      </div>

      {/* Next steps */}
      {isPaid && (
        <div className="mt-6 rounded-xl border bg-muted/50 p-6">
          <h3 className="mb-3 font-semibold">{t("confirmation.nextSteps")}</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {t("confirmation.step1")}
            </li>
            <li className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {t("confirmation.step2")}
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {t("confirmation.step3")}
            </li>
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {isPaid && (
          <Button asChild size="lg">
            <Link to={`/account/orders/${payment.order_id}/tracking`}>
              <Truck className="mr-2 h-4 w-4" />
              {t("confirmation.trackOrder")}
            </Link>
          </Button>
        )}
        {isFailed && (
          <Button size="lg" onClick={() => navigate("/checkout")}>
            {t("confirmation.tryAgain")}
          </Button>
        )}
        <Button variant="outline" size="lg" asChild>
          <Link to="/account/orders">
            {t("confirmation.viewOrders")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="lg" onClick={() => navigate("/")}>
          {t("confirmation.backHome")}
        </Button>
      </div>
    </div>
  );
}
