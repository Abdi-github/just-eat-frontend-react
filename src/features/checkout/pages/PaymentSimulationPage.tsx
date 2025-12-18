import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Smartphone,
  Landmark,
  CheckCircle2,
  XCircle,
  Loader2,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { formatCHF } from "@/shared/utils/formatters";
import { useSimulateConfirmPaymentMutation } from "../checkout.api";

type Provider = "twint" | "postfinance";

const PROVIDER_CONFIG: Record<
  Provider,
  {
    name: string;
    icon: typeof Smartphone;
    bgColor: string;
    textColor: string;
    accentColor: string;
    borderColor: string;
    logoText: string;
    description: string;
    sessionMinutes: number;
  }
> = {
  twint: {
    name: "TWINT",
    icon: Smartphone,
    bgColor: "bg-[#000000]",
    textColor: "text-white",
    accentColor: "bg-[#00a0e2]",
    borderColor: "border-[#00a0e2]",
    logoText: "TWINT",
    description: "sandbox.twintDescription",
    sessionMinutes: 5,
  },
  postfinance: {
    name: "PostFinance",
    icon: Landmark,
    bgColor: "bg-[#ffcc00]",
    textColor: "text-[#1a1a1a]",
    accentColor: "bg-[#ffcc00]",
    borderColor: "border-[#ffcc00]",
    logoText: "PostFinance",
    description: "sandbox.postfinanceDescription",
    sessionMinutes: 15,
  },
};

export function PaymentSimulationPage() {
  const { provider, txnId } = useParams<{
    provider: string;
    txnId: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation("checkout");

  const orderId = searchParams.get("orderId") || "";
  const amount = searchParams.get("amount") || "0";
  const cancelUrl = searchParams.get("cancelUrl") || "/checkout";

  const [status, setStatus] = useState<
    "idle" | "processing" | "success" | "error" | "expired"
  >("idle");
  const [countdown, setCountdown] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");

  const [simulateConfirm, { isLoading }] =
    useSimulateConfirmPaymentMutation();

  const config =
    PROVIDER_CONFIG[(provider as Provider) || "twint"] || PROVIDER_CONFIG.twint;

  // Initialize countdown timer
  useEffect(() => {
    setCountdown(config.sessionMinutes * 60);
  }, [config.sessionMinutes]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0 || status !== "idle") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, status]);

  const formatCountdown = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleApprove = async () => {
    if (!txnId || !provider) return;

    setStatus("processing");

    try {
      await simulateConfirm({
        provider: provider as Provider,
        transactionId: txnId,
      }).unwrap();

      setStatus("success");

      // Redirect to order confirmation after brief success animation
      setTimeout(() => {
        navigate(`/order-confirmation/${orderId}`, { replace: true });
      }, 1500);
    } catch (err: unknown) {
      setStatus("error");
      const apiErr = err as {
        data?: { error?: { message?: string }; message?: string };
      };
      setErrorMessage(
        apiErr?.data?.error?.message ||
          apiErr?.data?.message ||
          t("sandbox.confirmError"),
      );
    }
  };

  const handleCancel = () => {
    navigate(cancelUrl, { replace: true });
  };

  const handleRetry = () => {
    setStatus("idle");
    setErrorMessage("");
    setCountdown(config.sessionMinutes * 60);
  };

  // Invalid provider guard
  if (!provider || !["twint", "postfinance"].includes(provider)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <AlertTriangle className="mx-auto h-16 w-16 text-warning" />
          <h2 className="mt-4 text-xl font-bold">
            {t("sandbox.invalidProvider")}
          </h2>
          <Button className="mt-6" onClick={() => navigate("/checkout")}>
            {t("sandbox.backToCheckout")}
          </Button>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-muted to-muted/50 p-4">
      {/* Sandbox notice banner */}
      <div className="mb-4 w-full max-w-md rounded-lg border border-warning/50 bg-warning/10 px-4 py-2 text-center text-sm text-warning">
        <AlertTriangle className="mr-1 inline h-4 w-4" />
        {t("sandbox.notice")}
      </div>

      {/* Payment card */}
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Provider header */}
        <div
          className={`${config.bgColor} ${config.textColor} px-6 py-8 text-center`}
        >
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <Icon className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-bold">{config.logoText}</h1>
          <p className="mt-1 text-sm opacity-80">{t(config.description)}</p>
        </div>

        {/* Payment details */}
        <div className="p-6">
          {/* Amount */}
          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("sandbox.amountToPay")}
            </p>
            <p className="mt-1 text-4xl font-bold text-foreground">
              {formatCHF(parseFloat(amount))}
            </p>
          </div>

          <Separator className="my-4" />

          {/* Order info */}
          <div className="mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("sandbox.merchant")}
              </span>
              <span className="font-medium">just-eat.ch</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("sandbox.orderId")}
              </span>
              <span className="font-mono text-xs">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("sandbox.transactionId")}
              </span>
              <span className="font-mono text-xs">{txnId}</span>
            </div>
          </div>

          {/* Session timer */}
          {status === "idle" && (
            <div className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {t("sandbox.expiresIn")}{" "}
                <span className={countdown < 60 ? "font-bold text-error" : "font-medium"}>
                  {formatCountdown(countdown)}
                </span>
              </span>
            </div>
          )}

          {/* Status-specific content */}
          {status === "idle" && (
            <div className="space-y-3">
              <Button
                className={`w-full ${config.accentColor} hover:opacity-90 ${
                  provider === "postfinance"
                    ? "text-[#1a1a1a]"
                    : "text-white"
                }`}
                size="lg"
                onClick={handleApprove}
                disabled={isLoading}
              >
                <Shield className="mr-2 h-5 w-5" />
                {t("sandbox.approvePayment")}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {t("sandbox.cancelPayment")}
              </Button>
            </div>
          )}

          {status === "processing" && (
            <div className="py-8 text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 font-medium">{t("sandbox.processing")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("sandbox.processingDesc")}
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <p className="mt-4 text-lg font-bold text-success">
                {t("sandbox.paymentApproved")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("sandbox.redirecting")}
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
                <XCircle className="h-10 w-10 text-error" />
              </div>
              <p className="mt-4 font-bold text-error">
                {t("sandbox.paymentFailed")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {errorMessage}
              </p>
              <div className="mt-6 space-y-2">
                <Button className="w-full" onClick={handleRetry}>
                  {t("sandbox.tryAgain")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCancel}
                >
                  {t("sandbox.backToCheckout")}
                </Button>
              </div>
            </div>
          )}

          {status === "expired" && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
                <Clock className="h-10 w-10 text-warning" />
              </div>
              <p className="mt-4 font-bold text-warning">
                {t("sandbox.sessionExpired")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("sandbox.sessionExpiredDesc")}
              </p>
              <Button className="mt-6 w-full" onClick={handleCancel}>
                {t("sandbox.backToCheckout")}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-muted/30 px-6 py-3 text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            {t("sandbox.securedBy", { provider: config.name })}
          </div>
          <Badge variant="outline" className="mt-1 text-xs">
            {t("sandbox.sandboxMode")}
          </Badge>
        </div>
      </div>
    </div>
  );
}
