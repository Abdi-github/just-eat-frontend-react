import { baseApi } from "@/shared/api/baseApi";
import type {
  ReviewResponse,
  ReviewListResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewsQueryParams,
} from "./reviews.types";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyReviews: builder.query<ReviewListResponse, ReviewsQueryParams | void>({
      query: (params) => ({
        url: "/public/reviews/my",
        params: params || { limit: 20, sort: "-created_at" },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Review" as const,
                id,
              })),
              { type: "Review", id: "MY_LIST" },
            ]
          : [{ type: "Review", id: "MY_LIST" }],
    }),

    createReview: builder.mutation<ReviewResponse, CreateReviewRequest>({
      query: (body) => ({
        url: "/public/reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Review", id: "MY_LIST" },
        { type: "Review", id: "LIST" },
      ],
    }),

    updateReview: builder.mutation<
      ReviewResponse,
      { id: string; body: UpdateReviewRequest }
    >({
      query: ({ id, body }) => ({
        url: `/public/reviews/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: "Review", id },
        { type: "Review", id: "MY_LIST" },
        { type: "Review", id: "LIST" },
      ],
    }),

    deleteReview: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/public/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Review", id: "MY_LIST" },
        { type: "Review", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMyReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
