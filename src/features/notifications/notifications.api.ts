import { baseApi } from "@/shared/api/baseApi";
import type {
  NotificationListResponse,
  NotificationCountResponse,
  NotificationResponse,
  BulkActionResponse,
  NotificationListParams,
} from "./notifications.types";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationListResponse,
      NotificationListParams | void
    >({
      query: (params) => ({
        url: "/public/notifications",
        params: params || { page: 1, limit: 20 },
      }),
      providesTags: [{ type: "Notification", id: "LIST" }],
    }),

    getNotificationCount: builder.query<NotificationCountResponse, void>({
      query: () => "/public/notifications/count",
      providesTags: [{ type: "Notification", id: "COUNT" }],
    }),

    markNotificationRead: builder.mutation<NotificationResponse, string>({
      query: (id) => ({
        url: `/public/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "COUNT" },
      ],
    }),

    markAllNotificationsRead: builder.mutation<BulkActionResponse, void>({
      query: () => ({
        url: "/public/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "COUNT" },
      ],
    }),

    deleteNotification: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/public/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "COUNT" },
      ],
    }),

    deleteAllNotifications: builder.mutation<BulkActionResponse, void>({
      query: () => ({
        url: "/public/notifications",
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "COUNT" },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationsApi;
