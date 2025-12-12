import { baseApi } from "@/shared/api/baseApi";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  RegisterRestaurantRequest,
  RegisterCourierRequest,
  AuthResponse,
  MessageResponse,
  MeResponse,
  ApplicationStatusResponse,
} from "./auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => {
        return {
          url: "/public/auth/login",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (err) {
        }
      },
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => {
        return {
          url: "/public/auth/register",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
        }
      },
    }),

    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (body) => {
        return {
          url: "/public/auth/forgot-password",
          method: "POST",
          body,
        };
      },
    }),

    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (body) => {
        return {
          url: "/public/auth/reset-password",
          method: "POST",
          body,
        };
      },
    }),

    verifyEmail: builder.mutation<MessageResponse, VerifyEmailRequest>({
      query: (body) => {
        return {
          url: "/public/auth/verify-email",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
        }
      },
    }),

    resendVerification: builder.mutation<
      MessageResponse,
      ResendVerificationRequest
    >({
      query: (body) => {
        return {
          url: "/public/auth/resend-verification",
          method: "POST",
          body,
        };
      },
    }),

    logout: builder.mutation<MessageResponse, void>({
      query: () => {
        return {
          url: "/public/auth/logout",
          method: "POST",
        };
      },
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => {
        return "/public/auth/me";
      },
      providesTags: ["Profile"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
        } catch (err) {
        }
      },
    }),

    registerRestaurant: builder.mutation<
      AuthResponse,
      RegisterRestaurantRequest
    >({
      query: (body) => {
        return {
          url: "/public/auth/register-restaurant",
          method: "POST",
          body,
        };
      },
    }),

    registerCourier: builder.mutation<AuthResponse, RegisterCourierRequest>({
      query: (body) => {
        return {
          url: "/public/auth/register-courier",
          method: "POST",
          body,
        };
      },
    }),

    getApplicationStatus: builder.query<ApplicationStatusResponse, void>({
      query: () => "/public/auth/application-status",
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRegisterRestaurantMutation,
  useRegisterCourierMutation,
  useGetApplicationStatusQuery,
} = authApi;
