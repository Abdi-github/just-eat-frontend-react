import { Outlet, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  Heart,
  MapPin,
  User,
  Star,
  Bell,
  Gift,
  LogOut,
} from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/shared/state/auth.slice";
import { Header } from "@/layouts/MainLayout/Header";
import { Footer } from "@/layouts/MainLayout/Footer";

const accountLinks = [
  { to: "/account/orders", icon: ShoppingBag, label: "nav.orders" },
  { to: "/account/favorites", icon: Heart, label: "nav.favorites" },
  { to: "/account/addresses", icon: MapPin, label: "nav.addresses" },
  { to: "/account/profile", icon: User, label: "nav.profile" },
  { to: "/account/reviews", icon: Star, label: "nav.reviews" },
  { to: "/account/notifications", icon: Bell, label: "nav.notifications" },
  { to: "/account/promotions", icon: Gift, label: "nav.promotions" },
];

export function AccountLayout() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6">
        {/* Sidebar — desktop */}
        <aside className="hidden w-64 shrink-0 md:block">
          <nav className="sticky top-20 space-y-1 rounded-xl border border-border bg-white p-4 shadow-sm">
            {accountLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
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
            <hr className="my-2 border-border" />
            <button
              onClick={() => dispatch(logout())}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-error hover:bg-red-50"
            >
              <LogOut size={18} />
              {t("nav.logout")}
            </button>
          </nav>
        </aside>

        {/* Mobile horizontal nav — visible on small screens */}
        <div className="w-full md:hidden">
          <nav className="mb-4 -mx-4 overflow-x-auto border-b border-border bg-white px-4">
            <div className="flex gap-1 pb-2">
              {accountLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/account/orders"}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-accent text-foreground"
                    }`
                  }
                >
                  <link.icon size={14} />
                  {t(link.label)}
                </NavLink>
              ))}
            </div>
          </nav>
          <Outlet />
        </div>

        {/* Content — desktop */}
        <div className="hidden flex-1 md:block">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
