// Courier Dashboard feature types

// ─── Delivery Status ─────────────────────────────
export type DeliveryStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

// Statuses a courier can transition to
export type CourierDeliveryStatusUpdate =
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED";

// Statuses a courier can set on orders
export type CourierOrderStatusUpdate = "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";

// ─── Delivery DTO ────────────────────────────────
export interface DeliveryAddress {
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
  floor?: string;
  instructions?: string;
}

export interface CourierLocation {
  lat: number;
  lng: number;
  updated_at: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  order_number?: string;
  restaurant_id: string;
  restaurant_name?: string;
  restaurant_address?: string;
  courier_id: string | null;
  status: DeliveryStatus;
  pickup_address: string;
  delivery_address: DeliveryAddress;
  delivery_fee: number;
  distance_km: number | null;
  estimated_pickup_at: string | null;
  estimated_delivery_at: string | null;
  assigned_at: string | null;
  picked_up_at: string | null;
  in_transit_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  courier_location: CourierLocation | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Courier Order DTO ───────────────────────────
export interface CourierOrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string | null;
  options?: Array<{ name: string; price: number }>;
}

export interface CourierOrder {
  id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name?: string;
  courier_id?: string | null;
  delivery_address_id?: string | null;
  order_type: "delivery" | "pickup";
  status: string;
  items: CourierOrderItem[];
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  tip: number;
  discount: number;
  total: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  special_instructions?: string | null;
  estimated_delivery_at?: string | null;
  placed_at: string;
  accepted_at?: string | null;
  picked_up_at?: string | null;
  in_transit_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// ─── Query Params ────────────────────────────────
export interface AvailableDeliveriesParams {
  page?: number;
  limit?: number;
  city?: string;
  postal_code?: string;
}

export interface DeliveryHistoryParams {
  page?: number;
  limit?: number;
  sort?: string;
  status?: DeliveryStatus;
  date_from?: string;
  date_to?: string;
}

export interface CourierOrdersParams {
  page?: number;
  limit?: number;
  sort?: string;
  status?: string;
}

// ─── Request Bodies ──────────────────────────────
export interface UpdateDeliveryStatusRequest {
  status: CourierDeliveryStatusUpdate;
}

export interface UpdateLocationRequest {
  lat: number;
  lng: number;
}

export interface UpdateOrderStatusRequest {
  status: CourierOrderStatusUpdate;
}

// ─── API Responses ───────────────────────────────
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface DeliveryResponse {
  success: boolean;
  data: Delivery;
}

export interface DeliveryListResponse {
  success: boolean;
  data: Delivery[];
  meta?: PaginationMeta;
}

export interface CourierOrderResponse {
  success: boolean;
  data: CourierOrder;
}

export interface CourierOrderListResponse {
  success: boolean;
  data: CourierOrder[];
  meta?: PaginationMeta;
}
