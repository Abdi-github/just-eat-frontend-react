// ── Restaurant Feature Types ──

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  address: string;
  postal_code: string;
  city_id: string;
  canton_id: string;
  city?: { id: string; name: string; slug: string } | null;
  canton?: { id: string; name: string; slug: string; code?: string } | null;
  brand_id?: string | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
    logo_url?: string | null;
  } | null;
  owner_id?: string | null;
  rating: number;
  review_count: number;
  logo_url?: string | null;
  cover_image_url?: string | null;
  delivery_fee?: number | null;
  minimum_order?: number | null;
  estimated_delivery_minutes?: { min: number; max: number } | null;
  supports_delivery: boolean;
  supports_pickup: boolean;
  is_partner_delivery: boolean;
  phone?: string | null;
  email?: string | null;
  status: string;
  is_active: boolean;
  is_featured: boolean;
  cuisines?: { id: string; name: string; slug: string }[];
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RestaurantQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  city_id?: string;
  canton_id?: string;
  cuisine_id?: string;
  brand_id?: string;
  postal_code?: string;
  min_rating?: number;
  is_active?: boolean;
  status?: string;
  search?: string;
  lang?: string;
  is_featured?: boolean;
}

export interface RestaurantCursorQueryParams {
  limit?: number;
  cursor?: string;
  direction?: "next" | "prev";
  sort?: string;
  order?: "asc" | "desc";
  city_id?: string;
  canton_id?: string;
  cuisine_id?: string;
  brand_id?: string;
  postal_code?: string;
  min_rating?: number;
  is_active?: boolean;
  status?: string;
  search?: string;
}

// ── Menu Types ──

export interface MenuItem {
  id: string;
  category_id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  allergens: string[];
  dietary_flags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  items?: MenuItem[];
  created_at: string;
  updated_at: string;
}

export interface FullMenu {
  restaurant_id: string;
  categories: MenuCategory[];
}

// ── Review Types ──

export interface Review {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  restaurant: {
    id: string;
    name: string;
    slug: string;
  } | null;
  order_id: string;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  status: string;
  restaurant_reply: string | null;
  restaurant_reply_at: string | null;
  moderation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface RatingSummary {
  average_rating: number;
  review_count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// ── API Response Types ──

export interface RestaurantListResponse {
  success: boolean;
  message: string;
  data: Restaurant[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface RestaurantCursorResponse {
  success: boolean;
  message: string;
  data: {
    restaurants: Restaurant[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    total: number;
  };
}

export interface RestaurantDetailResponse {
  success: boolean;
  message: string;
  data: Restaurant;
}

export interface MenuResponse {
  success: boolean;
  message: string;
  data: FullMenu;
}

export interface ReviewListResponse {
  success: boolean;
  message: string;
  data: Review[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface RatingSummaryResponse {
  success: boolean;
  message: string;
  data: RatingSummary;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  rating?: number;
}

// ── Cuisine (reused from home) ──

export interface Cuisine {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
}

export interface CuisineListResponse {
  success: boolean;
  message: string;
  data: Cuisine[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
