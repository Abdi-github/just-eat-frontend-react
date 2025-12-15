import type { Restaurant } from "../restaurants.types";
import { RestaurantCard, RestaurantCardSkeleton } from "./RestaurantCard";

interface RestaurantGridProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
}

export function RestaurantGrid({
  restaurants,
  isLoading,
}: RestaurantGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <RestaurantCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
