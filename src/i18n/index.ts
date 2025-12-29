import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import commonEn from "./locales/en/common.json";
import commonFr from "./locales/fr/common.json";
import commonDe from "./locales/de/common.json";
import commonIt from "./locales/it/common.json";
import homeEn from "./locales/en/home.json";
import homeFr from "./locales/fr/home.json";
import homeDe from "./locales/de/home.json";
import homeIt from "./locales/it/home.json";
import restaurantsEn from "./locales/en/restaurants.json";
import restaurantsFr from "./locales/fr/restaurants.json";
import restaurantsDe from "./locales/de/restaurants.json";
import restaurantsIt from "./locales/it/restaurants.json";
import searchEn from "./locales/en/search.json";
import searchFr from "./locales/fr/search.json";
import searchDe from "./locales/de/search.json";
import searchIt from "./locales/it/search.json";
import cartEn from "./locales/en/cart.json";
import cartFr from "./locales/fr/cart.json";
import cartDe from "./locales/de/cart.json";
import cartIt from "./locales/it/cart.json";
import authEn from "./locales/en/auth.json";
import authFr from "./locales/fr/auth.json";
import authDe from "./locales/de/auth.json";
import authIt from "./locales/it/auth.json";
import checkoutEn from "./locales/en/checkout.json";
import checkoutFr from "./locales/fr/checkout.json";
import checkoutDe from "./locales/de/checkout.json";
import checkoutIt from "./locales/it/checkout.json";
import ordersEn from "./locales/en/orders.json";
import ordersFr from "./locales/fr/orders.json";
import ordersDe from "./locales/de/orders.json";
import ordersIt from "./locales/it/orders.json";
import profileEn from "./locales/en/profile.json";
import profileFr from "./locales/fr/profile.json";
import profileDe from "./locales/de/profile.json";
import profileIt from "./locales/it/profile.json";
import addressesEn from "./locales/en/addresses.json";
import addressesFr from "./locales/fr/addresses.json";
import addressesDe from "./locales/de/addresses.json";
import addressesIt from "./locales/it/addresses.json";
import favoritesEn from "./locales/en/favorites.json";
import favoritesFr from "./locales/fr/favorites.json";
import favoritesDe from "./locales/de/favorites.json";
import favoritesIt from "./locales/it/favorites.json";
import reviewsEn from "./locales/en/reviews.json";
import reviewsFr from "./locales/fr/reviews.json";
import reviewsDe from "./locales/de/reviews.json";
import reviewsIt from "./locales/it/reviews.json";
import restaurantDashboardEn from "./locales/en/restaurant-dashboard.json";
import restaurantDashboardFr from "./locales/fr/restaurant-dashboard.json";
import restaurantDashboardDe from "./locales/de/restaurant-dashboard.json";
import restaurantDashboardIt from "./locales/it/restaurant-dashboard.json";
import courierDashboardEn from "./locales/en/courier-dashboard.json";
import courierDashboardFr from "./locales/fr/courier-dashboard.json";
import courierDashboardDe from "./locales/de/courier-dashboard.json";
import courierDashboardIt from "./locales/it/courier-dashboard.json";
import notificationsEn from "./locales/en/notifications.json";
import notificationsFr from "./locales/fr/notifications.json";
import notificationsDe from "./locales/de/notifications.json";
import notificationsIt from "./locales/it/notifications.json";
import promotionsEn from "./locales/en/promotions.json";
import promotionsFr from "./locales/fr/promotions.json";
import promotionsDe from "./locales/de/promotions.json";
import promotionsIt from "./locales/it/promotions.json";
import staticEn from "./locales/en/static.json";
import staticFr from "./locales/fr/static.json";
import staticDe from "./locales/de/static.json";
import staticIt from "./locales/it/static.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "de",
    supportedLngs: ["de", "en", "fr", "it"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    resources: {
      en: {
        common: commonEn,
        home: homeEn,
        restaurants: restaurantsEn,
        search: searchEn,
        cart: cartEn,
        auth: authEn,
        checkout: checkoutEn,
        orders: ordersEn,
        profile: profileEn,
        addresses: addressesEn,
        favorites: favoritesEn,
        reviews: reviewsEn,
        "restaurant-dashboard": restaurantDashboardEn,
        "courier-dashboard": courierDashboardEn,
        notifications: notificationsEn,
        promotions: promotionsEn,
        static: staticEn,
      },
      fr: {
        common: commonFr,
        home: homeFr,
        restaurants: restaurantsFr,
        search: searchFr,
        cart: cartFr,
        auth: authFr,
        checkout: checkoutFr,
        orders: ordersFr,
        profile: profileFr,
        addresses: addressesFr,
        favorites: favoritesFr,
        reviews: reviewsFr,
        "restaurant-dashboard": restaurantDashboardFr,
        "courier-dashboard": courierDashboardFr,
        notifications: notificationsFr,
        promotions: promotionsFr,
        static: staticFr,
      },
      de: {
        common: commonDe,
        home: homeDe,
        restaurants: restaurantsDe,
        search: searchDe,
        cart: cartDe,
        auth: authDe,
        checkout: checkoutDe,
        orders: ordersDe,
        profile: profileDe,
        addresses: addressesDe,
        favorites: favoritesDe,
        reviews: reviewsDe,
        "restaurant-dashboard": restaurantDashboardDe,
        "courier-dashboard": courierDashboardDe,
        notifications: notificationsDe,
        promotions: promotionsDe,
        static: staticDe,
      },
      it: {
        common: commonIt,
        home: homeIt,
        restaurants: restaurantsIt,
        search: searchIt,
        cart: cartIt,
        auth: authIt,
        checkout: checkoutIt,
        orders: ordersIt,
        profile: profileIt,
        addresses: addressesIt,
        favorites: favoritesIt,
        reviews: reviewsIt,
        "restaurant-dashboard": restaurantDashboardIt,
        "courier-dashboard": courierDashboardIt,
        notifications: notificationsIt,
        promotions: promotionsIt,
        static: staticIt,
      },
    },
  });

export default i18n;
