import { useTranslation } from "react-i18next";
import { Smartphone, MapPin, Heart } from "lucide-react";

const FEATURES = [
  { icon: Smartphone, key: "appPromotion.feature1" },
  { icon: MapPin, key: "appPromotion.feature2" },
  { icon: Heart, key: "appPromotion.feature3" },
];

export function AppPromotion() {
  const { t } = useTranslation("home");

  return (
    <section className="bg-secondary py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          {/* Illustration placeholder */}
          <div className="flex flex-1 justify-center">
            <div className="relative">
              <div className="flex h-64 w-40 items-center justify-center rounded-3xl border-4 border-white/20 bg-white/10 shadow-lg backdrop-blur-sm md:h-80 md:w-48">
                <div className="text-center">
                  <span className="text-5xl">📱</span>
                  <p className="mt-2 text-sm font-medium text-white/80">
                    just-eat.ch
                  </p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-md">
                NEW
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
              {t("appPromotion.title")}
            </h2>
            <p className="mb-6 text-white/80">{t("appPromotion.subtitle")}</p>

            <ul className="mb-8 space-y-3">
              {FEATURES.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white/90">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{t(feature.key)}</span>
                </li>
              ))}
            </ul>

            {/* App Store Buttons */}
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <button className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-white/90">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                {t("appPromotion.downloadOnAppStore")}
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-white/90">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                {t("appPromotion.getOnGooglePlay")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
