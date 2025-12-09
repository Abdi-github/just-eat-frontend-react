import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/shared/hooks/useLanguage";
import type { SupportedLanguage } from "@/shared/types/common.types";
import { SUPPORTED_LANGUAGES } from "@/shared/utils/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const languageFlags: Record<string, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
  fr: "🇫🇷",
  it: "🇮🇹",
};

const languageLabels: Record<string, string> = {
  de: "Deutsch",
  en: "English",
  fr: "Français",
  it: "Italiano",
};

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { current, changeLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-primary"
          aria-label={t("language.select")}
        >
          <Globe size={16} />
          <span>{languageFlags[current]} {current.toUpperCase()}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => changeLanguage(lang as SupportedLanguage)}
            className={`flex cursor-pointer items-center gap-2 ${
              current === lang ? "bg-accent font-semibold" : ""
            }`}
          >
            <span>{languageFlags[lang]}</span>
            <span>{languageLabels[lang]}</span>
            {current === lang && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
