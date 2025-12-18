import { baseApi } from "@/shared/api/baseApi";
import type {
  OrderListResponse,
  OrderDetailResponse,
  DeliveryTrackingResponse,
  OrdersQueryParams,
  CancelOrderRequest,
} from "./orders.types";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<OrderListResponse, OrdersQueryParams>({
      query: (params) => {
        return {
          url: "/public/orders/my",
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Order" as const,
                id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    getOrderDetail: builder.query<OrderDetailResponse, string>({
      query: (id) => `/public/orders/${id}`,
      providesTags: (result) =>
        result ? [{ type: "Order", id: result.data.id }] : [],
    }),

    cancelOrder: builder.mutation<
      OrderDetailResponse,
      { id: string; body: CancelOrderRequest }
    >({
      query: ({ id, body }) => {
        return {
          url: `/public/orders/${id}/cancel`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: (result, _error, { id }) =>
        result
          ? [
              { type: "Order", id },
              { type: "Order", id: "LIST" },
            ]
          : [],
    }),

    trackDelivery: builder.query<DeliveryTrackingResponse, string>({
      query: (orderId) => `/public/deliveries/${orderId}/track`,
      providesTags: (result) =>
        result ? [{ type: "Delivery", id: result.data.order_id }] : [],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrderDetailQuery,
  useCancelOrderMutation,
  useTrackDeliveryQuery,
} = ordersApi;
