import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Trash2, LogIn } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useCart } from "@/shared/hooks/useCart";
import { useAuth } from "@/shared/hooks/useAuth";
import { CartItem } from "../components/CartItem";
import { CartSummary } from "../components/CartSummary";
import { CartEmpty } from "../components/CartEmpty";

export function CartPage() {
  const { t } = useTranslation("cart");
  const { isAuthenticated } = useAuth();
  const {
    items,
    restaurant_name,
    restaurant_slug,
    meetsMinimumOrder,
    order_type,
    setOrderType,
    clearCart,
  } = useCart();

  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <CartEmpty />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {t("pageTitle")}
          </h1>
          {restaurant_name && (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("restaurant.orderingFrom")}{" "}
              <Link
                to={`/restaurants/${restaurant_slug}`}
                className="font-medium text-primary hover:underline"
              >
                {restaurant_name}
              </Link>
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="gap-1.5 text-muted-foreground hover:text-error"
        >
          <Trash2 className="h-4 w-4" />
          {t("actions.clearCart")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          {/* Order type toggle */}
          <div className="mb-4 rounded-xl border border-border bg-background p-4">
            <p className="mb-2 text-sm font-medium text-foreground">
              {t("orderType.label")}
            </p>
            <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
              <button
                onClick={() => setOrderType("delivery")}
                className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
                  order_type === "delivery"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("orderType.delivery")}
              </button>
              <button
                onClick={() => setOrderType("pickup")}
                className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
                  order_type === "pickup"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("orderType.pickup")}
              </button>
            </div>
          </div>

          {/* Items list */}
          <div className="rounded-xl border border-border bg-background">
            <div className="divide-y divide-border px-4">
              {items.map((item) => (
                <CartItem key={item.menu_item_id} item={item} />
              ))}
            </div>
          </div>

          {/* Continue shopping */}
          <div className="mt-4">
            <Button asChild variant="ghost" className="gap-2">
              <Link
                to={
                  restaurant_slug
                    ? `/restaurants/${restaurant_slug}`
                    : "/restaurants"
                }
              >
                <ArrowLeft className="h-4 w-4" />
                {t("actions.continueShopping")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Sidebar — Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-border bg-background p-4">
            <h3 className="mb-3 text-base font-semibold text-foreground">
              {t("summary.title")}
            </h3>
            <CartSummary />
            <div className="mt-4">
              {isAuthenticated ? (
                <Button
                  asChild
                  className="w-full"
                  size="lg"
                  disabled={!meetsMinimumOrder}
                >
                  <Link to="/checkout">{t("actions.checkout")}</Link>
                </Button>
              ) : (
                <>
                  <Button asChild className="w-full" size="lg">
                    <Link
                      to="/login"
                      state={{ from: { pathname: "/checkout" } }}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      {t("actions.loginToCheckout")}
                    </Link>
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    {t("actions.loginToCheckoutHint")}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
