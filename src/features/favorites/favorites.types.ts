// Favorites feature types

export interface FavoriteRestaurant {
  id: string;
  _id: string;
  user_id: string;
  restaurant: {
    id: string;
    _id: string;
    name: string;
    slug: string;
    logo_url?: string;
    cover_image_url?: string;
    rating: number;
    review_count: number;
    delivery_fee: number;
    estimated_delivery_minutes?: { min: number; max: number };
    supports_delivery: boolean;
    supports_pickup: boolean;
    is_active: boolean;
  };
  created_at: string;
}

export interface FavoritesQueryParams {
  page?: number;
  limit?: number;
}

export interface ToggleFavoriteRequest {
  restaurant_id: string;
}

export interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  data: {
    is_favorited: boolean;
    favorite: FavoriteRestaurant | null;
  };
}

export interface FavoriteListResponse {
  success: boolean;
  message: string;
  data: FavoriteRestaurant[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FavoriteCheckResponse {
  success: boolean;
  data: {
    is_favorited: boolean;
  };
}
