import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  special_instructions?: string;
  options?: { name: string; price: number }[];
  image_url?: string;
}

interface CartState {
  restaurant_id: string | null;
  restaurant_name: string | null;
  restaurant_slug: string | null;
  items: CartItem[];
  delivery_fee: number;
  minimum_order: number;
  order_type: "delivery" | "pickup";
}

const loadCartFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem("cart");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return {
    restaurant_id: null,
    restaurant_name: null,
    restaurant_slug: null,
    items: [],
    delivery_fee: 0,
    minimum_order: 0,
    order_type: "delivery",
  };
};

const saveCartToStorage = (state: CartState) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{
        restaurant: {
          id: string;
          name: string;
          slug: string;
          delivery_fee: number;
          minimum_order: number;
        };
        item: CartItem;
      }>,
    ) {
      const { restaurant, item } = action.payload;

      // If adding from a different restaurant, clear cart first
      if (state.restaurant_id && state.restaurant_id !== restaurant.id) {
        state.items = [];
      }

      state.restaurant_id = restaurant.id;
      state.restaurant_name = restaurant.name;
      state.restaurant_slug = restaurant.slug;
      state.delivery_fee = restaurant.delivery_fee;
      state.minimum_order = restaurant.minimum_order;

      const existingIndex = state.items.findIndex(
        (i) => i.menu_item_id === item.menu_item_id,
      );
      if (existingIndex >= 0) {
        state.items[existingIndex]!.quantity += item.quantity;
      } else {
        state.items.push(item);
      }

      saveCartToStorage(state);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ menu_item_id: string; quantity: number }>,
    ) {
      const { menu_item_id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(
          (i) => i.menu_item_id !== menu_item_id,
        );
      } else {
        const item = state.items.find((i) => i.menu_item_id === menu_item_id);
        if (item) item.quantity = quantity;
      }
      if (state.items.length === 0) {
        state.restaurant_id = null;
        state.restaurant_name = null;
        state.restaurant_slug = null;
      }
      saveCartToStorage(state);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (i) => i.menu_item_id !== action.payload,
      );
      if (state.items.length === 0) {
        state.restaurant_id = null;
        state.restaurant_name = null;
        state.restaurant_slug = null;
      }
      saveCartToStorage(state);
    },
    clearCart() {
      const cleared: CartState = {
        restaurant_id: null,
        restaurant_name: null,
        restaurant_slug: null,
        items: [],
        delivery_fee: 0,
        minimum_order: 0,
        order_type: "delivery",
      };
      localStorage.removeItem("cart");
      return cleared;
    },
    setOrderType(state, action: PayloadAction<"delivery" | "pickup">) {
      state.order_type = action.payload;
      saveCartToStorage(state);
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart, setOrderType } =
  cartSlice.actions;
export default cartSlice.reducer;
