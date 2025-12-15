// ── Search Feature Types ──

// Search suggestion (autocomplete)
export interface SearchSuggestion {
  type: "restaurant" | "cuisine";
  id: string;
  name: string;
  slug: string;
  extra?: string; // city name for restaurant, "{count} restaurants" for cuisine
}

export interface SearchSuggestionsResponse {
  success: boolean;
  message: string;
  data: {
    restaurants: SearchSuggestion[];
    cuisines: SearchSuggestion[];
  };
}

// Restaurant search result (lighter than full Restaurant type)
export interface RestaurantSearchResult {
  id: string;
  name: string;
  slug: string;
  address: string;
  postal_code: string;
  rating: number;
  review_count: number;
  logo_url: string | null;
  cover_image_url: string | null;
  delivery_fee: number | null;
  minimum_order: number | null;
  estimated_delivery_minutes: { min: number; max: number } | null;
  supports_delivery: boolean;
  supports_pickup: boolean;
  is_featured: boolean;
  city?: { id: string; name: string; slug: string } | null;
  canton?: { id: string; name: string; slug: string; code?: string } | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
    logo_url?: string | null;
  } | null;
  cuisines?: { id: string; name: string; slug: string }[];
}

export interface RestaurantSearchResponse {
  success: boolean;
  message: string;
  data: RestaurantSearchResult[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Menu item search result
export interface MenuItemSearchResult {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
  allergens: string[];
  dietary_flags: string[];
  category?: { id: string; name: string; slug: string } | null;
  restaurant_id: string;
}

export interface MenuSearchResponse {
  success: boolean;
  message: string;
  data: MenuItemSearchResult[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Search query params
export interface SearchQueryParams {
  q?: string;
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
  max_delivery_fee?: number;
  order_type?: "delivery" | "pickup";
  is_featured?: boolean;
  lang?: string;
}

export interface MenuSearchQueryParams {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  category_id?: string;
  min_price?: number;
  max_price?: number;
  is_available?: boolean;
  is_popular?: boolean;
  allergens?: string;
  dietary_flags?: string;
  lang?: string;
}

export interface SuggestionQueryParams {
  q: string;
  limit?: number;
  lang?: string;
}

// City type (for location search within this feature)
export interface City {
  id: string;
  canton_id: string;
  canton?: {
    id: string;
    name: string;
    slug: string;
    code?: string;
  };
  name: string;
  slug: string;
  postal_codes: number[];
  is_active: boolean;
  restaurant_count?: number;
}

export interface CitySearchResponse {
  success: boolean;
  message: string;
  data: {
    cantons: Array<{
      id: string;
      code: string;
      name: string;
      slug: string;
    }>;
    cities: City[];
  };
}

// Cuisine type (for filter dropdown)
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
