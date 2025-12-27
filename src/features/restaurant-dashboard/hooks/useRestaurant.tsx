import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { OwnerRestaurant } from "@/features/restaurant-dashboard/restaurant-dashboard.types";

interface RestaurantContextValue {
  activeRestaurant: OwnerRestaurant | null;
  setActiveRestaurant: (restaurant: OwnerRestaurant) => void;
  restaurantId: string | null;
}

const RestaurantContext = createContext<RestaurantContextValue | undefined>(
  undefined,
);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [activeRestaurant, setActiveRestaurantState] =
    useState<OwnerRestaurant | null>(() => {
      try {
        const stored = localStorage.getItem("activeRestaurantId");
        if (stored) {
          const parsed = JSON.parse(
            localStorage.getItem("activeRestaurant") || "null",
          );
          return parsed;
        }
      } catch {
        // ignore
      }
      return null;
    });

  const setActiveRestaurant = useCallback((restaurant: OwnerRestaurant) => {
    setActiveRestaurantState(restaurant);
    localStorage.setItem("activeRestaurantId", restaurant.id);
    localStorage.setItem("activeRestaurant", JSON.stringify(restaurant));
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        activeRestaurant,
        setActiveRestaurant,
        restaurantId: activeRestaurant?.id ?? null,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
