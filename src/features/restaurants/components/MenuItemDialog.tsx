import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ShoppingCart, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Textarea } from "@/shared/components/ui/textarea";
import { Separator } from "@/shared/components/ui/separator";
import { formatCHF } from "@/shared/utils/formatters";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addItem } from "@/shared/state/cart.slice";
import type {
  MenuItem as MenuItemType,
  Restaurant,
} from "../restaurants.types";

interface MenuItemDialogProps {
  item: MenuItemType | null;
  restaurant: Restaurant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuItemDialog({
  item,
  restaurant,
  open,
  onOpenChange,
}: MenuItemDialogProps) {
  const { t } = useTranslation("restaurants");
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Check if adding from different restaurant
  const isDifferentRestaurant =
    cart.restaurant_id !== null && cart.restaurant_id !== restaurant.id;

  if (!item) return null;

  const totalPrice = item.price * quantity;

  const handleAddToCart = () => {
    dispatch(
      addItem({
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
          delivery_fee: restaurant.delivery_fee ?? 0,
          minimum_order: restaurant.minimum_order ?? 0,
        },
        item: {
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity,
          special_instructions: specialInstructions || undefined,
          image_url: item.image_url ?? undefined,
        },
      }),
    );

    // Reset and close
    setQuantity(1);
    setSpecialInstructions("");
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setQuantity(1);
      setSpecialInstructions("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          {item.image_url && (
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={item.image_url}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          {item.description && (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          )}

          {/* Price */}
          <p className="text-lg font-bold">{formatCHF(item.price)}</p>

          {/* Allergens */}
          {item.allergens.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">
                {t("detail.allergens")}
              </p>
              <div className="flex flex-wrap gap-1">
                {item.allergens.map((allergen) => (
                  <Badge
                    key={allergen}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {t(`allergenLabels.${allergen}`, {
                      defaultValue: allergen,
                    })}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dietary flags */}
          {item.dietary_flags.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">
                {t("detail.dietaryFlags")}
              </p>
              <div className="flex flex-wrap gap-1">
                {item.dietary_flags.map((flag) => (
                  <Badge
                    key={flag}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {t(`dietaryLabels.${flag}`, { defaultValue: flag })}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Special instructions */}
          <div>
            <label
              htmlFor="special-instructions"
              className="mb-1.5 block text-sm font-medium"
            >
              {t("detail.specialInstructions")}
            </label>
            <Textarea
              id="special-instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={t("detail.specialInstructionsPlaceholder")}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Different restaurant warning */}
          {isDifferentRestaurant && (
            <div className="flex items-start gap-2 rounded-md bg-warning/10 p-3 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="text-warning">
                Adding from a different restaurant will clear your current cart.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row items-center gap-4 sm:justify-between">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Add to cart button */}
          <Button
            className="min-w-[140px] bg-primary text-primary-foreground hover:bg-primary-hover"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {t("detail.addToCart")} · {formatCHF(totalPrice)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
