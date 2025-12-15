import { useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  useGetRestaurantBySlugQuery,
  useGetRestaurantMenuQuery,
  useGetRestaurantReviewsQuery,
  useGetRatingSummaryQuery,
} from "../restaurants.api";
import {
  RestaurantInfo,
  RestaurantInfoSkeleton,
} from "../components/RestaurantInfo";
import { MenuCategories } from "../components/MenuCategories";
import { MenuItem } from "../components/MenuItem";
import { MenuItemDialog } from "../components/MenuItemDialog";
import { RestaurantReviews } from "../components/RestaurantReviews";
import { DeliveryInfo } from "../components/DeliveryInfo";
import { CartSidebar } from "@/features/cart";
import { useCart } from "@/shared/hooks/useCart";
import type { MenuItem as MenuItemType } from "../restaurants.types";

export function RestaurantDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation("restaurants");

  const [activeTab, setActiveTab] = useState("menu");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all");
  const [reviewPage, setReviewPage] = useState(1);

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // API queries
  const {
    data: restaurantData,
    isLoading: isLoadingRestaurant,
    error: restaurantError,
  } = useGetRestaurantBySlugQuery(slug!, { skip: !slug });

  const restaurant = restaurantData?.data;

  const { data: menuData, isLoading: isLoadingMenu } =
    useGetRestaurantMenuQuery(restaurant?.id ?? "", {
      skip: !restaurant?.id,
    });

  const { data: ratingSummaryData } = useGetRatingSummaryQuery(
    restaurant?.id ?? "",
    { skip: !restaurant?.id },
  );

  const { data: reviewsData, isLoading: isLoadingReviews } =
    useGetRestaurantReviewsQuery(
      {
        restaurantId: restaurant?.id ?? "",
        page: reviewPage,
        limit: 10,
        rating:
          reviewRatingFilter !== "all" ? Number(reviewRatingFilter) : undefined,
        sort: "-created_at",
      },
      { skip: !restaurant?.id },
    );

  const categories = menuData?.data?.categories ?? [];
  const reviews = reviewsData?.data ?? [];
  const ratingSummary = ratingSummaryData?.data ?? null;
  const hasMoreReviews = reviewsData?.meta?.hasNextPage ?? false;

  // Set initial active category when menu loads
  if (categories.length > 0 && !activeCategoryId) {
    setActiveCategoryId(categories[0]!.id);
  }

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
    const el = categoryRefs.current[categoryId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleItemClick = useCallback((item: MenuItemType) => {
    setSelectedItem(item);
    setDialogOpen(true);
  }, []);

  const handleReviewFilterChange = useCallback((value: string) => {
    setReviewRatingFilter(value);
    setReviewPage(1);
  }, []);

  const handleLoadMoreReviews = useCallback(() => {
    setReviewPage((prev) => prev + 1);
  }, []);

  // Loading state
  if (isLoadingRestaurant) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="mb-4 h-5 w-40" />
        <RestaurantInfoSkeleton />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-10 w-60" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (restaurantError || !restaurant) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <UtensilsCrossed className="mx-auto h-16 w-16 text-muted-foreground/40" />
        <h2 className="mt-4 text-xl font-semibold">Restaurant not found</h2>
        <p className="mt-1 text-muted-foreground">
          The restaurant you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/restaurants">{t("detail.backToRestaurants")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        to="/restaurants"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("detail.backToRestaurants")}
      </Link>

      {/* Restaurant Info Header */}
      <RestaurantInfo restaurant={restaurant} />

      <Separator className="my-6" />

      {/* Main content: Menu/Reviews + Sidebar */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main (left) */}
        <div className="min-w-0 flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="menu">{t("detail.menu")}</TabsTrigger>
              <TabsTrigger value="reviews">
                {t("detail.reviews")}
                {ratingSummary && ratingSummary.review_count > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    ({ratingSummary.review_count})
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Menu tab */}
            <TabsContent value="menu" className="mt-4">
              {isLoadingMenu ? (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="py-12 text-center">
                  <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <h3 className="mt-3 text-lg font-semibold text-muted-foreground">
                    {t("detail.noMenu")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("detail.noMenuDescription")}
                  </p>
                </div>
              ) : (
                <>
                  {/* Category nav */}
                  <MenuCategories
                    categories={categories}
                    activeCategoryId={activeCategoryId}
                    onCategoryClick={handleCategoryClick}
                  />

                  {/* Category sections */}
                  <div className="mt-4 space-y-8">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        ref={(el) => {
                          categoryRefs.current[category.id] = el;
                        }}
                      >
                        <h3 className="mb-3 text-lg font-bold">
                          {category.name}
                        </h3>
                        <div className="space-y-2">
                          {(category.items ?? []).map((item) => (
                            <MenuItem
                              key={item.id}
                              item={item}
                              onItemClick={handleItemClick}
                            />
                          ))}
                          {(!category.items || category.items.length === 0) && (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                              No items in this category
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            {/* Reviews tab */}
            <TabsContent value="reviews" className="mt-4">
              <RestaurantReviews
                reviews={reviews}
                summary={ratingSummary}
                isLoading={isLoadingReviews}
                hasMore={hasMoreReviews}
                ratingFilter={reviewRatingFilter}
                onRatingFilterChange={handleReviewFilterChange}
                onLoadMore={handleLoadMoreReviews}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar (right) */}
        <div className="hidden w-full shrink-0 space-y-4 lg:block lg:w-80">
          <DeliveryInfo restaurant={restaurant} />
          <CartSidebar />
        </div>
      </div>

      {/* Menu item dialog */}
      <MenuItemDialog
        item={selectedItem}
        restaurant={restaurant}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
