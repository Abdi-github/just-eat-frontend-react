import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useForgotPasswordMutation } from "../auth.api";

function createForgotPasswordSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t("auth:validation.emailRequired"))
      .email(t("auth:validation.emailInvalid")),
  });
}

type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

export function ForgotPasswordForm() {
  const { t } = useTranslation("auth");
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(createForgotPasswordSchema(t)),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(data).unwrap();
      setIsSuccess(true);
    } catch {
      setError("root", { message: t("forgotPassword.error.generic") });
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-secondary">
          {t("forgotPassword.title")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("forgotPassword.success")}
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t("forgotPassword.backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-secondary">
          {t("forgotPassword.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("forgotPassword.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="rounded-md bg-error/10 p-3 text-sm text-error">
            {errors.root.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t("forgotPassword.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("forgotPassword.emailPlaceholder")}
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("forgotPassword.submitting")}
            </>
          ) : (
            t("forgotPassword.submit")
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t("forgotPassword.backToLogin")}
        </Link>
      </div>
    </div>
  );
}
