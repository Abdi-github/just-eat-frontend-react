// Restaurant Dashboard feature types

// ─── Multilingual Fields ──────────────────────────
export interface MultiLangField {
  en: string;
  fr: string;
  de: string;
  it: string;
}

export type PartialMultiLangField = Partial<MultiLangField>;

// ─── Restaurant ───────────────────────────────────
export interface OwnerRestaurant {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description?: MultiLangField;
  address: string;
  postal_code: string;
  city_id: string;
  canton_id: string;
  brand_id?: string;
  owner_id: string;
  phone?: string;
  email?: string;
  rating: number;
  review_count: number;
  logo_url?: string;
  cover_image_url?: string;
  delivery_fee: number;
  minimum_order: number;
  estimated_delivery_minutes?: { min: number; max: number };
  supports_delivery: boolean;
  supports_pickup: boolean;
  is_partner_delivery: boolean;
  status: string;
  is_active: boolean;
  is_featured: boolean;
  cuisines?: Array<{ _id: string; name: string; slug: string }>;
  city?: { _id: string; name: string; slug: string };
  canton?: { _id: string; name: string; slug: string; code: string };
  created_at: string;
  updated_at: string;
}

export interface UpdateRestaurantRequest {
  name?: string;
  slug?: string;
  description?: PartialMultiLangField;
  address?: string;
  postal_code?: string;
  city_id?: string;
  canton_id?: string;
  brand_id?: string;
  phone?: string;
  email?: string;
  delivery_fee?: number;
  minimum_order?: number;
  estimated_delivery_minutes?: { min: number; max: number };
  supports_delivery?: boolean;
  supports_pickup?: boolean;
  is_partner_delivery?: boolean;
}

