import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { setCredentials, logout } from "@/shared/state/auth.slice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;

    if (state.auth.token) {
      headers.set("Authorization", `Bearer ${state.auth.token}`);
    }

    headers.set("Accept-Language", state.language.current);
    headers.set("Content-Type", "application/json");

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/public/auth/refresh",
          method: "POST",
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const data = refreshResult.data as {
          data: {
            access_token: string;
            refresh_token: string;
            user: RootState["auth"]["user"];
          };
        };
        api.dispatch(
          setCredentials({
            token: data.data.access_token,
            refreshToken: data.data.refresh_token,
            user: data.data.user!,
          }),
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Restaurant",
    "Menu",
    "MenuItem",
    "MenuCategory",
    "Order",
    "Review",
    "Favorite",
    "Address",
    "Cuisine",
    "Brand",
    "Canton",
    "City",
    "Notification",
    "Coupon",
    "StampCard",
    "Delivery",
    "Profile",
    "Search",
    "Analytics",
  ],
  endpoints: () => ({}),
});
