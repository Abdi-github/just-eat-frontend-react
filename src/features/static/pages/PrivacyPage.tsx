import { useTranslation } from "react-i18next";

const SECTIONS = [
  "collection",
  "usage",
  "sharing",
  "storage",
  "rights",
  "cookies",
  "contact",
] as const;

export function PrivacyPage() {
  const { t } = useTranslation("static");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t("privacy.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("privacy.lastUpdated")}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {t("privacy.intro")}
      </p>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section}>
            <h2 className="text-lg font-semibold">
              {t(`privacy.sections.${section}.title`)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(`privacy.sections.${section}.text`)}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
