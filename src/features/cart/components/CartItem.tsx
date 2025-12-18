import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formatCHF } from "@/shared/utils/formatters";
import { useCart } from "@/shared/hooks/useCart";

interface CartItemData {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  special_instructions?: string;
  options?: { name: string; price: number }[];
  image_url?: string;
}

interface CartItemProps {
  item: CartItemData;
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { t } = useTranslation("cart");
  const { updateQuantity, removeItem } = useCart();

  const optionsTotal =
    item.options?.reduce((sum, opt) => sum + opt.price, 0) ?? 0;
  const itemTotal = (item.price + optionsTotal) * item.quantity;

  const handleIncrement = () => {
    updateQuantity({
      menu_item_id: item.menu_item_id,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrement = () => {
    if (item.quantity <= 1) {
      removeItem(item.menu_item_id);
    } else {
      updateQuantity({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity - 1,
      });
    }
  };

  const handleRemove = () => {
    removeItem(item.menu_item_id);
  };

  if (compact) {
    return (
      <div className="flex items-start gap-2 py-2">
        {/* Quantity badge */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-semibold text-primary">
          {item.quantity}×
        </span>

        {/* Item details */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {item.name}
          </p>
          {item.options && item.options.length > 0 && (
            <p className="truncate text-xs text-muted-foreground">
              {item.options.map((o) => o.name).join(", ")}
            </p>
          )}
        </div>

        {/* Price */}
        <span className="shrink-0 text-sm font-medium text-foreground">
          {formatCHF(itemTotal)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-3">
      {/* Item image */}
      {item.image_url && (
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Item details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground">{item.name}</h4>
          <span className="shrink-0 text-sm font-semibold text-foreground">
            {formatCHF(itemTotal)}
          </span>
        </div>

        {/* Options */}
        {item.options && item.options.length > 0 && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.options
              .map((o) => `${o.name} (+${formatCHF(o.price)})`)
              .join(", ")}
          </p>
        )}

        {/* Special instructions */}
        {item.special_instructions && (
          <p className="mt-0.5 text-xs italic text-muted-foreground">
            {t("item.specialInstructions")}: {item.special_instructions}
          </p>
        )}

        {/* Quantity controls */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleDecrement}
            >
              {item.quantity <= 1 ? (
                <Trash2 className="h-3.5 w-3.5 text-error" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleIncrement}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <button
            onClick={handleRemove}
            className="text-xs text-muted-foreground transition-colors hover:text-error"
          >
            {t("item.remove")}
          </button>
        </div>
      </div>
    </div>
  );
}
