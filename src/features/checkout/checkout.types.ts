// Checkout & Order types

export type OrderType = "delivery" | "pickup";
export type PaymentMethod = "card" | "twint" | "postfinance" | "cash";
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
export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

// Address types
export interface Address {
  _id: string;
  id: string;
  user_id: string;
  label: string;
  street: string;
  street_number: string;
  floor?: string;
  postal_code: string;
  city_id: string;
  canton_id: string;
  country: string;
  instructions?: string;
  is_default: boolean;
  city?: { id: string; name: string; slug: string };
  canton?: { id: string; name: string; slug: string; code: string };
  created_at: string;
  updated_at: string;
}

export interface CreateAddressRequest {
  label: string;
  street: string;
  street_number: string;
  floor?: string;
  postal_code: string;
  city_id: string;
  canton_id: string;
  instructions?: string;
  is_default?: boolean;
}

// Order item
export interface OrderItemRequest {
  menu_item_id: string;
  quantity: number;
  special_instructions?: string;
  options?: { name: string; price: number }[];
}

export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  options?: { name: string; price: number }[];
}

// Create order
export interface CreateOrderRequest {
  restaurant_id: string;
  order_type: OrderType;
  delivery_address_id?: string;
  payment_method: PaymentMethod;
  items: OrderItemRequest[];
  tip?: number;
  special_instructions?: string;
  coupon_code?: string;
}

export interface Order {
  id: string;
  _id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  order_type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  tip: number;
  discount: number;
  total: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  delivery_address_id?: string;
  special_instructions?: string;
  estimated_delivery_at?: string;
  placed_at: string;
  created_at: string;
  updated_at: string;
  restaurant?: {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
  };
}

// Payment
export interface InitiatePaymentRequest {
  order_id: string;
  payment_method: PaymentMethod;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentTransaction {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  provider_name: string;
  status: string;
  provider_transaction_id?: string;
  redirect_url?: string;
  client_secret?: string;
  stripe_client_secret?: string;
  session_expires_at?: string;
  created_at: string;
  updated_at: string;
}

// Coupon validation
export interface ValidateCouponRequest {
  code: string;
  restaurant_id: string;
  subtotal: number;
}

export interface CouponValidation {
  valid: boolean;
  coupon?: {
    code: string;
    discount_type: "PERCENTAGE" | "FLAT";
    discount_value: number;
    maximum_discount?: number;
    minimum_order?: number;
  };
  discount_amount?: number;
  message: string;
}

// API responses
export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface AddressListResponse {
  success: boolean;
  data: Address[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AddressResponse {
  success: boolean;
  data: Address;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: PaymentTransaction;
}

export interface CouponValidationResponse {
  success: boolean;
  message?: string;
  data: CouponValidation;
}
