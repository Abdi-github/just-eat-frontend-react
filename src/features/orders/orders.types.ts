// Orders feature types — extends/re-exports checkout types for order display

import type {
  OrderType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  OrderItem,
} from "@/features/checkout/checkout.types";

export type { OrderType, OrderStatus, PaymentMethod, PaymentStatus, OrderItem };

// Extended Order with populated relations (for detail view)
export interface OrderDetail {
  id: string;
  _id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name: string;
  courier_id?: string;
  delivery_address_id?: string;
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
  special_instructions?: string;
  // Timestamp fields for timeline
  estimated_delivery_at?: string;
  placed_at: string;
  accepted_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  preparing_at?: string;
  ready_at?: string;
  picked_up_at?: string;
  in_transit_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  // Populated relations
  restaurant?: {
    name: string;
    slug: string;
    logo_url?: string;
    address?: string;
    postal_code?: string;
    phone?: string;
  };
  courier?: {
    first_name: string;
    last_name: string;
    phone?: string;
  };
  delivery_address?: {
    label: string;
    street: string;
    street_number: string;
    floor?: string;
    postal_code: string;
    city_id?: string;
    instructions?: string;
  };
}

// Order list item (lighter than detail)
export interface OrderListItem {
  id: string;
  _id: string;
  order_number: string;
  restaurant_id: string;
  restaurant_name: string;
  order_type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  placed_at: string;
  created_at: string;
  restaurant?: {
    name: string;
    slug: string;
    logo_url?: string;
  };
}

// Delivery tracking
export interface DeliveryTracking {
  id: string;
  order_id: string;
  order_number: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_address: string;
  courier_id?: string;
  status: string;
  pickup_address: string;
  delivery_address?: {
    street: string;
    street_number: string;
    postal_code: string;
    city: string;
    floor?: string;
    instructions?: string;
  };
  delivery_fee: number;
  distance_km?: number;
  estimated_pickup_at?: string;
  estimated_delivery_at?: string;
  assigned_at?: string;
  picked_up_at?: string;
  in_transit_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  courier_location?: {
    lat: number;
    lng: number;
    updated_at: string;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Timeline entry (derived from timestamps)
export interface TimelineEntry {
  status: OrderStatus;
  timestamp: string;
  isActive: boolean;
  isCurrent: boolean;
}

// Query params
export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  order_type?: OrderType;
  sort?: string;
}

// Cancel order
export interface CancelOrderRequest {
  cancellation_reason: string;
}

// API responses
export interface OrderListResponse {
  success: boolean;
  message: string;
  data: OrderListItem[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: OrderDetail;
}

export interface DeliveryTrackingResponse {
  success: boolean;
  message: string;
  data: DeliveryTracking;
}
