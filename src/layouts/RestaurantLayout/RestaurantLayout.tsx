import { useEffect, useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Settings,
  Tag,
  Star,
  BarChart3,
  Store,
  Menu,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  RestaurantProvider,
  useRestaurant,
} from "@/features/restaurant-dashboard/hooks/useRestaurant";
import { useGetMyRestaurantsQuery } from "@/features/restaurant-dashboard/restaurant-dashboard.api";

const restaurantLinks = [
  {
    to: "/restaurant/dashboard",
    icon: LayoutDashboard,
    label: "nav.dashboard",
  },
  { to: "/restaurant/menu", icon: UtensilsCrossed, label: "nav.menu" },
  { to: "/restaurant/orders", icon: ShoppingBag, label: "nav.orders" },
  { to: "/restaurant/settings", icon: Settings, label: "nav.settings" },
  { to: "/restaurant/promotions", icon: Tag, label: "nav.promotions" },
  { to: "/restaurant/reviews", icon: Star, label: "nav.reviews" },
  { to: "/restaurant/analytics", icon: BarChart3, label: "nav.analytics" },
];

function RestaurantLayoutContent() {
  const { t } = useTranslation("restaurant-dashboard");
  const { activeRestaurant, setActiveRestaurant, restaurantId } =
    useRestaurant();
  const { data: restaurantsData, isLoading } = useGetMyRestaurantsQuery();
  const restaurants = restaurantsData?.data ?? [];

  // Auto-select first restaurant if none selected
  useEffect(() => {
    if (!restaurantId && restaurants.length > 0) {
      setActiveRestaurant(restaurants[0]);
    }
  }, [restaurantId, restaurants, setActiveRestaurant]);

  // If stored restaurant not in list, select first
  useEffect(() => {
    if (restaurantId && restaurants.length > 0) {
      const found = restaurants.find((r) => r.id === restaurantId);
      if (!found) {
        setActiveRestaurant(restaurants[0]);
      }
    }
  }, [restaurantId, restaurants, setActiveRestaurant]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform border-r border-border bg-white transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">just-eat</span>
            <span className="text-xs text-muted-foreground">.ch</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        <p className="px-4 -mt-2 text-xs text-muted-foreground">
          {t("dashboard.title")}
        </p>

        {/* Restaurant Selector */}
        <div className="px-4 pb-3">
          {isLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : restaurants.length > 0 ? (
            <Select
              value={restaurantId ?? undefined}
              onValueChange={(val) => {
                const r = restaurants.find((r) => r.id === val);
                if (r) setActiveRestaurant(r);
              }}
            >
              <SelectTrigger className="w-full">
                <Store size={14} className="mr-2 shrink-0" />
                <SelectValue placeholder={t("dashboard.selectRestaurant")} />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-xs text-muted-foreground">
              {t("dashboard.noRestaurants")}
            </p>
          )}
        </div>

        <nav className="mt-2 space-y-1 px-2">
          {restaurantLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent"
                }`
              }
            >
              <link.icon size={18} />
              {t(link.label)}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-semibold text-foreground">
              {activeRestaurant?.name ?? t("dashboard.title")}
            </h2>
          </div>
          {activeRestaurant && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                activeRestaurant.is_active
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {activeRestaurant.is_active
                ? t("settings.active")
                : t("settings.inactive")}
            </span>
          )}
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function RestaurantLayout() {
  return (
    <RestaurantProvider>
      <RestaurantLayoutContent />
    </RestaurantProvider>
  );
}
