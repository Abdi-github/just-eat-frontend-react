// Profile feature types

export interface UserProfile {
  id: string;
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  preferred_language: string;
  status: string;
  is_active: boolean;
  is_verified: boolean;
  notification_preferences?: NotificationPreferences;
  roles: Array<string | { id: string; name: string; code: string }>;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email_order_updates: boolean;
  email_promotions: boolean;
  email_newsletter: boolean;
  push_enabled: boolean;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  preferred_language?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UpdateNotificationSettingsRequest {
  email_order_updates?: boolean;
  email_promotions?: boolean;
  email_newsletter?: boolean;
  push_enabled?: boolean;
}

// API Responses
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface NotificationSettingsResponse {
  success: boolean;
  message: string;
  data: {
    notification_preferences: NotificationPreferences;
    preferred_language: string;
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
