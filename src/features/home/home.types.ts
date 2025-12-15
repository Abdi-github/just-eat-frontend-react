// Home feature types

export interface Cuisine {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  restaurant_count?: number;
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

export interface CityListResponse {
  success: boolean;
  message: string;
  data: City[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Canton {
  id: string;
  code: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface CantonListResponse {
  success: boolean;
  message: string;
  data: Canton[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CuisineQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  is_active?: boolean;
  search?: string;
  lang?: string;
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
