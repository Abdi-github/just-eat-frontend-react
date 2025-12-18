// Addresses feature types — re-exports from checkout + adds update/delete types

import type {
  Address,
  CreateAddressRequest,
} from "@/features/checkout/checkout.types";

export type { Address, CreateAddressRequest };

export type UpdateAddressRequest = Partial<CreateAddressRequest>;

export interface AddressesQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface AddressListResponse {
  success: boolean;
  message: string;
  data: Address[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data: Address;
}
