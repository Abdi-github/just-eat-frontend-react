import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Heart,
  MapPin,
  ClipboardList,
  Star,
  Store,
  Bike,
} from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useCart } from "@/shared/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleMobileMenu, setMobileMenuOpen } from "@/shared/state/ui.slice";
import { logout } from "@/shared/state/auth.slice";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CartSheet } from "@/features/cart";
import { NotificationBell } from "@/features/notifications";
import { useLogoutMutation } from "@/features/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, isRestaurantOwner, isCourier } = useAuth();
  const { itemCount } = useCart();
  const dispatch = useAppDispatch();
  const mobileMenuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Logout locally even if API call fails
    }
    dispatch(logout());
    navigate("/");
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-white shadow-sm"
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label={t("app.name")}
        >
          <img src="/logo.svg" alt="just-eat.ch" className="h-8" />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main navigation"
        >
          <Link
            to="/restaurants"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            {t("nav.restaurants")}
          </Link>

          {!isAuthenticated && (
            <>
              <Link
                to="/partner"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary"
              >
                <Store size={16} />
                {t("nav.partnerWithUs")}
              </Link>
              <Link
                to="/become-courier"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary"
              >
                <Bike size={16} />
                {t("nav.becomeCourier")}
              </Link>
            </>
          )}

          <LanguageSwitcher />

          {/* Cart icon — always visible */}
          <button
            onClick={() => setCartSheetOpen(true)}
            className="relative text-foreground hover:text-primary"
            aria-label={`${t("nav.cart")}${itemCount > 0 ? ` (${itemCount})` : ""}`}
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <NotificationBell />
              <Link
                to="/account/profile"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
              >
                <User size={20} />
                <span className="hidden lg:inline">{user?.first_name}</span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                    <Menu size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/account/orders"
                      className="flex items-center gap-2"
                    >
                      <ClipboardList className="h-4 w-4" />
                      {t("nav.orders")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/account/favorites"
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      {t("nav.favorites")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/account/addresses"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      {t("nav.addresses")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/account/reviews"
                      className="flex items-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      {t("nav.reviews")}
                    </Link>
                  </DropdownMenuItem>
                  {isRestaurantOwner && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/restaurant/dashboard"
                          className="flex items-center gap-2"
                        >
                          {t("nav.restaurantDashboard")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {isCourier && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          to="/courier/dashboard"
                          className="flex items-center gap-2"
                        >
                          {t("nav.courierDashboard")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-error focus:text-error"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-foreground hover:text-primary"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
              >
                {t("nav.register")}
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => dispatch(toggleMobileMenu())}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            <Link
              to="/restaurants"
              className="text-sm font-medium text-foreground"
              onClick={() => dispatch(setMobileMenuOpen(false))}
            >
              {t("nav.restaurants")}
            </Link>
            {/* Cart link — always visible in mobile menu */}
            <Link
              to="/cart"
              className="text-sm font-medium text-foreground"
              onClick={() => dispatch(setMobileMenuOpen(false))}
            >
              {t("nav.cart")}
              {itemCount > 0 && ` (${itemCount})`}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/account/orders"
                  className="text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {t("nav.orders")}
                </Link>
                <Link
                  to="/account/favorites"
                  className="text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {t("nav.favorites")}
                </Link>
                <Link
                  to="/account/addresses"
                  className="text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {t("nav.addresses")}
                </Link>
                <Link
                  to="/account/reviews"
                  className="text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {t("nav.reviews")}
                </Link>
                <Link
                  to="/account/notifications"
                  className="text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {t("nav.notifications")}
                </Link>
                <Link
                  to="/account/promotions"
                  className="text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {t("nav.promotions")}
                </Link>
                <Link
                  to="/account/profile"
                  className="text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {t("nav.profile")}
                </Link>
                {isRestaurantOwner && (
                  <>
                    <hr className="border-border" />
                    <Link
                      to="/restaurant/dashboard"
                      className="text-sm font-medium text-foreground"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                    >
                      {t("nav.restaurantDashboard")}
                    </Link>
                  </>
                )}
                {isCourier && (
                  <>
                    <hr className="border-border" />
                    <Link
                      to="/courier/dashboard"
                      className="text-sm font-medium text-foreground"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                    >
                      {t("nav.courierDashboard")}
                    </Link>
                  </>
                )}
                <hr className="border-border" />
                <button
                  onClick={() => {
                    dispatch(setMobileMenuOpen(false));
                    handleLogout();
                  }}
                  className="text-left text-sm font-medium text-error"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-primary"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  {t("nav.register")}
                </Link>
                <hr className="border-border" />
                <Link
                  to="/partner"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  <Store size={16} />
                  {t("nav.partnerWithUs")}
                </Link>
                <Link
                  to="/become-courier"
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                >
                  <Bike size={16} />
                  {t("nav.becomeCourier")}
                </Link>
              </>
            )}
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
      <CartSheet open={cartSheetOpen} onOpenChange={setCartSheetOpen} />
    </header>
  );
}
