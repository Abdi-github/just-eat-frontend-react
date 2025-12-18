import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Trash2, LogIn } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/shared/components/ui/sheet";
import { useCart } from "@/shared/hooks/useCart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { CartEmpty } from "./CartEmpty";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { t } = useTranslation("cart");
  const { isAuthenticated } = useAuth();
  const {
    items,
    restaurant_name,
    restaurant_slug,
    itemCount,
    meetsMinimumOrder,
    order_type,
    setOrderType,
    clearCart,
  } = useCart();

  const isEmpty = items.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        {/* Header */}
        <SheetHeader className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              {t("sidebar.title")}
              {itemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </SheetTitle>
            {!isEmpty && (
              <button
                onClick={clearCart}
                className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-error"
                title={t("actions.clearCart")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center px-4">
            <CartEmpty compact />
          </div>
        ) : (
          <>
            {/* Restaurant name */}
            {restaurant_name && (
              <div className="border-b border-border px-4 py-2">
                <p className="text-xs text-muted-foreground">
                  {t("restaurant.orderingFrom")}
                </p>
                <SheetClose asChild>
                  <Link
                    to={`/restaurants/${restaurant_slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {restaurant_name}
                  </Link>
                </SheetClose>
              </div>
            )}

            {/* Order type toggle */}
            <div className="border-b border-border px-4 py-2">
              <div className="inline-flex w-full rounded-lg border border-border bg-muted/50 p-0.5">
                <button
                  onClick={() => {
                    setOrderType("delivery");
                  }}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    order_type === "delivery"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("orderType.delivery")}
                </button>
                <button
                  onClick={() => {
                    setOrderType("pickup");
                  }}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    order_type === "pickup"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t("orderType.pickup")}
                </button>
              </div>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1 px-4">
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <CartItem key={item.menu_item_id} item={item} />
                ))}
              </div>
            </ScrollArea>

            {/* Summary + Actions */}
            <SheetFooter className="flex-col border-t border-border px-4 py-3">
              <CartSummary />
              <div className="mt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="w-full"
                      disabled={!meetsMinimumOrder}
                      onClick={() => {
                      }}
                    >
                      <Link to="/checkout">{t("actions.checkout")}</Link>
                    </Button>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Button asChild className="w-full">
                      <Link
                        to="/login"
                        state={{ from: { pathname: "/checkout" } }}
                        onClick={() => {
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        {t("actions.loginToCheckout")}
                      </Link>
                    </Button>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/cart">{t("actions.viewCart")}</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
