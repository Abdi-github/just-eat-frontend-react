import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  mobileMenuOpen: boolean;
  cartSheetOpen: boolean;
  theme: "light" | "dark";
}

const initialState: UiState = {
  mobileMenuOpen: false,
  cartSheetOpen: false,
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
    toggleCartSheet(state) {
      state.cartSheetOpen = !state.cartSheetOpen;
    },
    setCartSheetOpen(state, action: PayloadAction<boolean>) {
      state.cartSheetOpen = action.payload;
    },
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleCartSheet,
  setCartSheetOpen,
  setTheme,
} = uiSlice.actions;
export default uiSlice.reducer;
