import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        {t("accessibility.skipToContent", "Skip to content")}
      </a>
      <Header />
      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
