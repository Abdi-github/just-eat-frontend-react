import { baseApi } from "@/shared/api/baseApi";
import type {
  ApiResponse,
  ApiListResponse,
  OwnerRestaurant,
  UpdateRestaurantRequest,
  MenuCategory,
  CreateMenuCategoryRequest,
  UpdateMenuCategoryRequest,
  ReorderRequest,
  MenuItem,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  RestaurantOrder,
  UpdateOrderStatusRequest,
  AssignCourierRequest,
  RestaurantReview,
  ReplyReviewRequest,
  Coupon,
  CreateCouponRequest,
  UpdateCouponRequest,
  StampCard,
  CreateStampCardRequest,
  UpdateStampCardRequest,
  DashboardAnalytics,
  RevenueDataPoint,
  TopItem,
  OrderQueryParams,
  ReviewQueryParams,
  CouponQueryParams,
  StampCardQueryParams,
  MenuCategoryQueryParams,
  MenuItemQueryParams,
  AnalyticsQueryParams,
} from "./restaurant-dashboard.types";

export const restaurantDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Restaurant Management ────────────────────────
    getMyRestaurants: builder.query<ApiListResponse<OwnerRestaurant>, void>({
      query: () => "/restaurant/my",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Restaurant" as const,
                id,
              })),
              { type: "Restaurant", id: "OWNER_LIST" },
            ]
          : [{ type: "Restaurant", id: "OWNER_LIST" }],
    }),

    updateRestaurant: builder.mutation<
      ApiResponse<OwnerRestaurant>,
      { id: string; body: UpdateRestaurantRequest }
    >({
      query: ({ id, body }) => ({
        url: `/restaurant/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Restaurant", id },
        { type: "Restaurant", id: "OWNER_LIST" },
      ],
    }),

    toggleRestaurantActive: builder.mutation<
      ApiResponse<OwnerRestaurant>,
      { id: string; is_active: boolean }
    >({
      query: ({ id, is_active }) => ({
        url: `/restaurant/${id}/toggle-active`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Restaurant", id },
        { type: "Restaurant", id: "OWNER_LIST" },
      ],
    }),

    uploadRestaurantLogo: builder.mutation<
      ApiResponse<OwnerRestaurant>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/restaurant/${id}/logo`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Restaurant", id },
      ],
    }),

    deleteRestaurantLogo: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/restaurant/${id}/logo`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Restaurant", id }],
    }),

    uploadRestaurantCover: builder.mutation<
      ApiResponse<OwnerRestaurant>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/restaurant/${id}/cover-image`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Restaurant", id },
      ],
    }),

    deleteRestaurantCover: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/restaurant/${id}/cover-image`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Restaurant", id }],
    }),

    // ─── Menu Categories ──────────────────────────────
    getMenuCategories: builder.query<
      ApiListResponse<MenuCategory>,
      { restaurantId: string; params?: MenuCategoryQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/restaurant/${restaurantId}/menu/categories`,
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "MenuCategory" as const,
                id,
              })),
              { type: "MenuCategory", id: "LIST" },
            ]
          : [{ type: "MenuCategory", id: "LIST" }],
    }),

    getMenuCategory: builder.query<
      ApiResponse<MenuCategory>,
      { restaurantId: string; categoryId: string }
    >({
      query: ({ restaurantId, categoryId }) =>
        `/restaurant/${restaurantId}/menu/categories/${categoryId}`,
      providesTags: (_result, _error, { categoryId }) => [
        { type: "MenuCategory", id: categoryId },
      ],
    }),

    createMenuCategory: builder.mutation<
      ApiResponse<MenuCategory>,
      { restaurantId: string; body: CreateMenuCategoryRequest }
    >({
      query: ({ restaurantId, body }) => ({
        url: `/restaurant/${restaurantId}/menu/categories`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "MenuCategory", id: "LIST" }],
    }),

    updateMenuCategory: builder.mutation<
      ApiResponse<MenuCategory>,
      {
        restaurantId: string;
        categoryId: string;
        body: UpdateMenuCategoryRequest;
      }
    >({
      query: ({ restaurantId, categoryId, body }) => ({
        url: `/restaurant/${restaurantId}/menu/categories/${categoryId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: "MenuCategory", id: categoryId },
        { type: "MenuCategory", id: "LIST" },
      ],
    }),

    deleteMenuCategory: builder.mutation<
      ApiResponse<null>,
      { restaurantId: string; categoryId: string }
    >({
      query: ({ restaurantId, categoryId }) => ({
        url: `/restaurant/${restaurantId}/menu/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "MenuCategory", id: "LIST" },
        { type: "MenuItem", id: "LIST" },
      ],
    }),

    reorderMenuCategories: builder.mutation<
      ApiResponse<null>,
      { restaurantId: string; body: ReorderRequest }
    >({
      query: ({ restaurantId, body }) => ({
        url: `/restaurant/${restaurantId}/menu/categories/reorder`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "MenuCategory", id: "LIST" }],
    }),

    // ─── Menu Items ───────────────────────────────────
    getMenuItems: builder.query<
      ApiListResponse<MenuItem>,
      { restaurantId: string; params?: MenuItemQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/restaurant/${restaurantId}/menu/items`,
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "MenuItem" as const,
                id,
              })),
              { type: "MenuItem", id: "LIST" },
            ]
          : [{ type: "MenuItem", id: "LIST" }],
    }),

    getMenuItem: builder.query<
      ApiResponse<MenuItem>,
      { restaurantId: string; itemId: string }
    >({
      query: ({ restaurantId, itemId }) =>
        `/restaurant/${restaurantId}/menu/items/${itemId}`,
      providesTags: (_result, _error, { itemId }) => [
        { type: "MenuItem", id: itemId },
      ],
    }),

    createMenuItem: builder.mutation<
      ApiResponse<MenuItem>,
      { restaurantId: string; body: CreateMenuItemRequest }
    >({
      query: ({ restaurantId, body }) => ({
        url: `/restaurant/${restaurantId}/menu/items`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "MenuItem", id: "LIST" },
        { type: "MenuCategory", id: "LIST" },
      ],
    }),

    updateMenuItem: builder.mutation<
      ApiResponse<MenuItem>,
      { restaurantId: string; itemId: string; body: UpdateMenuItemRequest }
    >({
      query: ({ restaurantId, itemId, body }) => ({
        url: `/restaurant/${restaurantId}/menu/items/${itemId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "MenuItem", id: itemId },
        { type: "MenuItem", id: "LIST" },
      ],
    }),

    deleteMenuItem: builder.mutation<
      ApiResponse<null>,
      { restaurantId: string; itemId: string }
    >({
      query: ({ restaurantId, itemId }) => ({
        url: `/restaurant/${restaurantId}/menu/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "MenuItem", id: "LIST" },
        { type: "MenuCategory", id: "LIST" },
      ],
    }),

    toggleMenuItemAvailability: builder.mutation<
      ApiResponse<MenuItem>,
      { restaurantId: string; itemId: string; is_available: boolean }
    >({
      query: ({ restaurantId, itemId, is_available }) => ({
        url: `/restaurant/${restaurantId}/menu/items/${itemId}/availability`,
        method: "PATCH",
        body: { is_available },
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "MenuItem", id: itemId },
        { type: "MenuItem", id: "LIST" },
      ],
    }),

    reorderMenuItems: builder.mutation<
      ApiResponse<null>,
      { restaurantId: string; body: ReorderRequest }
    >({
      query: ({ restaurantId, body }) => ({
        url: `/restaurant/${restaurantId}/menu/items/reorder`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "MenuItem", id: "LIST" }],
    }),

    uploadMenuItemImage: builder.mutation<
      ApiResponse<MenuItem>,
      { restaurantId: string; itemId: string; formData: FormData }
    >({
      query: ({ restaurantId, itemId, formData }) => ({
        url: `/restaurant/${restaurantId}/menu/items/${itemId}/image`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "MenuItem", id: itemId },
      ],
    }),

    deleteMenuItemImage: builder.mutation<
      ApiResponse<null>,
      { restaurantId: string; itemId: string }
    >({
      query: ({ restaurantId, itemId }) => ({
        url: `/restaurant/${restaurantId}/menu/items/${itemId}/image`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: "MenuItem", id: itemId },
      ],
    }),

    // ─── Orders ───────────────────────────────────────
    getRestaurantOrders: builder.query<
      ApiListResponse<RestaurantOrder>,
      { restaurantId: string; params?: OrderQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/restaurant/${restaurantId}/orders`,
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Order" as const,
                id,
              })),
              { type: "Order", id: "RESTAURANT_LIST" },
            ]
          : [{ type: "Order", id: "RESTAURANT_LIST" }],
    }),

    getActiveRestaurantOrders: builder.query<
      ApiListResponse<RestaurantOrder>,
      string
    >({
      query: (restaurantId) => `/restaurant/${restaurantId}/orders/active`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Order" as const,
                id,
              })),
              { type: "Order", id: "RESTAURANT_ACTIVE" },
            ]
          : [{ type: "Order", id: "RESTAURANT_ACTIVE" }],
    }),

    updateRestaurantOrderStatus: builder.mutation<
      ApiResponse<RestaurantOrder>,
      { restaurantId: string; orderId: string; body: UpdateOrderStatusRequest }
    >({
      query: ({ restaurantId, orderId, body }) => ({
        url: `/restaurant/${restaurantId}/orders/${orderId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "RESTAURANT_LIST" },
        { type: "Order", id: "RESTAURANT_ACTIVE" },
        { type: "Analytics" },
      ],
    }),

    assignCourier: builder.mutation<
      ApiResponse<RestaurantOrder>,
      { restaurantId: string; orderId: string; body: AssignCourierRequest }
    >({
      query: ({ restaurantId, orderId, body }) => ({
        url: `/restaurant/${restaurantId}/orders/${orderId}/assign-courier`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "Order", id: orderId },
      ],
    }),

    // ─── Reviews ──────────────────────────────────────
    getOwnerRestaurantReviews: builder.query<
      ApiListResponse<RestaurantReview>,
      { restaurantId: string; params?: ReviewQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/restaurant/${restaurantId}/reviews`,
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Review" as const,
                id,
              })),
              { type: "Review", id: "RESTAURANT_LIST" },
            ]
          : [{ type: "Review", id: "RESTAURANT_LIST" }],
    }),

    replyToReview: builder.mutation<
      ApiResponse<RestaurantReview>,
      { restaurantId: string; reviewId: string; body: ReplyReviewRequest }
    >({
      query: ({ restaurantId, reviewId, body }) => ({
        url: `/restaurant/${restaurantId}/reviews/${reviewId}/reply`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { reviewId }) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "RESTAURANT_LIST" },
      ],
    }),

    // ─── Coupons ──────────────────────────────────────
    getRestaurantCoupons: builder.query<
      ApiListResponse<Coupon>,
      { restaurantId: string; params?: CouponQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/restaurant/${restaurantId}/promotions/coupons`,
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Coupon" as const,
                id,
              })),
              { type: "Coupon", id: "LIST" },
            ]
          : [{ type: "Coupon", id: "LIST" }],
    }),

    getCoupon: builder.query<
      ApiResponse<Coupon>,
      { restaurantId: string; couponId: string }
    >({
      query: ({ restaurantId, couponId }) =>
        `/restaurant/${restaurantId}/promotions/coupons/${couponId}`,
      providesTags: (_result, _error, { couponId }) => [
        { type: "Coupon", id: couponId },
      ],
    }),

    createCoupon: builder.mutation<
      ApiResponse<Coupon>,
      { restaurantId: string; body: CreateCouponRequest }
    >({
      query: ({ restaurantId, body }) => ({
        url: `/restaurant/${restaurantId}/promotions/coupons`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),

    updateCoupon: builder.mutation<
      ApiResponse<Coupon>,
      { restaurantId: string; couponId: string; body: UpdateCouponRequest }
    >({
      query: ({ restaurantId, couponId, body }) => ({
        url: `/restaurant/${restaurantId}/promotions/coupons/${couponId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { couponId }) => [
        { type: "Coupon", id: couponId },
        { type: "Coupon", id: "LIST" },
      ],
    }),

    deleteCoupon: builder.mutation<
      ApiResponse<null>,
      { restaurantId: string; couponId: string }
    >({
      query: ({ restaurantId, couponId }) => ({
        url: `/restaurant/${restaurantId}/promotions/coupons/${couponId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),

    // ─── Stamp Cards ──────────────────────────────────
    getOwnerStampCards: builder.query<
      ApiListResponse<StampCard>,
      { restaurantId: string; params?: StampCardQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/restaurant/${restaurantId}/promotions/stamps`,
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "StampCard" as const,
                id,
              })),
              { type: "StampCard", id: "LIST" },
            ]
          : [{ type: "StampCard", id: "LIST" }],
    }),

    getStampCard: builder.query<
      ApiResponse<StampCard>,
      { restaurantId: string; stampCardId: string }
    >({
      query: ({ restaurantId, stampCardId }) =>
        `/restaurant/${restaurantId}/promotions/stamps/${stampCardId}`,
      providesTags: (_result, _error, { stampCardId }) => [
        { type: "StampCard", id: stampCardId },
      ],
    }),

    createStampCard: builder.mutation<
      ApiResponse<StampCard>,
      { restaurantId: string; body: CreateStampCardRequest }
    >({
      query: ({ restaurantId, body }) => ({
        url: `/restaurant/${restaurantId}/promotions/stamps`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "StampCard", id: "LIST" }],
    }),

    updateStampCard: builder.mutation<
      ApiResponse<StampCard>,
      {
        restaurantId: string;
        stampCardId: string;
        body: UpdateStampCardRequest;
      }
    >({
      query: ({ restaurantId, stampCardId, body }) => ({
        url: `/restaurant/${restaurantId}/promotions/stamps/${stampCardId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { stampCardId }) => [
        { type: "StampCard", id: stampCardId },
        { type: "StampCard", id: "LIST" },
      ],
    }),

    deleteStampCard: builder.mutation<
      ApiResponse<null>,
      { restaurantId: string; stampCardId: string }
    >({
      query: ({ restaurantId, stampCardId }) => ({
        url: `/restaurant/${restaurantId}/promotions/stamps/${stampCardId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "StampCard", id: "LIST" }],
    }),

    // ─── Analytics ────────────────────────────────────
    getDashboardAnalytics: builder.query<
      ApiResponse<DashboardAnalytics>,
      { restaurantId: string; params?: AnalyticsQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/restaurant/${restaurantId}/analytics/dashboard`,
        params,
      }),
      providesTags: [{ type: "Analytics", id: "DASHBOARD" }],
    }),

    getRevenueAnalytics: builder.query<
      ApiResponse<RevenueDataPoint[]>,
      { restaurantId: string; params?: AnalyticsQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/restaurant/${restaurantId}/analytics/revenue`,
        params,
      }),
      providesTags: [{ type: "Analytics", id: "REVENUE" }],
    }),

    getTopItems: builder.query<
      ApiResponse<TopItem[]>,
      { restaurantId: string; params?: AnalyticsQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/restaurant/${restaurantId}/analytics/top-items`,
        params,
      }),
      providesTags: [{ type: "Analytics", id: "TOP_ITEMS" }],
    }),
  }),
});

export const {
  // Restaurant
  useGetMyRestaurantsQuery,
  useUpdateRestaurantMutation,
  useToggleRestaurantActiveMutation,
  useUploadRestaurantLogoMutation,
  useDeleteRestaurantLogoMutation,
  useUploadRestaurantCoverMutation,
  useDeleteRestaurantCoverMutation,
  // Menu Categories
  useGetMenuCategoriesQuery,
  useGetMenuCategoryQuery,
  useCreateMenuCategoryMutation,
  useUpdateMenuCategoryMutation,
  useDeleteMenuCategoryMutation,
  useReorderMenuCategoriesMutation,
  // Menu Items
  useGetMenuItemsQuery,
  useGetMenuItemQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useToggleMenuItemAvailabilityMutation,
  useReorderMenuItemsMutation,
  useUploadMenuItemImageMutation,
  useDeleteMenuItemImageMutation,
  // Orders
  useGetRestaurantOrdersQuery,
  useGetActiveRestaurantOrdersQuery,
  useUpdateRestaurantOrderStatusMutation,
  useAssignCourierMutation,
  // Reviews
  useGetOwnerRestaurantReviewsQuery,
  useReplyToReviewMutation,
  // Coupons
  useGetRestaurantCouponsQuery,
  useGetCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  // Stamp Cards
  useGetOwnerStampCardsQuery,
  useGetStampCardQuery,
  useCreateStampCardMutation,
  useUpdateStampCardMutation,
  useDeleteStampCardMutation,
  // Analytics
  useGetDashboardAnalyticsQuery,
  useGetRevenueAnalyticsQuery,
  useGetTopItemsQuery,
} = restaurantDashboardApi;
