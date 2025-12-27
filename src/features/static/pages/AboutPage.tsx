import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Award,
  Zap,
  ChefHat,
  Leaf,
  Utensils,
  MapPin,
  Globe,
  Truck,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const valueIcons = {
  quality: Award,
  speed: Zap,
  choice: ChefHat,
  sustainability: Leaf,
} as const;

const statIcons = [Utensils, MapPin, Globe, Truck];

export function AboutPage() {
  const { t } = useTranslation("static");

  const values = ["quality", "speed", "choice", "sustainability"] as const;
  const stats = ["restaurants", "cities", "cuisines", "deliveries"] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-3xl font-bold md:text-4xl">{t("about.title")}</h1>
        <p className="mt-2 text-lg text-primary font-medium">
          {t("about.subtitle")}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          {t("about.heroText")}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = statIcons[i];
          return (
            <Card key={stat} className="text-center">
              <CardContent className="pt-6">
                <Icon size={28} className="mx-auto text-primary" />
                <p className="mt-2 text-lg font-bold">
                  {t(`about.stats.${stat}`)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mission */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">{t("about.mission.title")}</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t("about.mission.text")}
        </p>
      </div>

      {/* Values */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">{t("about.values.title")}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {values.map((value) => {
            const Icon = valueIcons[value];
            return (
              <Card key={value}>
                <CardContent className="flex gap-4 pt-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {t(`about.values.${value}.title`)}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`about.values.${value}.text`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-xl bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-bold">{t("about.cta.title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("about.cta.text")}</p>
        <Button asChild className="mt-4" size="lg">
          <Link to="/restaurants">{t("about.cta.button")}</Link>
        </Button>
      </div>
    </div>
  );
}
