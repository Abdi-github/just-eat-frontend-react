import { baseApi } from "@/shared/api/baseApi";
import type {
  ProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  NotificationSettingsResponse,
  UpdateNotificationSettingsRequest,
  MessageResponse,
} from "./profile.types";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/public/users/profile",
      providesTags: [{ type: "Profile", id: "ME" }],
    }),

    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (body) => {
        return {
          url: "/public/users/profile",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: [{ type: "Profile", id: "ME" }],
    }),

    changePassword: builder.mutation<MessageResponse, ChangePasswordRequest>({
      query: (body) => {
        // TODO: consider logging attempts here for debugging auth issues
        return {
          url: "/public/users/password",
          method: "PUT",
          body,
        };
      },
    }),

    uploadAvatar: builder.mutation<ProfileResponse, FormData>({
      query: (body) => ({
        url: "/public/users/avatar",
        method: "POST",
        body,
        formData: true,
      }),
      invalidatesTags: [{ type: "Profile", id: "ME" }],
    }),

    deleteAvatar: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/public/users/avatar",
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Profile", id: "ME" }],
    }),

    getNotificationSettings: builder.query<NotificationSettingsResponse, void>({
      query: () => "/public/users/settings",
      providesTags: [{ type: "Profile", id: "SETTINGS" }],
    }),

    updateNotificationSettings: builder.mutation<
      NotificationSettingsResponse,
      UpdateNotificationSettingsRequest
    >({
      query: (body) => ({
        url: "/public/users/settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Profile", id: "SETTINGS" }],
    }),

    deactivateAccount: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/public/users/deactivate",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useDeactivateAccountMutation,
} = profileApi;
