import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-8xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {t("errors.notFoundTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("errors.notFoundMessage")}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={14} className="mr-2" />
            {t("actions.back")}
          </Button>
          <Button asChild size="sm">
            <Link to="/">
              <Home size={14} className="mr-2" />
              {t("nav.home")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
