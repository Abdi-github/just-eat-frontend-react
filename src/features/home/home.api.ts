import { baseApi } from "@/shared/api/baseApi";
import type {
  CuisineListResponse,
  CuisineQueryParams,
  RestaurantListResponse,
  RestaurantQueryParams,
  CitySearchResponse,
  CityListResponse,
  CantonListResponse,
} from "./home.types";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Cuisines
    getCuisines: builder.query<CuisineListResponse, CuisineQueryParams | void>({
      query: (params) => ({
        url: "/public/cuisines",
        params: params ?? { limit: 50, is_active: true },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Cuisine" as const,
                id,
              })),
              { type: "Cuisine", id: "LIST" },
            ]
          : [{ type: "Cuisine", id: "LIST" }],
    }),

    // Restaurants (featured for homepage)
    getHomeRestaurants: builder.query<
      RestaurantListResponse,
      RestaurantQueryParams
    >({
      query: (params) => ({
        url: "/public/restaurants",
        params,
      }),
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

    // Cities list
    getCities: builder.query<
      CityListResponse,
      { limit?: number; is_active?: boolean; search?: string } | void
    >({
      query: (params) => ({
        url: "/public/locations/cities",
        params: params ?? { limit: 100, is_active: true },
      }),
      providesTags: [{ type: "City", id: "LIST" }],
    }),

    // Location search (cantons + cities)
    searchLocations: builder.query<CitySearchResponse, string>({
      query: (q) => ({
        url: "/public/locations/cities/search",
        params: { q },
      }),
    }),

    // Cantons list
    getCantons: builder.query<
      CantonListResponse,
      { limit?: number; is_active?: boolean } | void
    >({
      query: (params) => ({
        url: "/public/locations/cantons",
        params: params ?? { limit: 50, is_active: true },
      }),
      providesTags: [{ type: "Canton", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCuisinesQuery,
  useGetHomeRestaurantsQuery,
  useGetCitiesQuery,
  useSearchLocationsQuery,
  useGetCantonsQuery,
} = homeApi;
