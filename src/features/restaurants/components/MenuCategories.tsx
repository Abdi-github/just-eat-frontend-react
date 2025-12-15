import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { ScrollArea, ScrollBar } from "@/shared/components/ui/scroll-area";
import type { MenuCategory } from "../restaurants.types";

interface MenuCategoriesProps {
  categories: MenuCategory[];
  activeCategoryId: string | null;
  onCategoryClick: (categoryId: string) => void;
}

export function MenuCategories({
  categories,
  activeCategoryId,
  onCategoryClick,
}: MenuCategoriesProps) {
  const { t } = useTranslation("restaurants");

  if (categories.length === 0) return null;

  return (
    <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-0 sm:px-0">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className={cn(
                "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeCategoryId === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {cat.name}
              {cat.items && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({cat.items.length})
                </span>
              )}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
