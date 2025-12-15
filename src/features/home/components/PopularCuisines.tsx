import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronUp } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { useGetCuisinesQuery } from "../home.api";

const INITIAL_DISPLAY_COUNT = 12;

export function PopularCuisines() {
  const { t } = useTranslation("home");
  const [showAll, setShowAll] = useState(false);
  const { data, isLoading, isError } = useGetCuisinesQuery({
    limit: 100,
    is_active: true,
  });

  const allCuisines = data?.data ?? [];
  const hasMore = allCuisines.length > INITIAL_DISPLAY_COUNT;
  const displayedCuisines = showAll ? allCuisines : allCuisines.slice(0, INITIAL_DISPLAY_COUNT);

  if (isError) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {t("cuisines.title")}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {t("cuisines.subtitle")}
            </p>
          </div>
          {hasMore && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
            >
              {showAll ? t("cuisines.viewLess") : t("cuisines.viewAll")}
              {showAll ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Cuisine Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: INITIAL_DISPLAY_COUNT }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {displayedCuisines.map((cuisine) => (
              <Link
                key={cuisine.id}
                to={`/restaurants?cuisine_id=${cuisine.id}`}
                className="group flex flex-col items-center gap-3 rounded-xl p-4 transition-all hover:bg-accent"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted shadow-sm ring-2 ring-transparent transition-all group-hover:ring-primary group-hover:shadow-md">
                  {cuisine.image_url ? (
                    <img
                      src={cuisine.image_url}
                      alt={cuisine.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl">
                      🍽️
                    </div>
                  )}
                </div>
                <span className="text-center text-sm font-medium text-foreground group-hover:text-primary">
                  {cuisine.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile "View All / View Less" Button */}
        {hasMore && (
          <div className="mt-6 text-center md:hidden">
            <Button
              variant="ghost"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {showAll ? t("cuisines.viewLess") : t("cuisines.viewAll")}
              {showAll ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
