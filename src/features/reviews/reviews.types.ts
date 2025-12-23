// Reviews feature types

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";

export interface Review {
  id: string;
  _id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
  restaurant: {
    id: string;
    name: string;
    slug: string;
  };
  order_id: string;
  rating: number;
  comment?: string;
  is_verified: boolean;
  status: ReviewStatus;
  restaurant_reply?: string;
  restaurant_reply_at?: string;
  moderation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  restaurant_id: string;
  order_id: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

export interface ReviewsQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface RatingSummary {
  average_rating: number;
  review_count: number;
  distribution: Record<string, number>;
}

// API Responses
export interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review;
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
