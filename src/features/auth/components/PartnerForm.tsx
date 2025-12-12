import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Store,
  User as UserIcon,
  MapPin,
} from "lucide-react";
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
import { useRegisterRestaurantMutation } from "../auth.api";
import { useGetCantonsQuery, useGetCitiesQuery } from "@/features/home/home.api";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setCredentials } from "@/shared/state/auth.slice";
import { toast } from "sonner";

const NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s'-]+$/;
const PHONE_PATTERN = /^\+?[0-9\s\-().]+$/;
const POSTAL_CODE_PATTERN = /^[1-9][0-9]{3}$/;

function createPartnerSchema(t: (key: string) => string) {
  return z
    .object({
      // Personal info
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
        .min(1, t("auth:partner.validation.phoneRequired"))
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
      // Restaurant info
      restaurant_name: z
        .string()
        .min(1, t("auth:partner.validation.restaurantNameRequired"))
        .max(200, t("auth:partner.validation.restaurantNameMax")),
      restaurant_address: z
        .string()
        .min(1, t("auth:partner.validation.addressRequired"))
        .max(300, t("auth:partner.validation.addressMax")),
      restaurant_postal_code: z
        .string()
        .min(1, t("auth:partner.validation.postalCodeRequired"))
        .regex(
          POSTAL_CODE_PATTERN,
          t("auth:partner.validation.postalCodeInvalid"),
        ),
      restaurant_city_id: z
        .string()
        .min(1, t("auth:partner.validation.cityRequired")),
      restaurant_canton_id: z
        .string()
        .min(1, t("auth:partner.validation.cantonRequired")),
      restaurant_phone: z
        .string()
        .optional()
        .refine(
          (val) => !val || PHONE_PATTERN.test(val),
          t("auth:validation.phoneInvalid"),
        ),
      restaurant_email: z
        .string()
        .optional()
        .refine(
          (val) => !val || z.string().email().safeParse(val).success,
          t("auth:validation.emailInvalid"),
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

type PartnerFormValues = z.infer<ReturnType<typeof createPartnerSchema>>;

const LANGUAGES = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "it", label: "Italiano" },
] as const;

export function PartnerForm() {
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.current);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerRestaurant, { isLoading }] = useRegisterRestaurantMutation();

  const { data: cantonsData } = useGetCantonsQuery();
  const { data: citiesData } = useGetCitiesQuery();

  const cantons = cantonsData?.data ?? [];
  const cities = citiesData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(createPartnerSchema(t)),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      preferred_language: currentLanguage as "en" | "fr" | "de" | "it",
      restaurant_name: "",
      restaurant_address: "",
      restaurant_postal_code: "",
      restaurant_city_id: "",
      restaurant_canton_id: "",
      restaurant_phone: "",
      restaurant_email: "",
      application_note: "",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");
  const selectedCantonId = watch("restaurant_canton_id");

  // Filter cities by selected canton
  const filteredCities = selectedCantonId
    ? cities.filter((city) => city.canton_id === selectedCantonId)
    : cities;

  const onSubmit = async (data: PartnerFormValues) => {
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
      const result = await registerRestaurant(
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
      toast.success(t("auth:partner.success"));
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
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Store className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-secondary">
          {t("auth:partner.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("auth:partner.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <div className="rounded-md bg-error/10 p-3 text-sm text-error">
            {errors.root.message}
          </div>
        )}

        {/* Section: Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-secondary">
              {t("auth:partner.personalInfo")}
            </h2>
          </div>

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
        </div>

        {/* Section: Restaurant Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Store className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-secondary">
              {t("auth:partner.restaurantInfo")}
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant_name">
              {t("auth:partner.restaurantName")} *
            </Label>
            <Input
              id="restaurant_name"
              placeholder={t("auth:partner.restaurantNamePlaceholder")}
              {...register("restaurant_name")}
              aria-invalid={!!errors.restaurant_name}
            />
            {errors.restaurant_name && (
              <p className="text-xs text-error">
                {errors.restaurant_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant_address">
              {t("auth:partner.restaurantAddress")} *
            </Label>
            <Input
              id="restaurant_address"
              placeholder={t("auth:partner.restaurantAddressPlaceholder")}
              {...register("restaurant_address")}
              aria-invalid={!!errors.restaurant_address}
            />
            {errors.restaurant_address && (
              <p className="text-xs text-error">
                {errors.restaurant_address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="restaurant_postal_code">
                {t("auth:partner.postalCode")} *
              </Label>
              <Input
                id="restaurant_postal_code"
                placeholder="8001"
                {...register("restaurant_postal_code")}
                aria-invalid={!!errors.restaurant_postal_code}
              />
              {errors.restaurant_postal_code && (
                <p className="text-xs text-error">
                  {errors.restaurant_postal_code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("auth:partner.canton")} *</Label>
              <Select
                onValueChange={(value) => {
                  setValue("restaurant_canton_id", value);
                  // Reset city when canton changes
                  setValue("restaurant_city_id", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("auth:partner.cantonPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {cantons.map((canton) => (
                    <SelectItem key={canton.id} value={canton.id}>
                      {canton.name} ({canton.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.restaurant_canton_id && (
                <p className="text-xs text-error">
                  {errors.restaurant_canton_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t("auth:partner.city")} *</Label>
              <Select
                onValueChange={(value) =>
                  setValue("restaurant_city_id", value)
                }
                disabled={!selectedCantonId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("auth:partner.cityPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.restaurant_city_id && (
                <p className="text-xs text-error">
                  {errors.restaurant_city_id.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="restaurant_phone">
                {t("auth:partner.restaurantPhone")}
              </Label>
              <Input
                id="restaurant_phone"
                type="tel"
                placeholder="+41 44 123 45 67"
                {...register("restaurant_phone")}
                aria-invalid={!!errors.restaurant_phone}
              />
              {errors.restaurant_phone && (
                <p className="text-xs text-error">
                  {errors.restaurant_phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant_email">
                {t("auth:partner.restaurantEmail")}
              </Label>
              <Input
                id="restaurant_email"
                type="email"
                placeholder="restaurant@example.ch"
                {...register("restaurant_email")}
                aria-invalid={!!errors.restaurant_email}
              />
              {errors.restaurant_email && (
                <p className="text-xs text-error">
                  {errors.restaurant_email.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section: Additional Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-secondary">
              {t("auth:partner.additionalInfo")}
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_note">
              {t("auth:partner.applicationNote")}
            </Label>
            <Textarea
              id="application_note"
              placeholder={t("auth:partner.applicationNotePlaceholder")}
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
        </div>

        {/* Terms */}
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
              {t("auth:partner.submitting")}
            </>
          ) : (
            t("auth:partner.submit")
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
