import { useTranslation } from "react-i18next";
import {
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  Check,
} from "lucide-react";
import type { PaymentMethod } from "../checkout.types";

interface PaymentMethodsProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  icon: typeof CreditCard;
  labelKey: string;
  descKey: string;
}[] = [
  {
    value: "card",
    icon: CreditCard,
    labelKey: "payment.methods.card",
    descKey: "payment.methods.cardDesc",
  },
  {
    value: "twint",
    icon: Smartphone,
    labelKey: "payment.methods.twint",
    descKey: "payment.methods.twintDesc",
  },
  {
    value: "postfinance",
    icon: Landmark,
    labelKey: "payment.methods.postfinance",
    descKey: "payment.methods.postfinanceDesc",
  },
  {
    value: "cash",
    icon: Banknote,
    labelKey: "payment.methods.cash",
    descKey: "payment.methods.cashDesc",
  },
];

export function PaymentMethods({ selected, onSelect }: PaymentMethodsProps) {
  const { t } = useTranslation("checkout");

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <CreditCard className="h-5 w-5 text-primary" />
        {t("payment.title")}
      </h3>

      <div className="grid gap-3">
        {PAYMENT_OPTIONS.map(({ value, icon: Icon, labelKey, descKey }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
              selected === value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                selected === value
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{t(labelKey)}</p>
              <p className="text-sm text-muted-foreground">{t(descKey)}</p>
            </div>
            {selected === value && <Check className="h-5 w-5 text-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
}
