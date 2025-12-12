import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  setOrderType,
} from "@/shared/state/cart.slice";

export function useCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const total =
    subtotal + (cart.order_type === "delivery" ? cart.delivery_fee : 0);

  const meetsMinimumOrder = subtotal >= cart.minimum_order;

  return {
    ...cart,
    subtotal,
    itemCount,
    total,
    meetsMinimumOrder,
    addItem: (payload: Parameters<typeof addItem>[0]) =>
      dispatch(addItem(payload)),
    updateQuantity: (payload: Parameters<typeof updateQuantity>[0]) =>
      dispatch(updateQuantity(payload)),
    removeItem: (id: string) => dispatch(removeItem(id)),
    clearCart: () => dispatch(clearCart()),
    setOrderType: (type: "delivery" | "pickup") => dispatch(setOrderType(type)),
  };
}
