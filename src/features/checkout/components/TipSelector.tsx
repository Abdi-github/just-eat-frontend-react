import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { formatCHF } from "@/shared/utils/formatters";

interface TipSelectorProps {
  value: number;
  onChange: (amount: number) => void;
}

const PRESET_AMOUNTS = [0, 2, 3, 5];

export function TipSelector({ value, onChange }: TipSelectorProps) {
  const { t } = useTranslation("checkout");
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handlePreset = (amount: number) => {
    setIsCustom(false);
    setCustomValue("");
    onChange(amount);
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    setCustomValue(value > 0 ? String(value) : "");
  };

  const handleCustomChange = (val: string) => {
    // Allow only numbers and one decimal point
    const cleaned = val.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    const formatted =
      parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;

    setCustomValue(formatted);
    const num = parseFloat(formatted);
    onChange(isNaN(num) ? 0 : Math.min(num, 100));
  };

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <Heart className="h-5 w-5 text-primary" />
        {t("tip.title")}
      </h3>
      <p className="text-sm text-muted-foreground">{t("tip.description")}</p>

      <div className="flex flex-wrap gap-2">
        {PRESET_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            type="button"
            variant={!isCustom && value === amount ? "default" : "outline"}
            size="sm"
            onClick={() => handlePreset(amount)}
            className="min-w-[4.5rem]"
          >
            {amount === 0 ? t("tip.noTip") : formatCHF(amount)}
          </Button>
        ))}
        <Button
          type="button"
          variant={isCustom ? "default" : "outline"}
          size="sm"
          onClick={handleCustomToggle}
        >
          {t("tip.custom")}
        </Button>
      </div>

      {isCustom && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">CHF</span>
          <Input
            type="text"
            inputMode="decimal"
            value={customValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="0.00"
            className="w-28"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
