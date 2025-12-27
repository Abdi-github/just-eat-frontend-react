import { baseApi } from "@/shared/api/baseApi";
import type {
  DeliveryResponse,
  DeliveryListResponse,
  CourierOrderResponse,
  CourierOrderListResponse,
  AvailableDeliveriesParams,
  DeliveryHistoryParams,
  CourierOrdersParams,
  UpdateDeliveryStatusRequest,
  UpdateLocationRequest,
  UpdateOrderStatusRequest,
} from "./courier-dashboard.types";

export const courierDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Deliveries ────────────────────────────────
    getAvailableDeliveries: builder.query<
      DeliveryListResponse,
      AvailableDeliveriesParams | void
    >({
      query: (params) => ({
        url: "/courier/deliveries/available",
        params: params || { limit: 20 },
      }),
      providesTags: [{ type: "Delivery", id: "AVAILABLE" }],
    }),

    getActiveDelivery: builder.query<DeliveryResponse, void>({
      query: () => "/courier/deliveries/active",
      providesTags: [{ type: "Delivery", id: "ACTIVE" }],
    }),

    getDeliveryHistory: builder.query<
      DeliveryListResponse,
      DeliveryHistoryParams | void
    >({
      query: (params) => ({
        url: "/courier/deliveries/history",
        params: params || { limit: 20, sort: "-created_at" },
      }),
      providesTags: [{ type: "Delivery", id: "HISTORY" }],
    }),

    acceptDelivery: builder.mutation<DeliveryResponse, string>({
      query: (id) => ({
        url: `/courier/deliveries/${id}/accept`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Delivery", id: "AVAILABLE" },
        { type: "Delivery", id: "ACTIVE" },
      ],
    }),

    updateDeliveryStatus: builder.mutation<
      DeliveryResponse,
      { id: string; body: UpdateDeliveryStatusRequest }
    >({
      query: ({ id, body }) => ({
        url: `/courier/deliveries/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Delivery", id: "ACTIVE" },
        { type: "Delivery", id: "HISTORY" },
      ],
    }),

    updateCourierLocation: builder.mutation<
      DeliveryResponse,
      { id: string; body: UpdateLocationRequest }
    >({
      query: ({ id, body }) => ({
        url: `/courier/deliveries/${id}/location`,
        method: "PATCH",
        body,
      }),
    }),

    // ─── Orders ────────────────────────────────────
    getCourierOrders: builder.query<
      CourierOrderListResponse,
      CourierOrdersParams | void
    >({
      query: (params) => ({
        url: "/courier/orders",
        params: params || { limit: 20, sort: "-created_at" },
      }),
      providesTags: [{ type: "Order", id: "COURIER_LIST" }],
    }),

    getActiveOrders: builder.query<CourierOrderListResponse, void>({
      query: () => "/courier/orders/active",
      providesTags: [{ type: "Order", id: "COURIER_ACTIVE" }],
    }),

    updateOrderDeliveryStatus: builder.mutation<
      CourierOrderResponse,
      { id: string; body: UpdateOrderStatusRequest }
    >({
      query: ({ id, body }) => ({
        url: `/courier/orders/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [
        { type: "Order", id: "COURIER_ACTIVE" },
        { type: "Order", id: "COURIER_LIST" },
        { type: "Delivery", id: "ACTIVE" },
      ],
    }),
  }),
});

export const {
  useGetAvailableDeliveriesQuery,
  useGetActiveDeliveryQuery,
  useGetDeliveryHistoryQuery,
  useAcceptDeliveryMutation,
  useUpdateDeliveryStatusMutation,
  useUpdateCourierLocationMutation,
  useGetCourierOrdersQuery,
  useGetActiveOrdersQuery,
  useUpdateOrderDeliveryStatusMutation,
} = courierDashboardApi;
