import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface CartEmptyProps {
  compact?: boolean;
}

export function CartEmpty({ compact = false }: CartEmptyProps) {
  const { t } = useTranslation("cart");

  if (compact) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <ShoppingBag className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm font-medium text-muted-foreground">
          {t("sidebar.emptyHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        {t("empty.title")}
      </h2>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {t("empty.description")}
      </p>
      <Button asChild>
        <Link to="/restaurants">{t("empty.browseRestaurants")}</Link>
      </Button>
    </div>
  );
}
