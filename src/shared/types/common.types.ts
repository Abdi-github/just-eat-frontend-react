export type SupportedLanguage = "de" | "en" | "fr" | "it";

export type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "REJECTED"
  | "PREPARING"
  | "READY"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "stripe_card" | "twint" | "postfinance" | "cash";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "REFUNDED"
  | "FAILED";

export type OrderType = "delivery" | "pickup";

export interface TranslatedField {
  en: string;
  fr: string;
  de: string;
  it: string;
}
