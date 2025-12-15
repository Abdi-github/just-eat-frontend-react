import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, X, ChevronRight } from "lucide-react";
import { useSearchCityLocationsQuery } from "../search.api";
import type { City } from "../search.types";

const POPULAR_CITIES = [
  { name: "Zürich", slug: "zurich" },
  { name: "Bern", slug: "bern" },
  { name: "Basel", slug: "basel" },
  { name: "Genève", slug: "geneve" },
  { name: "Lausanne", slug: "lausanne" },
  { name: "Luzern", slug: "luzern" },
];

interface LocationSearchProps {
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
  onClear: () => void;
  className?: string;
}

export function LocationSearch({
  selectedCity,
  onCitySelect,
  onClear,
  className = "",
}: LocationSearchProps) {
  const { t } = useTranslation("search");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isFetching } = useSearchCityLocationsQuery(query, {
    skip: query.length < 2,
  });

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setQuery("");
    setIsOpen(false);
  };

  const cities = searchResults?.data?.cities ?? [];
  const cantons = searchResults?.data?.cantons ?? [];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Selected city badge or input */}
      {selectedCity ? (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="flex-1 text-sm font-medium text-foreground">
            {selectedCity.name}
            {selectedCity.canton?.code && (
              <span className="ml-1 text-muted-foreground">
                ({selectedCity.canton.code})
              </span>
            )}
          </span>
          <button
            onClick={onClear}
            className="rounded-full p-0.5 transition-colors hover:bg-accent"
            aria-label={t("location.change")}
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 transition-colors hover:border-primary/50"
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
        >
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              placeholder={t("location.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsOpen(false);
              }}
            />
          ) : (
            <span className="flex-1 text-sm text-muted-foreground">
              {t("location.searchPlaceholder")}
            </span>
          )}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !selectedCity && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-[320px] overflow-y-auto rounded-xl border border-border bg-background shadow-lg">
          {/* Loading state */}
          {isFetching && (
            <div className="space-y-2 p-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-muted" />
              ))}
            </div>
          )}

          {/* Search results */}
          {!isFetching && query.length >= 2 && (
            <>
              {/* Cantons */}
              {cantons.length > 0 && (
                <div>
                  <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("location.cantons")}
                  </p>
                  {cantons.map((canton) => (
                    <button
                      key={canton.id}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                      onClick={() => {
                        // For cantons, navigate to search with canton filter
                        setIsOpen(false);
                        setQuery("");
                      }}
                    >
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="flex-1">{canton.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {canton.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Cities */}
              {cities.length > 0 && (
                <div>
                  <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("location.cities")}
                  </p>
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                      onClick={() => handleCitySelect(city)}
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="flex-1">{city.name}</span>
                      {city.restaurant_count !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {t("location.restaurants", {
                            count: city.restaurant_count,
                          })}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {cantons.length === 0 && cities.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  {t("location.noResults")}
                </p>
              )}
            </>
          )}

          {/* Popular cities (when no query) */}
          {query.length < 2 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("location.popularCities")}
              </p>
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.slug}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  onClick={() => {
                    setQuery(city.name);
                  }}
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="flex-1">{city.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
