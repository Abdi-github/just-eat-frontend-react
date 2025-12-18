import { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useAppSelector } from "@/app/hooks";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
);

interface StripeProviderProps {
  clientSecret: string;
  children: React.ReactNode;
}

export function StripeProvider({
  clientSecret,
  children,
}: StripeProviderProps) {
  const language = useAppSelector((state) => state.language.current);

  // Map app language to Stripe locale
  const stripeLocale = useMemo(() => {
    const localeMap: Record<string, string> = {
      en: "en",
      fr: "fr",
      de: "de",
      it: "it",
    };
    return (localeMap[language] || "en") as "en" | "fr" | "de" | "it";
  }, [language]);

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#ff8000",
          colorBackground: "#ffffff",
          colorText: "#2e3333",
          colorDanger: "#e4002b",
          fontFamily: "Inter, system-ui, sans-serif",
          spacingUnit: "4px",
          borderRadius: "8px",
        },
      },
      locale: stripeLocale,
    }),
    [clientSecret, stripeLocale],
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
