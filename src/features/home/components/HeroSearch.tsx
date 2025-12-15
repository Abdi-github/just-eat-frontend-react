import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useSearchLocationsQuery, useGetCitiesQuery } from "../home.api";
import type { City } from "../home.types";

export function HeroSearch() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { data: citiesData } = useGetCitiesQuery({ limit: 100, is_active: true });

  const { data: searchResults, isFetching } = useSearchLocationsQuery(query, {
    skip: query.length < 2,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) {
      params.set("city_id", selectedCity.id);
    } else if (query) {
      params.set("q", query);
    }
    params.set("order_type", orderType);
    navigate(`/restaurants?${params.toString()}`);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setQuery(city.name);
    setShowSuggestions(false);
    const params = new URLSearchParams();
    params.set("city_id", city.id);
    params.set("order_type", orderType);
    navigate(`/restaurants?${params.toString()}`);
  };

  const handlePopularCityClick = (city: City) => {
    navigate(`/restaurants?city_id=${city.id}&order_type=${orderType}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const cities = searchResults?.data?.cities ?? [];
  const cantons = searchResults?.data?.cantons ?? [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-hover py-16 md:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/15" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
          {t("hero.title")}
        </h1>
        <p className="mb-8 text-lg text-white/90 md:text-xl">
          {t("hero.subtitle")}
        </p>

        {/* Delivery / Pickup Toggle */}
        <div className="mb-6 inline-flex rounded-full bg-white/20 p-1">
          <button
            onClick={() => setOrderType("delivery")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              orderType === "delivery"
                ? "bg-white text-primary shadow-sm"
                : "text-white hover:bg-white/10"
            }`}
          >
            {t("hero.delivery")}
          </button>
          <button
            onClick={() => setOrderType("pickup")}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              orderType === "pickup"
                ? "bg-white text-primary shadow-sm"
                : "text-white hover:bg-white/10"
            }`}
          >
            {t("hero.pickup")}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mx-auto max-w-2xl">
          <div className="flex items-center overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="flex flex-1 items-center px-4">
              <MapPin className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t("hero.searchPlaceholder")}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedCity(null);
                  if (e.target.value.length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                onFocus={() => {
                  if (query.length >= 2) setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent py-4 text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <Button
              onClick={handleSearch}
              size="lg"
              className="m-1.5 rounded-lg bg-primary px-6 text-white hover:bg-primary-hover"
            >
              <Search className="mr-2 h-5 w-5" />
              <span className="hidden sm:inline">
                {t("hero.findRestaurants")}
              </span>
            </Button>
          </div>

          {/* Location Suggestions Dropdown */}
          {showSuggestions && query.length >= 2 && (
            <div
              ref={suggestionsRef}
              className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-white shadow-lg"
            >
              {isFetching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {cantons.length > 0 && (
                    <div className="border-b border-border px-4 py-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Cantons
                      </p>
                      {cantons.map((canton) => (
                        <button
                          key={canton.id}
                          onClick={() =>
                            navigate(
                              `/restaurants?canton_id=${canton.id}&order_type=${orderType}`,
                            )
                          }
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent"
                        >
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {canton.name}
                          </span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {canton.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {cities.length > 0 && (
                    <div className="px-4 py-2">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Cities
                      </p>
                      {cities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleCitySelect(city)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent"
                        >
                          <MapPin className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{city.name}</p>
                            {city.postal_codes?.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {city.postal_codes.slice(0, 3).join(", ")}
                                {city.postal_codes.length > 3 && "..."}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  )}
                  {cantons.length === 0 && cities.length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Popular Cities */}
        {citiesData?.data && citiesData.data.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm text-white/80">
              {t("hero.popularCities")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {citiesData.data.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handlePopularCityClick(city)}
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
