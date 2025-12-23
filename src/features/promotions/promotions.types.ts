// Promotions feature types

export type DiscountType = "PERCENTAGE" | "FLAT";
export type CouponScope = "PLATFORM" | "RESTAURANT";
export type CouponStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";
export type RewardType = "PERCENTAGE" | "FLAT";

// ─── Coupon ──────────────────────────────────────
export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  minimum_order: number;
  maximum_discount: number | null;
  scope: CouponScope;
  restaurant_id: string | null;
  restaurant_name: string | null;
  valid_from: string | null;
  valid_until: string | null;
  usage_limit: number | null;
  per_user_limit: number;
  usage_count: number;
  is_active: boolean;
  status: CouponStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount_amount?: number;
  message: string;
}

export interface ValidateCouponRequest {
  code: string;
  restaurant_id: string;
  subtotal: number;
}

// ─── Stamp Card ──────────────────────────────────
export interface StampCard {
  id: string;
  name: string;
  description: string | null;
  restaurant_id: string;
  restaurant_name: string | null;
  stamps_required: number;
  reward_description: string;
  reward_type: RewardType;
  reward_value: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStampProgress {
  id: string;
  stamp_card_id: string;
  stamp_card_name: string;
  restaurant_id: string;
  restaurant_name?: string;
  stamps_collected: number;
  stamps_required: number;
  is_complete: boolean;
  reward_description: string;
  reward_redeemed: boolean;
  created_at: string;
  updated_at: string;
}

// ─── API Responses ───────────────────────────────
export interface CouponValidationResponse {
  success: boolean;
  message: string;
  data: CouponValidationResult;
}

export interface StampProgressListResponse {
  success: boolean;
  message: string;
  data: UserStampProgress[];
}

export interface StampProgressResponse {
  success: boolean;
  message: string;
  data: UserStampProgress;
}

export interface StampCardListResponse {
  success: boolean;
  message: string;
  data: StampCard[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
