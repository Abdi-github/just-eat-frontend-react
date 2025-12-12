// Auth request/response types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  preferred_language?: "en" | "fr" | "de" | "it";
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  preferred_language: string;
  status: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  roles: string[];
  permissions: string[];
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    tokens: AuthTokens;
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface MeResponse {
  success: boolean;
  data: AuthUser;
}

// Restaurant owner registration
export interface RegisterRestaurantRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  preferred_language?: "en" | "fr" | "de" | "it";
  restaurant_name: string;
  restaurant_address: string;
  restaurant_postal_code: string;
  restaurant_city_id: string;
  restaurant_canton_id: string;
  restaurant_phone?: string;
  restaurant_email?: string;
  application_note?: string;
}

// Courier registration
export interface RegisterCourierRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  preferred_language?: "en" | "fr" | "de" | "it";
  vehicle_type: "bicycle" | "motorcycle" | "car" | "scooter";
  date_of_birth?: string;
  application_note?: string;
}

// Application status response
export interface ApplicationStatusResponse {
  success: boolean;
  data: {
    application_status: "none" | "pending_approval" | "approved" | "rejected";
    application_type: "restaurant_owner" | "courier" | null;
    application_note?: string;
    application_rejection_reason?: string;
    application_reviewed_at?: string;
    restaurant?: {
      _id: string;
      name: string;
      slug: string;
      status: string;
    };
  };
}
