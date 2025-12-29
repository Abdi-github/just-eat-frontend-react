export const APP_NAME = "just-eat.ch";

export const SUPPORTED_LANGUAGES = ["de", "en", "fr", "it"] as const;

export const DEFAULT_LANGUAGE = "de";

export const CURRENCY = "CHF";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4005/api/v1";

export const ORDER_STATUS_MAP: Record<string, string> = {
  PLACED: "info",
  ACCEPTED: "success",
  REJECTED: "error",
  PREPARING: "warning",
  READY: "info",
  PICKED_UP: "success",
  IN_TRANSIT: "info",
  DELIVERED: "success",
  CANCELLED: "error",
};

export const PAYMENT_METHODS = [
  { value: "stripe_card", label: "Credit Card" },
  { value: "twint", label: "TWINT" },
  { value: "postfinance", label: "PostFinance" },
  { value: "cash", label: "Cash" },
] as const;

export const USER_ROLES = {
  CUSTOMER: "customer",
  RESTAURANT_OWNER: "restaurant_owner",
  RESTAURANT_STAFF: "restaurant_staff",
  COURIER: "courier",
  SUPER_ADMIN: "super_admin",
  PLATFORM_ADMIN: "platform_admin",
  SUPPORT_AGENT: "support_agent",
} as const;
