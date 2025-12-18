import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Trash2, LogIn } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useCart } from "@/shared/hooks/useCart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { CartEmpty } from "./CartEmpty";

export function CartSidebar() {
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
    <div className="sticky top-20 flex h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {t("sidebar.title")}
          </h3>
          {itemCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
              {itemCount}
            </span>
          )}
        </div>
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

      {isEmpty ? (
        <CartEmpty compact />
      ) : (
        <>
          {/* Restaurant name */}
          {restaurant_name && (
            <div className="border-b border-border px-4 py-2">
              <p className="text-xs text-muted-foreground">
                {t("restaurant.orderingFrom")}
              </p>
              <Link
                to={`/restaurants/${restaurant_slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {restaurant_name}
              </Link>
            </div>
          )}

          {/* Order type toggle */}
          <div className="border-b border-border px-4 py-2">
            <div className="inline-flex w-full rounded-lg border border-border bg-muted/50 p-0.5">
              <button
                onClick={() => setOrderType("delivery")}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  order_type === "delivery"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("orderType.delivery")}
              </button>
              <button
                onClick={() => setOrderType("pickup")}
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
                <CartItem key={item.menu_item_id} item={item} compact />
              ))}
            </div>
          </ScrollArea>

          {/* Summary + Checkout */}
          <div className="border-t border-border px-4 py-3">
            <CartSummary compact />
            <div className="mt-3 space-y-2">
              {isAuthenticated ? (
                <Button asChild className="w-full" disabled={!meetsMinimumOrder}>
                  <Link to="/checkout">{t("actions.checkout")}</Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link
                    to="/login"
                    state={{ from: { pathname: "/checkout" } }}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    {t("actions.loginToCheckout")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
