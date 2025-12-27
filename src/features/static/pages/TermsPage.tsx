import { useTranslation } from "react-i18next";

const SECTIONS = [
  "acceptance",
  "services",
  "account",
  "orders",
  "delivery",
  "cancellation",
  "liability",
  "governing",
] as const;

export function TermsPage() {
  const { t } = useTranslation("static");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{t("terms.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("terms.lastUpdated")}
      </p>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section}>
            <h2 className="text-lg font-semibold">
              {t(`terms.sections.${section}.title`)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(`terms.sections.${section}.text`)}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
