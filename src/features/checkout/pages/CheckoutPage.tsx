import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { useAppSelector } from "@/app/hooks";
import { useCart } from "@/shared/hooks/useCart";
import { AddressSelector } from "../components/AddressSelector";
import { PaymentMethods } from "../components/PaymentMethods";
import { CouponInput } from "../components/CouponInput";
import { TipSelector } from "../components/TipSelector";
import { OrderSummary } from "../components/OrderSummary";
import { StripeProvider } from "../components/StripeProvider";
import { StripeCardForm } from "../components/StripeCardForm";
import {
  useCreateOrderMutation,
  useInitiatePaymentMutation,
} from "../checkout.api";
import type {
  Address,
  PaymentMethod,
  CouponValidation,
  OrderItemRequest,
} from "../checkout.types";
import { toast } from "sonner";

const SERVICE_FEE = 1.5;

export function CheckoutPage() {
  const { t } = useTranslation("checkout");
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart);
  const { subtotal, itemCount, meetsMinimumOrder, clearCart } = useCart();

  // Form state
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [tip, setTip] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(
    null,
  );

  // Mutations
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [initiatePayment, { isLoading: isInitiatingPayment }] =
    useInitiatePaymentMutation();

  // Stripe state — when card is selected and payment initiated
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(
    null,
  );
  const [stripeOrderId, setStripeOrderId] = useState<string | null>(null);
  const stripeFormRef = useRef<HTMLDivElement>(null);

  const isSubmitting = isCreatingOrder || isInitiatingPayment;
  const isStripeReady = paymentMethod === "card" && stripeClientSecret !== null;
  const discount = appliedCoupon?.discount_amount ?? 0;
  const deliveryFee = cart.order_type === "delivery" ? cart.delivery_fee : 0;
  const total = subtotal + deliveryFee + SERVICE_FEE + tip - discount;

  // Validation
  const isDeliveryWithoutAddress =
    cart.order_type === "delivery" && !selectedAddress;
  const canSubmit =
    itemCount > 0 &&
    meetsMinimumOrder &&
    paymentMethod !== null &&
    !isDeliveryWithoutAddress &&
    !isSubmitting;

  const handlePlaceOrder = async () => {
    if (!canSubmit || !paymentMethod || !cart.restaurant_id) return;

    try {
      // Build order items
      const items: OrderItemRequest[] = cart.items.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        special_instructions: item.special_instructions,
        options: item.options,
      }));

      // Create order
      const orderResult = await createOrder({
        restaurant_id: cart.restaurant_id,
        order_type: cart.order_type,
        delivery_address_id: selectedAddress?.id,
        payment_method: paymentMethod,
        items,
        tip: tip > 0 ? tip : undefined,
        special_instructions: specialInstructions || undefined,
        coupon_code: appliedCoupon?.coupon?.code,
      }).unwrap();

      const order = orderResult.data;

      // For cash, go straight to confirmation
      if (paymentMethod === "cash") {
        clearCart();
        navigate(`/order-confirmation/${order.id}`, { replace: true });
        return;
      }

      // For card/twint/postfinance, initiate payment
      const paymentResult = await initiatePayment({
        order_id: order.id,
        payment_method: paymentMethod,
        return_url: `${window.location.origin}/order-confirmation/${order.id}`,
        cancel_url: `${window.location.origin}/checkout`,
      }).unwrap();

      const payment = paymentResult.data;

      // Redirect for external payment providers (TWINT, PostFinance)
      // In sandbox mode, redirect to our simulation page instead of the backend URL
      if (payment.redirect_url) {
        clearCart();
        const providerName = payment.provider_name || paymentMethod;
        const txnId = payment.provider_transaction_id || "";
        const simUrl = `/payment/simulate/${providerName}/${txnId}?orderId=${order.id}&amount=${payment.amount}&returnUrl=${encodeURIComponent(`/order-confirmation/${order.id}`)}&cancelUrl=${encodeURIComponent("/checkout")}`;
        navigate(simUrl, { replace: true });
        return;
      }

      // For Stripe card — show the card form with Elements
      if (payment.client_secret && paymentMethod === "card") {
        setStripeClientSecret(payment.client_secret);
        setStripeOrderId(order.id);
        // Scroll to the stripe form after render
        setTimeout(() => {
          stripeFormRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
        return;
      }

      // Fallback — go to confirmation
      clearCart();
      navigate(`/order-confirmation/${order.id}`, { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: { message?: string } } };
      toast.error(apiErr?.data?.error?.message || t("errors.orderFailed"));
    }
  };

  // Called when Stripe payment succeeds (Stripe redirects, so this is a no-op for the redirect flow)
  const handleStripeSuccess = () => {
    clearCart();
    if (stripeOrderId) {
      navigate(`/order-confirmation/${stripeOrderId}`, { replace: true });
    }
  };

  const handleStripeError = (message: string) => {
    toast.error(message);
  };

  // Empty cart guard
  if (itemCount === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">{t("empty.title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("empty.description")}</p>
        <Button className="mt-6" onClick={() => navigate("/restaurants")}>
          {t("empty.browse")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t("back")}
        </Button>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        {cart.restaurant_name && (
          <p className="mt-1 text-muted-foreground">
            {t("orderFrom", { restaurant: cart.restaurant_name })}
          </p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column — Form sections */}
        <div className="space-y-8 lg:col-span-2">
          {/* Address selector */}
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <AddressSelector
              selectedAddressId={selectedAddress?.id ?? null}
              onSelect={setSelectedAddress}
              orderType={cart.order_type}
            />
          </section>

          {/* Payment methods */}
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <PaymentMethods
              selected={paymentMethod}
              onSelect={(method) => {
                setPaymentMethod(method);
                // Reset stripe state if switching away from card
                if (method !== "card") {
                  setStripeClientSecret(null);
                  setStripeOrderId(null);
                }
              }}
            />
          </section>

          {/* Stripe Card Form — shown after order is created and client_secret received */}
          {isStripeReady && stripeClientSecret && (
            <section
              ref={stripeFormRef}
              className="rounded-xl border border-primary/30 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <CreditCard className="h-5 w-5 text-primary" />
                {t("stripe.title")}
              </h3>
              <StripeProvider clientSecret={stripeClientSecret}>
                <StripeCardForm
                  orderId={stripeOrderId!}
                  amount={total}
                  onSuccess={handleStripeSuccess}
                  onError={handleStripeError}
                />
              </StripeProvider>
            </section>
          )}

          {/* Coupon */}
          {cart.restaurant_id && (
            <section className="rounded-xl border bg-white p-6 shadow-sm">
              <CouponInput
                restaurantId={cart.restaurant_id}
                subtotal={subtotal}
                appliedCoupon={appliedCoupon}
                onApply={setAppliedCoupon}
                onRemove={() => setAppliedCoupon(null)}
              />
            </section>
          )}

          {/* Tip */}
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <TipSelector value={tip} onChange={setTip} />
          </section>

          {/* Special instructions */}
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <Label
              htmlFor="special-instructions"
              className="text-lg font-semibold"
            >
              {t("instructions.title")}
            </Label>
            <p className="mt-1 mb-3 text-sm text-muted-foreground">
              {t("instructions.description")}
            </p>
            <Textarea
              id="special-instructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={t("instructions.placeholder")}
              rows={3}
              maxLength={500}
            />
          </section>
        </div>

        {/* Right column — Order summary + place order */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6 rounded-xl border bg-white p-6 shadow-sm">
            <OrderSummary
              tip={tip}
              discount={discount}
              couponCode={appliedCoupon?.coupon?.code}
            />

            <Separator />

            {/* Validation messages */}
            {!meetsMinimumOrder && (
              <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm text-warning">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {t("errors.minimumOrder", {
                    amount: new Intl.NumberFormat("de-CH", {
                      style: "currency",
                      currency: "CHF",
                    }).format(cart.minimum_order),
                  })}
                </span>
              </div>
            )}

            {isDeliveryWithoutAddress && (
              <div className="flex items-start gap-2 rounded-lg bg-error/10 p-3 text-sm text-error">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{t("errors.addressRequired")}</span>
              </div>
            )}

            {!paymentMethod && (
              <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{t("errors.paymentRequired")}</span>
              </div>
            )}

            {/* Place order button — hidden when Stripe form is active */}
            {!isStripeReady && (
              <Button
                size="lg"
                className="w-full text-base"
                disabled={!canSubmit}
                onClick={handlePlaceOrder}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("placing")}
                  </>
                ) : (
                  <>
                    {t("placeOrder")} —{" "}
                    {new Intl.NumberFormat("de-CH", {
                      style: "currency",
                      currency: "CHF",
                    }).format(Math.max(0, total))}
                  </>
                )}
              </Button>
            )}

            {isStripeReady && (
              <p className="text-center text-sm text-muted-foreground">
                {t("stripe.completeAbove")}
              </p>
            )}

            <p className="text-center text-xs text-muted-foreground">
              {t("termsNotice")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
