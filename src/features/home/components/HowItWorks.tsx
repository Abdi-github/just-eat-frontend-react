import { useTranslation } from "react-i18next";
import { Search, UtensilsCrossed, Bike } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    titleKey: "howItWorks.step1Title",
    descKey: "howItWorks.step1Description",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: UtensilsCrossed,
    titleKey: "howItWorks.step2Title",
    descKey: "howItWorks.step2Description",
    color: "bg-success/10 text-success",
  },
  {
    icon: Bike,
    titleKey: "howItWorks.step3Title",
    descKey: "howItWorks.step3Description",
    color: "bg-info/10 text-info",
  },
];

export function HowItWorks() {
  const { t } = useTranslation("home");

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            {t("howItWorks.title")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Step number + icon */}
              <div className="relative mb-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}
                >
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {index + 1}
                </div>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {t(step.titleKey)}
              </h3>
              <p className="max-w-xs text-sm text-muted-foreground">
                {t(step.descKey)}
              </p>

              {/* Connector line (desktop only) */}
              {index < STEPS.length - 1 && (
                <div className="mt-4 hidden h-0.5 w-full max-w-[200px] bg-gradient-to-r from-transparent via-border to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
