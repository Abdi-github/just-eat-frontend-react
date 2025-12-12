import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setLanguage } from "@/shared/state/ui.language.slice";
import type { SupportedLanguage } from "@/shared/types/common.types";

export function useLanguage() {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.language.current);

  const changeLanguage = (lang: SupportedLanguage) => {
    dispatch(setLanguage(lang));
  };

  return { current, changeLanguage };
}
