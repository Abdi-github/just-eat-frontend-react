import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Bike } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useRegisterCourierMutation } from "../auth.api";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCredentials } from "@/shared/state/auth.slice";
import { toast } from "sonner";

const NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s'-]+$/;
const PHONE_PATTERN = /^\+?[0-9\s\-().]+$/;

const VEHICLE_TYPES = ["bicycle", "motorcycle", "car", "scooter"] as const;

function createCourierSchema(t: (key: string) => string) {
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
        .min(1, t("auth:courier.validation.phoneRequired"))
        .regex(PHONE_PATTERN, t("auth:validation.phoneInvalid")),
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
      vehicle_type: z.enum(VEHICLE_TYPES, {
        errorMap: () => ({
          message: t("auth:courier.validation.vehicleTypeRequired"),
        }),
      }),
      date_of_birth: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (!val) return true;
            const dob = new Date(val);
            const now = new Date();
            const age = now.getFullYear() - dob.getFullYear();
            const monthDiff = now.getMonth() - dob.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && now.getDate() < dob.getDate())
            ) {
              return age - 1 >= 18;
            }
            return age >= 18;
          },
          t("auth:courier.validation.ageMinimum"),
        ),
      application_note: z.string().max(1000).optional(),
      acceptTerms: z
        .boolean()
        .refine((val) => val === true, t("auth:validation.termsRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth:validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });
}

type CourierFormValues = z.infer<ReturnType<typeof createCourierSchema>>;

const LANGUAGES = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "it", label: "Italiano" },
] as const;

export function BecomeCourierForm() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.current);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerCourier, { isLoading }] = useRegisterCourierMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<CourierFormValues>({
    resolver: zodResolver(createCourierSchema(t)),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      preferred_language: currentLanguage as "en" | "fr" | "de" | "it",
      vehicle_type: undefined,
      date_of_birth: "",
      application_note: "",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: CourierFormValues) => {
    try {
      const {
        confirmPassword: _,
        acceptTerms: __,
        ...requestData
      } = data;
      // Remove empty optional fields
      const cleanData = Object.fromEntries(
        Object.entries(requestData).filter(
          ([, v]) => v !== "" && v !== undefined,
        ),
      );
      const result = await registerCourier(
        cleanData as typeof requestData,
      ).unwrap();
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
      toast.success(t("auth:courier.success"));
      navigate("/application-status", { replace: true });
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        data?: { error?: { message?: string } };
      };
      if (error?.status === 409) {
        setError("email", {
          message: t("auth:register.error.emailExists"),
        });
      } else {
        setError("root", {
          message:
            error?.data?.error?.message ?? t("auth:register.error.generic"),
        });
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Bike className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-secondary">
          {t("auth:courier.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth:courier.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="rounded-md bg-error/10 p-3 text-sm text-error">
            {errors.root.message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">
              {t("auth:register.firstName")} *
            </Label>
            <Input
              id="first_name"
              placeholder={t("auth:register.firstNamePlaceholder")}
              autoComplete="given-name"
              {...register("first_name")}
              aria-invalid={!!errors.first_name}
            />
            {errors.first_name && (
              <p className="text-xs text-error">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">
              {t("auth:register.lastName")} *
            </Label>
            <Input
              id="last_name"
              placeholder={t("auth:register.lastNamePlaceholder")}
              autoComplete="family-name"
              {...register("last_name")}
              aria-invalid={!!errors.last_name}
            />
            {errors.last_name && (
              <p className="text-xs text-error">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("auth:register.email")} *</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("auth:register.emailPlaceholder")}
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("auth:register.phone")} *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("auth:register.phonePlaceholder")}
            autoComplete="tel"
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-xs text-error">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("auth:courier.vehicleType")} *</Label>
            <Select
              onValueChange={(value) =>
                setValue(
                  "vehicle_type",
                  value as (typeof VEHICLE_TYPES)[number],
                )
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("auth:courier.vehicleTypePlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`auth:courier.vehicles.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicle_type && (
              <p className="text-xs text-error">
                {errors.vehicle_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">
              {t("auth:courier.dateOfBirth")}
            </Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register("date_of_birth")}
              aria-invalid={!!errors.date_of_birth}
            />
            {errors.date_of_birth && (
              <p className="text-xs text-error">
                {errors.date_of_birth.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth:register.password")} *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth:register.passwordPlaceholder")}
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
              {t("auth:register.confirmPassword")} *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("auth:register.confirmPasswordPlaceholder")}
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
        </div>

        <div className="space-y-2">
          <Label>{t("auth:register.preferredLanguage")}</Label>
          <Select
            defaultValue={currentLanguage}
            onValueChange={(value) =>
              setValue(
                "preferred_language",
                value as "en" | "fr" | "de" | "it",
              )
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

        <div className="space-y-2">
          <Label htmlFor="application_note">
            {t("auth:courier.applicationNote")}
          </Label>
          <Textarea
            id="application_note"
            placeholder={t("auth:courier.applicationNotePlaceholder")}
            rows={3}
            {...register("application_note")}
            aria-invalid={!!errors.application_note}
          />
          {errors.application_note && (
            <p className="text-xs text-error">
              {errors.application_note.message}
            </p>
          )}
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
            {t("auth:register.terms")}{" "}
            <Link to="/terms" className="text-primary hover:text-primary-hover">
              {t("auth:register.termsLink")}
            </Link>{" "}
            {t("auth:register.and")}{" "}
            <Link
              to="/privacy"
              className="text-primary hover:text-primary-hover"
            >
              {t("auth:register.privacyLink")}
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-error">{errors.acceptTerms.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("auth:courier.submitting")}
            </>
          ) : (
            t("auth:courier.submit")
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth:register.hasAccount")}{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary-hover"
        >
          {t("auth:register.login")}
        </Link>
      </div>
    </div>
  );
}
