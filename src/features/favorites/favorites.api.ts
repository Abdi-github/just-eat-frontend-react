import { baseApi } from "@/shared/api/baseApi";
import type {
  FavoriteListResponse,
  FavoritesQueryParams,
  ToggleFavoriteRequest,
  ToggleFavoriteResponse,
  FavoriteCheckResponse,
} from "./favorites.types";

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<
      FavoriteListResponse,
      FavoritesQueryParams | void
    >({
      query: (params) => ({
        url: "/public/favorites",
        params: params || { limit: 20 },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Favorite" as const,
                id,
              })),
              { type: "Favorite", id: "LIST" },
            ]
          : [{ type: "Favorite", id: "LIST" }],
    }),

    toggleFavorite: builder.mutation<
      ToggleFavoriteResponse,
      ToggleFavoriteRequest
    >({
      query: (body) => ({
        url: "/public/favorites/toggle",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Favorite", id: "LIST" }],
    }),

    checkFavorite: builder.query<FavoriteCheckResponse, string>({
      query: (restaurantId) => `/public/favorites/check/${restaurantId}`,
      providesTags: (_result, _error, restaurantId) => [
        { type: "Favorite", id: restaurantId },
      ],
    }),

    removeFavorite: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (restaurantId) => ({
        url: `/public/favorites/${restaurantId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Favorite", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
  useCheckFavoriteQuery,
  useRemoveFavoriteMutation,
} = favoritesApi;
