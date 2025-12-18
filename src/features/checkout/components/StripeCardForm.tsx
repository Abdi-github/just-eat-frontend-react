import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatCHF } from "@/shared/utils/formatters";

interface StripeCardFormProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function StripeCardForm({
  orderId,
  amount,
  onSuccess: _onSuccess,
  onError,
}: StripeCardFormProps) {
  const { t } = useTranslation("checkout");
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation/${orderId}`,
      },
    });

    // If we reach here, there was an error (successful payment redirects away)
    if (error) {
      const msg =
        error.type === "card_error" || error.type === "validation_error"
          ? error.message || t("stripe.genericError")
          : t("stripe.genericError");
      setErrorMessage(msg);
      onError(msg);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Secure badge */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-success" />
        {t("stripe.securePayment")}
      </div>

      {/* Stripe Payment Element */}
      <div className="rounded-lg border bg-white p-4">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
          {errorMessage}
        </div>
      )}

      {/* Pay button */}
      <Button
        type="submit"
        size="lg"
        className="w-full text-base"
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t("stripe.processing")}
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            {t("stripe.payNow", { amount: formatCHF(amount) })}
          </>
        )}
      </Button>

      {/* Stripe branding */}
      <p className="text-center text-xs text-muted-foreground">
        {t("stripe.poweredBy")}
      </p>
    </form>
  );
}
