import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useRegisterMutation } from "../auth.api";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCredentials } from "@/shared/state/auth.slice";
import { toast } from "sonner";

const NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s'-]+$/;
const PHONE_PATTERN = /^\+?[0-9\s\-().]+$/;

function createRegisterSchema(t: (key: string) => string) {
  return z
    .object({
      first_name: z
        .string()
        .min(1, t("auth:validation.firstNameRequired"))
        .max(100, t("auth:validation.firstNameMax"))
        .regex(NAME_PATTERN, t("auth:validation.firstNameInvalid")),
      last_name: z
        .string()
        .min(1, t("auth:validation.lastNameRequired"))
        .max(100, t("auth:validation.lastNameMax"))
        .regex(NAME_PATTERN, t("auth:validation.lastNameInvalid")),
      email: z
        .string()
        .min(1, t("auth:validation.emailRequired"))
        .email(t("auth:validation.emailInvalid")),
      phone: z
        .string()
        .optional()
        .refine(
          (val) => !val || PHONE_PATTERN.test(val),
          t("auth:validation.phoneInvalid"),
        ),
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
      preferred_language: z.enum(["en", "fr", "de", "it"]).optional(),
      acceptTerms: z
        .boolean()
        .refine((val) => val === true, t("auth:validation.termsRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth:validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });
}

type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

const LANGUAGES = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "it", label: "Italiano" },
] as const;

export function RegisterForm() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.current);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      preferred_language: currentLanguage as "en" | "fr" | "de" | "it",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const { confirmPassword: _, acceptTerms: __, ...requestData } = data;
      const result = await registerUser(requestData).unwrap();
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
      toast.success(t("register.success"));
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        data?: { error?: { message?: string } };
      };
      if (error?.status === 409) {
        setError("email", { message: t("register.error.emailExists") });
      } else {
        setError("root", { message: t("register.error.generic") });
      }
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-secondary">
          {t("register.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("register.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="rounded-md bg-error/10 p-3 text-sm text-error">
            {errors.root.message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="first_name">{t("register.firstName")}</Label>
            <Input
              id="first_name"
              placeholder={t("register.firstNamePlaceholder")}
              autoComplete="given-name"
              {...register("first_name")}
              aria-invalid={!!errors.first_name}
            />
            {errors.first_name && (
              <p className="text-xs text-error">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">{t("register.lastName")}</Label>
            <Input
              id="last_name"
              placeholder={t("register.lastNamePlaceholder")}
              autoComplete="family-name"
              {...register("last_name")}
              aria-invalid={!!errors.last_name}
            />
            {errors.last_name && (
              <p className="text-xs text-error">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("register.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("register.emailPlaceholder")}
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("register.phone")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("register.phonePlaceholder")}
            autoComplete="tel"
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-xs text-error">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("register.password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("register.passwordPlaceholder")}
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
            {t("register.confirmPassword")}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("register.confirmPasswordPlaceholder")}
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

        <div className="space-y-2">
          <Label>{t("register.preferredLanguage")}</Label>
          <Select
            defaultValue={currentLanguage}
            onValueChange={(value) =>
              setValue("preferred_language", value as "en" | "fr" | "de" | "it")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) =>
              setValue("acceptTerms", checked === true)
            }
          />
          <Label
            htmlFor="acceptTerms"
            className="text-sm font-normal leading-snug"
          >
            {t("register.terms")}{" "}
            <Link to="/terms" className="text-primary hover:text-primary-hover">
              {t("register.termsLink")}
            </Link>{" "}
            {t("register.and")}{" "}
            <Link
              to="/privacy"
              className="text-primary hover:text-primary-hover"
            >
              {t("register.privacyLink")}
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-error">{errors.acceptTerms.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("register.submitting")}
            </>
          ) : (
            t("register.submit")
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {t("register.hasAccount")}{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary-hover"
        >
          {t("register.login")}
        </Link>
      </div>
    </div>
  );
}
