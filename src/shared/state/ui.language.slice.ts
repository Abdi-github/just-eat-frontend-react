import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SupportedLanguage } from "@/shared/types/common.types";
import i18n from "@/i18n";

interface LanguageState {
  current: SupportedLanguage;
}

const initialState: LanguageState = {
  current: (localStorage.getItem("i18nextLng") as SupportedLanguage) || "de",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<SupportedLanguage>) {
      state.current = action.payload;
      i18n.changeLanguage(action.payload);
      localStorage.setItem("i18nextLng", action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