// ─── Menu Category ────────────────────────────────
export interface MenuCategory {
  id: string;
  _id: string;
  restaurant_id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  item_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMenuCategoryRequest {
  name: MultiLangField;
  slug?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateMenuCategoryRequest {
  name?: PartialMultiLangField;
  slug?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface ReorderRequest {
  order: Array<{ id: string; sort_order: number }>;
}

// ─── Menu Item ────────────────────────────────────
export type Allergen =
  | "gluten"
  | "crustaceans"
  | "eggs"
  | "fish"
  | "peanuts"
  | "soybeans"
  | "milk"
  | "nuts"
  | "celery"
  | "mustard"
  | "sesame"
  | "sulphites"
  | "lupin"
  | "molluscs";

export type DietaryFlag =
  | "vegetarian"
  | "vegan"
  | "halal"
  | "kosher"
  | "gluten_free"
  | "lactose_free"
  | "organic"
  | "sugar_free";

export interface MenuItem {
  id: string;
  _id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  thumbnail_url?: string;
  allergens: Allergen[];
  dietary_flags: DietaryFlag[];
  is_available: boolean;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMenuItemRequest {
  category_id: string;
  name: MultiLangField;
  description?: PartialMultiLangField;
  price: number;
  allergens?: Allergen[];
  dietary_flags?: DietaryFlag[];
  is_available?: boolean;
  is_popular?: boolean;
  sort_order?: number;
}

export interface UpdateMenuItemRequest {
  category_id?: string;
  name?: PartialMultiLangField;
  description?: PartialMultiLangField;
  price?: number;
  allergens?: Allergen[];
  dietary_flags?: DietaryFlag[];
  is_available?: boolean;
  is_popular?: boolean;
  sort_order?: number;
}

// ─── Restaurant Order ─────────────────────────────
export type RestaurantOrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "REJECTED"
  | "PREPARING"
  | "READY"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface RestaurantOrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
}

export interface RestaurantOrder {
  id: string;
  _id: string;
  order_number: string;
  user_id: string;
  restaurant_id: string;
  order_type: "delivery" | "pickup";
  status: RestaurantOrderStatus;
  items: RestaurantOrderItem[];
  subtotal: number;
  delivery_fee: number;
  service_fee: number;
  tip: number;
  discount: number;
  total: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  special_instructions?: string;
  estimated_delivery_at?: string;
  placed_at: string;
  accepted_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  delivered_at?: string;
  customer?: {
    first_name: string;
    last_name: string;
    phone?: string;
  };
  delivery_address?: {
    street: string;
    street_number: string;
    postal_code: string;
    city?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UpdateOrderStatusRequest {
  status: RestaurantOrderStatus;
  rejection_reason?: string;
}

export interface AssignCourierRequest {
  courier_id: string;
}

// ─── Restaurant Review ────────────────────────────
export interface RestaurantReview {
  id: string;
  _id: string;
  user: { id: string; first_name: string; last_name: string };
  restaurant: { id: string; name: string; slug: string };
  order_id: string;
  rating: number;
  comment?: string;
  is_verified: boolean;
  status: string;
  restaurant_reply?: string;
  restaurant_reply_at?: string;
  moderation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ReplyReviewRequest {
  restaurant_reply: string;
}

// ─── Coupon ───────────────────────────────────────
export interface Coupon {
  id: string;
  _id: string;
  code: string;
  description?: string;
  discount_type: "PERCENTAGE" | "FLAT";
  discount_value: number;
  minimum_order: number;
  maximum_discount?: number;
  scope: "PLATFORM" | "RESTAURANT";
  restaurant_id?: string;
  valid_from?: string;
  valid_until?: string;
  usage_limit?: number;
  per_user_limit: number;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCouponRequest {
  code: string;
  description?: string;
  discount_type: "PERCENTAGE" | "FLAT";
  discount_value: number;
  minimum_order?: number;
  maximum_discount?: number;
  scope: "RESTAURANT";
  restaurant_id: string;
  valid_from?: string;
  valid_until?: string;
  usage_limit?: number;
  per_user_limit?: number;
  is_active?: boolean;
}

export type UpdateCouponRequest = Partial<Omit<CreateCouponRequest, "code">>;

// ─── Stamp Card ───────────────────────────────────
export interface StampCard {
  id: string;
  _id: string;
  name: string;
  description?: string;
  restaurant_id: string;
  stamps_required: number;
  reward_description: string;
  reward_type: "PERCENTAGE" | "FLAT";
  reward_value: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateStampCardRequest {
  name: string;
  description?: string;
  restaurant_id: string;
  stamps_required: number;
  reward_description: string;
  reward_type: "PERCENTAGE" | "FLAT";
  reward_value: number;
  valid_from?: string;
  valid_until?: string;
  is_active?: boolean;
}

export type UpdateStampCardRequest = Partial<
  Omit<CreateStampCardRequest, "restaurant_id">
>;

// ─── Analytics ────────────────────────────────────
export type AnalyticsPreset =
  | "today"
  | "yesterday"
  | "this_week"
  | "this_month"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "this_year";

export interface DashboardOverview {
  total_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  avg_order_value: number;
  avg_rating: number;
  review_count: number;
}

export interface DashboardAnalytics {
  restaurant_id: string;
  date_range: { from: string; to: string };
  overview: DashboardOverview;
  order_status_breakdown: Record<string, number>;
  order_type_breakdown: Record<string, number>;
  payment_method_breakdown: Record<string, number>;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopItem {
  menu_item_id: string;
  name: string;
  total_ordered: number;
  total_revenue: number;
}

export interface AnalyticsQueryParams {
  preset?: AnalyticsPreset;
  from?: string;
  to?: string;
  period?: "daily" | "weekly" | "monthly";
  limit?: number;
}

// ─── API Responses ────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── Query Params ─────────────────────────────────
export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: RestaurantOrderStatus;
  sort?: string;
  date_from?: string;
  date_to?: string;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  rating?: number;
  status?: string;
}

export interface CouponQueryParams {
  page?: number;
  limit?: number;
  scope?: "PLATFORM" | "RESTAURANT";
  status?: "active" | "inactive" | "expired";
}

export interface StampCardQueryParams {
  page?: number;
  limit?: number;
  is_active?: boolean;
}

export interface MenuCategoryQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  is_active?: boolean;
}

export interface MenuItemQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
}
