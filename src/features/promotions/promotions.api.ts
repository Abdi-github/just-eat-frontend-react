import { baseApi } from "@/shared/api/baseApi";
import type {
  CouponValidationResponse,
  StampProgressListResponse,
  StampProgressResponse,
  StampCardListResponse,
  ValidateCouponRequest,
} from "./promotions.types";

export const promotionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation<
      CouponValidationResponse,
      ValidateCouponRequest
    >({
      query: (body) => ({
        url: "/public/promotions/coupons/validate",
        method: "POST",
        body,
      }),
    }),

    getMyStampProgress: builder.query<StampProgressListResponse, void>({
      query: () => "/public/promotions/stamps/my-progress",
      providesTags: [{ type: "StampCard", id: "MY_PROGRESS" }],
    }),

    redeemStampCard: builder.mutation<StampProgressResponse, string>({
      query: (id) => ({
        url: `/public/promotions/stamps/${id}/redeem`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "StampCard", id: "MY_PROGRESS" }],
    }),

    getRestaurantStampCards: builder.query<
      StampCardListResponse,
      { restaurantId: string; page?: number; limit?: number }
    >({
      query: ({ restaurantId, ...params }) => ({
        url: `/public/promotions/stamps/restaurant/${restaurantId}`,
        params,
      }),
      providesTags: (result, error, { restaurantId }) => [
        { type: "StampCard", id: restaurantId },
      ],
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetMyStampProgressQuery,
  useRedeemStampCardMutation,
  useGetRestaurantStampCardsQuery,
} = promotionsApi;
