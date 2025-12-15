import { baseApi } from "@/shared/api/baseApi";
import type {
  RestaurantListResponse,
  RestaurantDetailResponse,
  RestaurantQueryParams,
  RestaurantCursorQueryParams,
  RestaurantCursorResponse,
  MenuResponse,
  ReviewListResponse,
  ReviewQueryParams,
  RatingSummaryResponse,
} from "./restaurants.types";

export const restaurantsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // List restaurants (paginated + filterable)
    getRestaurants: builder.query<
      RestaurantListResponse,
      RestaurantQueryParams
    >({
      query: (params) => {
        return {
          url: "/public/restaurants",
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Restaurant" as const,
                id,
              })),
              { type: "Restaurant", id: "LIST" },
            ]
          : [{ type: "Restaurant", id: "LIST" }],
    }),

    // List restaurants with cursor-based pagination
    getRestaurantsCursor: builder.query<
      RestaurantCursorResponse,
      RestaurantCursorQueryParams
    >({
      query: (params) => ({
        url: "/public/restaurants/cursor",
        params,
      }),
      providesTags: (result) =>
        result?.data?.restaurants
          ? [
              ...result.data.restaurants.map(({ id }) => ({
                type: "Restaurant" as const,
                id,
              })),
              { type: "Restaurant", id: "CURSOR_LIST" },
            ]
          : [{ type: "Restaurant", id: "CURSOR_LIST" }],
    }),

    // Get restaurant by slug
    getRestaurantBySlug: builder.query<RestaurantDetailResponse, string>({
      query: (slug) => {
        return `/public/restaurants/slug/${slug}`;
      },
      providesTags: (result) =>
        result?.data ? [{ type: "Restaurant", id: result.data.id }] : [],
    }),

    // Get full menu (categories + items)
    getRestaurantMenu: builder.query<MenuResponse, string>({
      query: (restaurantId) => `/public/restaurants/${restaurantId}/menu`,
      providesTags: (_result, _error, id) => [{ type: "Menu", id }],
    }),

    // Get restaurant reviews (paginated)
    getRestaurantReviews: builder.query<
      ReviewListResponse,
      { restaurantId: string } & ReviewQueryParams
    >({
      query: ({ restaurantId, ...params }) => ({
        url: `/public/reviews/restaurant/${restaurantId}`,
        params,
      }),
      providesTags: (_result, _error, { restaurantId }) => [
        { type: "Review", id: `restaurant-${restaurantId}` },
      ],
    }),

    // Get rating summary
    getRatingSummary: builder.query<RatingSummaryResponse, string>({
      query: (restaurantId) =>
        `/public/reviews/restaurant/${restaurantId}/summary`,
      providesTags: (_result, _error, id) => [
        { type: "Review", id: `summary-${id}` },
      ],
    }),
  }),
});

// Cuisine endpoint for filters (avoids cross-feature import)
const cuisineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCuisinesForFilter: builder.query<
      {
        success: boolean;
        data: Array<{
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
        }>;
      },
      { limit?: number; is_active?: boolean } | void
    >({
      query: (params) => ({
        url: "/public/cuisines",
        params: params ?? { limit: 50, is_active: true },
      }),
      providesTags: [{ type: "Cuisine", id: "LIST" }],
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useGetRestaurantsCursorQuery,
  useGetRestaurantBySlugQuery,
  useGetRestaurantMenuQuery,
  useGetRestaurantReviewsQuery,
  useGetRatingSummaryQuery,
} = restaurantsApi;

export const { useGetCuisinesForFilterQuery } = cuisineApi;
