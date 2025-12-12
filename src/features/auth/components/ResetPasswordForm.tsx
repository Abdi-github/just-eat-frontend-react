import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useResetPasswordMutation } from "../auth.api";

function createResetPasswordSchema(t: (key: string) => string) {
  return z
    .object({
      password: z
        .string()
        .min(8, t("auth:validation.passwordMin"))
        .regex(/[A-Z]/, t("auth:validation.passwordUppercase"))
        .regex(/[a-z]/, t("auth:validation.passwordLowercase"))
        .regex(/[0-9]/, t("auth:validation.passwordDigit"))
        .regex(/[@$!%*?&]/, t("auth:validation.passwordSpecial")),
      confirmPassword: z
        .string()
        .min(1, t("auth:validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth:validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });
}

type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

export function ResetPasswordForm() {
  const { t } = useTranslation("auth");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(createResetPasswordSchema(t)),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // No token in URL
  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
          <AlertTriangle className="h-6 w-6 text-warning" />
        </div>
        <h1 className="text-2xl font-bold text-secondary">
          {t("resetPassword.title")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("resetPassword.invalidToken")}
        </p>
        <div className="mt-6">
          <Link to="/forgot-password">
            <Button variant="outline">{t("forgotPassword.submit")}</Button>
          </Link>
        </div>
        <Link
          to="/login"
          className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-hover"
        >
          {t("resetPassword.backToLogin")}
        </Link>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-secondary">
          {t("resetPassword.title")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("resetPassword.success")}
        </p>
        <div className="mt-6">
          <Link to="/login">
            <Button>{t("login.submit")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword({ token, password: data.password }).unwrap();
      setIsSuccess(true);
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        data?: { error?: { message?: string } };
      };
      if (error?.status === 400) {
        const message = error.data?.error?.message?.toLowerCase() || "";
        if (message.includes("expired")) {
          setError("root", { message: t("resetPassword.error.tokenExpired") });
        } else {
          setError("root", { message: t("resetPassword.error.tokenInvalid") });
        }
      } else {
        setError("root", { message: t("resetPassword.error.generic") });
      }
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-secondary">
          {t("resetPassword.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("resetPassword.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="rounded-md bg-error/10 p-3 text-sm text-error">
            {errors.root.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">{t("resetPassword.password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("resetPassword.passwordPlaceholder")}
              autoComplete="new-password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-error">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            {t("resetPassword.confirmPassword")}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("resetPassword.confirmPasswordPlaceholder")}
              autoComplete="new-password"
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("resetPassword.submitting")}
            </>
          ) : (
            t("resetPassword.submit")
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm font-medium text-primary hover:text-primary-hover"
        >
          {t("resetPassword.backToLogin")}
        </Link>
      </div>
    </div>
  );
}
