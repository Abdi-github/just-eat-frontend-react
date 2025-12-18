import { baseApi } from "@/shared/api/baseApi";
import type {
  CreateOrderRequest,
  OrderResponse,
  InitiatePaymentRequest,
  PaymentResponse,
  ValidateCouponRequest,
  CouponValidationResponse,
  AddressListResponse,
  AddressResponse,
  CreateAddressRequest,
} from "./checkout.types";

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Orders
    createOrder: builder.mutation<OrderResponse, CreateOrderRequest>({
      query: (body) => {
        return {
          url: "/public/orders",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    // Payments
    initiatePayment: builder.mutation<PaymentResponse, InitiatePaymentRequest>({
      query: (body) => {
        return {
          url: "/public/payments/initiate",
          method: "POST",
          body,
        };
      },
    }),

    getPaymentStatus: builder.query<PaymentResponse, string>({
      query: (orderId) => `/public/payments/${orderId}/status`,
    }),

    // Sandbox: simulate TWINT/PostFinance payment confirmation
    simulateConfirmPayment: builder.mutation<
      PaymentResponse,
      { provider: "twint" | "postfinance"; transactionId: string }
    >({
      query: ({ provider, transactionId }) => ({
        url: `/public/payments/${provider}/simulate-confirm/${transactionId}`,
        method: "POST",
      }),
    }),

    // Coupon validation
    validateCheckoutCoupon: builder.mutation<
      CouponValidationResponse,
      ValidateCouponRequest
    >({
      query: (body) => {
        return {
          url: "/public/promotions/coupons/validate",
          method: "POST",
          body,
        };
      },
    }),

    // Addresses (used in checkout address selector)
    getAddresses: builder.query<AddressListResponse, void>({
      query: () => "/public/addresses?limit=10&sort=is_default&order=desc",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Address" as const,
                id,
              })),
              { type: "Address", id: "LIST" },
            ]
          : [{ type: "Address", id: "LIST" }],
    }),

    createAddress: builder.mutation<AddressResponse, CreateAddressRequest>({
      query: (body) => ({
        url: "/public/addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    setDefaultAddress: builder.mutation<AddressResponse, string>({
      query: (id) => ({
        url: `/public/addresses/${id}/default`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useInitiatePaymentMutation,
  useGetPaymentStatusQuery,
  useSimulateConfirmPaymentMutation,
  useValidateCheckoutCouponMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useSetDefaultAddressMutation,
} = checkoutApi;
