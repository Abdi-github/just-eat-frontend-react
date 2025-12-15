import { useTranslation } from "react-i18next";
import { Flame, Leaf, Star as StarIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { formatCHF } from "@/shared/utils/formatters";
import type { MenuItem as MenuItemType } from "../restaurants.types";

interface MenuItemProps {
  item: MenuItemType;
  onItemClick: (item: MenuItemType) => void;
}

export function MenuItem({ item, onItemClick }: MenuItemProps) {
  const { t } = useTranslation("restaurants");

  const isDisabled = !item.is_available;

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onItemClick(item)}
      disabled={isDisabled}
      className={cn(
        "flex w-full gap-4 rounded-lg border border-border/60 p-3 text-left transition-all",
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-primary/30 hover:shadow-sm",
      )}
    >
      {/* Text content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <h4 className="text-sm font-semibold text-foreground line-clamp-1">
            {item.name}
          </h4>
          {item.is_popular && (
            <Badge
              variant="secondary"
              className="shrink-0 bg-warning/10 text-warning text-[10px] px-1.5 py-0"
            >
              <StarIcon className="mr-0.5 h-2.5 w-2.5 fill-warning" />
              {t("detail.popular")}
            </Badge>
          )}
        </div>

        {item.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Dietary flags */}
        {item.dietary_flags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {item.dietary_flags.map((flag) => (
              <Badge
                key={flag}
                variant="outline"
                className="text-[10px] px-1.5 py-0 font-normal"
              >
                {flag === "vegan" || flag === "vegetarian" ? (
                  <Leaf className="mr-0.5 h-2.5 w-2.5 text-success" />
                ) : flag === "spicy" ? (
                  <Flame className="mr-0.5 h-2.5 w-2.5 text-error" />
                ) : null}
                {t(`dietaryLabels.${flag}`, { defaultValue: flag })}
              </Badge>
            ))}
          </div>
        )}

        {/* Price */}
        <p className="mt-2 text-sm font-bold text-foreground">
          {formatCHF(item.price)}
        </p>

        {isDisabled && (
          <span className="mt-1 text-xs font-medium text-error">
            {t("detail.soldOut")}
          </span>
        )}
      </div>

      {/* Image */}
      {item.image_url && (
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
    </button>
  );
}
