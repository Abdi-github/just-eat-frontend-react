import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AccountLayout } from "@/layouts/AccountLayout";
import { RestaurantLayout } from "@/layouts/RestaurantLayout";
import { CourierLayout } from "@/layouts/CourierLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { NotFoundPage } from "@/shared/components/NotFoundPage";

// Lazy-loaded feature pages
const HomePage = lazy(() =>
  import("@/features/home").then((m) => ({ default: m.HomePage })),
);
const RestaurantListPage = lazy(() =>
  import("@/features/restaurants").then((m) => ({
    default: m.RestaurantListPage,
  })),
);
const RestaurantDetailPage = lazy(() =>
  import("@/features/restaurants").then((m) => ({
    default: m.RestaurantDetailPage,
  })),
);
const RestaurantExplorePage = lazy(() =>
  import("@/features/restaurants").then((m) => ({
    default: m.RestaurantExplorePage,
  })),
);
const SearchResultsPage = lazy(() =>
  import("@/features/search").then((m) => ({ default: m.SearchResultsPage })),
);
const CartPage = lazy(() =>
  import("@/features/cart").then((m) => ({ default: m.CartPage })),
);
const LoginPage = lazy(() =>
  import("@/features/auth").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/features/auth").then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth").then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import("@/features/auth").then((m) => ({ default: m.ResetPasswordPage })),
);
const PartnerPage = lazy(() =>
  import("@/features/auth").then((m) => ({ default: m.PartnerPage })),
);
const BecomeCourierPage = lazy(() =>
  import("@/features/auth").then((m) => ({ default: m.BecomeCourierPage })),
);
const ApplicationStatusPage = lazy(() =>
  import("@/features/auth").then((m) => ({
    default: m.ApplicationStatusPage,
  })),
);
const CheckoutPage = lazy(() =>
  import("@/features/checkout").then((m) => ({ default: m.CheckoutPage })),
);
const OrderConfirmationPage = lazy(() =>
  import("@/features/checkout").then((m) => ({
    default: m.OrderConfirmationPage,
  })),
);
const PaymentSimulationPage = lazy(() =>
  import("@/features/checkout").then((m) => ({
    default: m.PaymentSimulationPage,
  })),
);
const OrdersPage = lazy(() =>
  import("@/features/orders").then((m) => ({ default: m.OrdersPage })),
);
const OrderDetailPage = lazy(() =>
  import("@/features/orders").then((m) => ({ default: m.OrderDetailPage })),
);
const OrderTrackingPage = lazy(() =>
  import("@/features/orders").then((m) => ({ default: m.OrderTrackingPage })),
);
const ProfilePage = lazy(() =>
  import("@/features/profile").then((m) => ({ default: m.ProfilePage })),
);
const AddressesPage = lazy(() =>
  import("@/features/addresses").then((m) => ({ default: m.AddressesPage })),
);
const FavoritesPage = lazy(() =>
  import("@/features/favorites").then((m) => ({ default: m.FavoritesPage })),
);
const MyReviewsPage = lazy(() =>
  import("@/features/reviews").then((m) => ({ default: m.MyReviewsPage })),
);
const NotificationsPage = lazy(() =>
  import("@/features/notifications").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const PromotionsPage = lazy(() =>
  import("@/features/promotions").then((m) => ({ default: m.PromotionsPage })),
);
const RestaurantDashboardPage = lazy(() =>
  import("@/features/restaurant-dashboard").then((m) => ({
    default: m.RestaurantDashboardPage,
  })),
);
const MenuManagementPage = lazy(() =>
  import("@/features/restaurant-dashboard").then((m) => ({
    default: m.MenuManagementPage,
  })),
);
const RestaurantOrdersPage = lazy(() =>
  import("@/features/restaurant-dashboard").then((m) => ({
    default: m.RestaurantOrdersPage,
  })),
);
const RestaurantSettingsPage = lazy(() =>
  import("@/features/restaurant-dashboard").then((m) => ({
    default: m.RestaurantSettingsPage,
  })),
);
const RestaurantPromotionsPage = lazy(() =>
  import("@/features/restaurant-dashboard").then((m) => ({
    default: m.RestaurantPromotionsPage,
  })),
);
const RestaurantReviewsPage = lazy(() =>
  import("@/features/restaurant-dashboard").then((m) => ({
    default: m.RestaurantReviewsPage,
  })),
);
const RestaurantAnalyticsPage = lazy(() =>
  import("@/features/restaurant-dashboard").then((m) => ({
    default: m.RestaurantAnalyticsPage,
  })),
);
const CourierDashboardPage = lazy(() =>
  import("@/features/courier-dashboard").then((m) => ({
    default: m.CourierDashboardPage,
  })),
);
const ActiveDeliveryPage = lazy(() =>
  import("@/features/courier-dashboard").then((m) => ({
    default: m.ActiveDeliveryPage,
  })),
);
const DeliveryHistoryPage = lazy(() =>
  import("@/features/courier-dashboard").then((m) => ({
    default: m.DeliveryHistoryPage,
  })),
);
const AboutPage = lazy(() =>
  import("@/features/static").then((m) => ({ default: m.AboutPage })),
);
const TermsPage = lazy(() =>
  import("@/features/static").then((m) => ({ default: m.TermsPage })),
);
const PrivacyPage = lazy(() =>
  import("@/features/static").then((m) => ({ default: m.PrivacyPage })),
);
const ContactPage = lazy(() =>
  import("@/features/static").then((m) => ({ default: m.ContactPage })),
);

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="restaurants" element={<RestaurantListPage />} />
          <Route
            path="restaurants/explore"
            element={<RestaurantExplorePage />}
          />
          <Route path="restaurants/:slug" element={<RestaurantDetailPage />} />
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="partner" element={<PartnerPage />} />
          <Route path="become-courier" element={<BecomeCourierPage />} />
          <Route
            path="application-status"
            element={<ApplicationStatusPage />}
          />
          <Route path="about" element={<AboutPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected customer routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<OrdersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="orders/:id/tracking" element={<OrderTrackingPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="reviews" element={<MyReviewsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="promotions" element={<PromotionsPage />} />
          </Route>

          {/* Checkout (MainLayout, protected) */}
          <Route element={<MainLayout />}>
            <Route path="checkout" element={<CheckoutPage />} />
            <Route
              path="order-confirmation/:id"
              element={<OrderConfirmationPage />}
            />
          </Route>

          {/* Payment simulation (sandbox — no layout for immersive provider UX) */}
          <Route
            path="payment/simulate/:provider/:txnId"
            element={<PaymentSimulationPage />}
          />
        </Route>

        {/* Restaurant Owner routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RoleRoute
                allowedRoles={["restaurant_owner", "restaurant_staff"]}
              />
            }
          >
            <Route path="restaurant" element={<RestaurantLayout />}>
              <Route path="dashboard" element={<RestaurantDashboardPage />} />
              <Route path="menu" element={<MenuManagementPage />} />
              <Route path="orders" element={<RestaurantOrdersPage />} />
              <Route path="settings" element={<RestaurantSettingsPage />} />
              <Route path="promotions" element={<RestaurantPromotionsPage />} />
              <Route path="reviews" element={<RestaurantReviewsPage />} />
              <Route path="analytics" element={<RestaurantAnalyticsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Courier routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["courier"]} />}>
            <Route path="courier" element={<CourierLayout />}>
              <Route path="dashboard" element={<CourierDashboardPage />} />
              <Route path="active" element={<ActiveDeliveryPage />} />
              <Route path="history" element={<DeliveryHistoryPage />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route element={<MainLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
