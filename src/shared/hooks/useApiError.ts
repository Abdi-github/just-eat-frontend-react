import { useTranslation } from "react-i18next";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

interface ApiErrorBody {
  error?: { code: number; message: string; field?: string };
}

export function useApiError() {
  const { t } = useTranslation();

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined,
  ): string => {
    if (!error) return t("common.error");

    if ("status" in error) {
      const apiError = error.data as ApiErrorBody;
      if (apiError?.error?.message) {
        return apiError.error.message;
      }

      switch (error.status) {
        case 401:
          return t("errors.unauthorized");
        case 403:
          return t("errors.forbidden");
        case 404:
          return t("errors.notFound");
        case 422:
          return t("validation.required");
        default:
          return t("errors.serverError");
      }
    }

    return error.message || t("common.error");
  };

  return { getErrorMessage };
}
