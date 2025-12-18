import { baseApi } from "@/shared/api/baseApi";
import type {
  AddressListResponse,
  AddressResponse,
  AddressesQueryParams,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "./addresses.types";

export const addressesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddressesList: builder.query<
      AddressListResponse,
      AddressesQueryParams | void
    >({
      query: (params) => ({
        url: "/public/addresses",
        params: params || { limit: 10, sort: "-is_default" },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Address" as const,
                id,
              })),
              { type: "Address", id: "LIST" },
            ]
          : [{ type: "Address", id: "LIST" }],
    }),

    getAddressById: builder.query<AddressResponse, string>({
      query: (id) => `/public/addresses/${id}`,
      providesTags: (result) =>
        result ? [{ type: "Address", id: result.data.id }] : [],
    }),

    createNewAddress: builder.mutation<AddressResponse, CreateAddressRequest>({
      query: (body) => {
        return {
          url: "/public/addresses",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    updateAddress: builder.mutation<
      AddressResponse,
      { id: string; body: UpdateAddressRequest }
    >({
      query: ({ id, body }) => ({
        url: `/public/addresses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: "Address", id },
        { type: "Address", id: "LIST" },
      ],
    }),

    deleteAddress: builder.mutation<AddressResponse, string>({
      query: (id) => ({
        url: `/public/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    setAddressDefault: builder.mutation<AddressResponse, string>({
      query: (id) => {
        return {
          url: `/public/addresses/${id}/default`,
          method: "PATCH",
        };
      },
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAddressesListQuery,
  useGetAddressByIdQuery,
  useCreateNewAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetAddressDefaultMutation,
} = addressesApi;
