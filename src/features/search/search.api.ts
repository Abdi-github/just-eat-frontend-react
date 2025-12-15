import { baseApi } from "@/shared/api/baseApi";
import type {
  RestaurantSearchResponse,
  MenuSearchResponse,
  SearchSuggestionsResponse,
  SearchQueryParams,
  MenuSearchQueryParams,
  SuggestionQueryParams,
  CitySearchResponse,
  CuisineListResponse,
} from "./search.types";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Restaurant search
    searchRestaurants: builder.query<
      RestaurantSearchResponse,
      SearchQueryParams
    >({
      query: (params) => ({
        url: "/public/search/restaurants",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Search" as const,
                id,
              })),
              { type: "Search", id: "RESULTS" },
            ]
          : [{ type: "Search", id: "RESULTS" }],
    }),

    // Menu item search within a restaurant
    searchMenuItems: builder.query<
      MenuSearchResponse,
      { restaurantId: string; params: MenuSearchQueryParams }
    >({
      query: ({ restaurantId, params }) => ({
        url: `/public/search/restaurants/${restaurantId}/menu`,
        params,
      }),
      providesTags: (result, _error, { restaurantId }) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "MenuItem" as const,
                id,
              })),
              { type: "Menu", id: restaurantId },
            ]
          : [{ type: "Menu", id: restaurantId }],
    }),

    // Autocomplete suggestions
    getSuggestions: builder.query<
      SearchSuggestionsResponse,
      SuggestionQueryParams
    >({
      query: (params) => ({
        url: "/public/search/suggestions",
        params,
      }),
      // Suggestions don't need cache invalidation — always fresh
    }),

    // Location search (city autocomplete — self-contained in search feature)
    searchCityLocations: builder.query<CitySearchResponse, string>({
      query: (q) => ({
        url: "/public/locations/cities/search",
        params: { q },
      }),
    }),

    // Cuisines for filter (self-contained)
    getSearchCuisines: builder.query<CuisineListResponse, void>({
      query: () => ({
        url: "/public/cuisines",
        params: { limit: 50, is_active: true },
      }),
      providesTags: [{ type: "Cuisine", id: "LIST" }],
    }),
  }),
});

export const {
  useSearchRestaurantsQuery,
  useSearchMenuItemsQuery,
  useGetSuggestionsQuery,
  useSearchCityLocationsQuery,
  useGetSearchCuisinesQuery,
} = searchApi;
