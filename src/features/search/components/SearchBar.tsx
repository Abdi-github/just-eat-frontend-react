import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { useGetSuggestionsQuery } from "../search.api";
import { SearchSuggestions } from "./SearchSuggestions";
import type { SearchSuggestion } from "../search.types";

interface SearchBarProps {
  /** Initial query value from URL params */
  initialQuery?: string;
  /** Whether to render as a compact header bar or a full-width search */
  variant?: "full" | "compact";
  /** Class overrides */
  className?: string;
}

export function SearchBar({
  initialQuery = "",
  variant = "full",
  className = "",
}: SearchBarProps) {
  const { t } = useTranslation("search");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initial query from URL params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !initialQuery) {
      setQuery(q);
    }
  }, [searchParams, initialQuery]);

  // Debounce query for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch suggestions
  const { data: suggestionsData, isFetching } = useGetSuggestionsQuery(
    { q: debouncedQuery },
    { skip: debouncedQuery.length < 2 },
  );

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }, [query, navigate]);

  const handleSuggestionSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      setShowSuggestions(false);
      if (suggestion.type === "restaurant") {
        navigate(`/restaurants/${suggestion.slug}`);
      } else if (suggestion.type === "cuisine") {
        navigate(`/search?cuisine_id=${suggestion.id}`);
      }
    },
    [navigate],
  );

  const handleViewAll = useCallback(() => {
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }, [query, navigate]);

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const isCompact = variant === "compact";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex items-center overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20 ${
          isCompact ? "h-10 border-border" : "h-12 border-border"
        }`}
      >
        <div className="flex flex-1 items-center px-3">
          <Search
            className={`shrink-0 text-muted-foreground ${
              isCompact ? "mr-2 h-4 w-4" : "mr-3 h-5 w-5"
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={t("placeholder")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length >= 2) {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (query.length >= 2) setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${
              isCompact ? "text-sm" : "text-base"
            }`}
          />
          {query && (
            <button
              onClick={handleClear}
              className="rounded-full p-1 transition-colors hover:bg-accent"
              aria-label={t("filters.clearFilters")}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          className={`flex items-center justify-center bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary-hover ${
            isCompact
              ? "h-full px-4 text-sm"
              : "h-full px-5 text-sm md:px-6 md:text-base"
          }`}
        >
          {t("searchButton")}
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          <SearchSuggestions
            suggestions={suggestionsData?.data ?? null}
            isLoading={isFetching}
            query={query}
            onSelect={handleSuggestionSelect}
            onViewAll={handleViewAll}
          />
        </div>
      )}
    </div>
  );
}
