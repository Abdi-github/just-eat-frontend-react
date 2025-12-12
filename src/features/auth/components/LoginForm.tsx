import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useLoginMutation } from "../auth.api";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/shared/state/auth.slice";
import { toast } from "sonner";

function createLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t("auth:validation.emailRequired"))
      .email(t("auth:validation.emailInvalid")),
    password: z.string().min(1, t("auth:validation.passwordRequired")),
  });
}

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginForm() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({
          token: result.data.tokens.access_token,
          refreshToken: result.data.tokens.refresh_token,
          user: {
            _id: result.data.user.id,
            email: result.data.user.email,
            first_name: result.data.user.first_name,
            last_name: result.data.user.last_name,
            phone: result.data.user.phone,
            avatar_url: result.data.user.avatar_url,
            is_verified: result.data.user.is_verified,
            is_active: result.data.user.is_active,
            roles: result.data.user.roles,
            permissions: result.data.user.permissions,
          },
        }),
      );
      toast.success(t("login.success"));
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        data?: { error?: { message?: string } };
      };
      if (error?.status === 401) {
        setError("root", { message: t("login.error.invalidCredentials") });
      } else {
        setError("root", { message: t("login.error.generic") });
      }
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-secondary">
          {t("login.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="rounded-md bg-error/10 p-3 text-sm text-error">
            {errors.root.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t("login.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("login.emailPlaceholder")}
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("login.password")}</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:text-primary-hover"
            >
              {t("login.forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("login.passwordPlaceholder")}
              autoComplete="current-password"
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

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal">
            {t("login.rememberMe")}
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("login.submitting")}
            </>
          ) : (
            t("login.submit")
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {t("login.noAccount")}{" "}
        <Link
          to="/register"
          className="font-medium text-primary hover:text-primary-hover"
        >
          {t("login.register")}
        </Link>
      </div>
    </div>
  );
}
