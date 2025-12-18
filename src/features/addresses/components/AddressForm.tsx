import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { useGetCantonsQuery, useGetCitiesQuery } from "@/features/home/home.api";
import type { Address, CreateAddressRequest } from "../addresses.types";

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
  onSubmit: (data: CreateAddressRequest) => void;
  isSubmitting?: boolean;
}

export function AddressForm({
  open,
  onOpenChange,
  address,
  onSubmit,
  isSubmitting,
}: AddressFormProps) {
  const { t } = useTranslation("addresses");

  const schema = z.object({
    label: z
      .string()
      .min(1, t("validation.labelRequired"))
      .max(50, t("validation.labelMax")),
    street: z.string().min(1, t("validation.streetRequired")),
    street_number: z.string().min(1, t("validation.streetNumberRequired")),
    floor: z.string().optional(),
    postal_code: z
      .string()
      .min(1, t("validation.postalCodeRequired"))
      .regex(/^\d{4}$/, t("validation.postalCodeFormat")),
    city_id: z.string().min(1, t("validation.cityRequired")),
    canton_id: z.string().min(1, t("validation.cantonRequired")),
    instructions: z.string().optional(),
    is_default: z.boolean().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      street: "",
      street_number: "",
      floor: "",
      postal_code: "",
      city_id: "",
      canton_id: "",
      instructions: "",
      is_default: false,
    },
  });

  useEffect(() => {
    if (address) {
      reset({
        label: address.label,
        street: address.street,
        street_number: address.street_number,
        floor: address.floor || "",
        postal_code: address.postal_code,
        city_id: address.city_id,
        canton_id: address.canton_id,
        instructions: address.instructions || "",
        is_default: address.is_default,
      });
    } else {
      reset({
        label: "",
        street: "",
        street_number: "",
        floor: "",
        postal_code: "",
        city_id: "",
        canton_id: "",
        instructions: "",
        is_default: false,
      });
    }
  }, [address, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      label: values.label,
      street: values.street,
      street_number: values.street_number,
      floor: values.floor || undefined,
      postal_code: values.postal_code,
      city_id: values.city_id,
      canton_id: values.canton_id,
      instructions: values.instructions || undefined,
      is_default: values.is_default,
    });
  };

  const isEdit = !!address;

  // Fetch cantons and cities for dropdowns
  const { data: cantonsData } = useGetCantonsQuery();
  const selectedCantonId = watch("canton_id");
  const { data: citiesData } = useGetCitiesQuery(
    { limit: 100, is_active: true },
  );

  // Filter cities by selected canton
  const filteredCities = useMemo(() => {
    if (!citiesData?.data || !selectedCantonId) return [];
    return citiesData.data.filter((c) => c.canton_id === selectedCantonId);
  }, [citiesData?.data, selectedCantonId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("editAddress") : t("addAddress")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="label">{t("form.label")}</Label>
            <Input
              id="label"
              {...register("label")}
              placeholder={t("form.labelPlaceholder")}
            />
            {errors.label && (
              <p className="text-sm text-error">{errors.label.message}</p>
            )}
          </div>

          {/* Street + Number */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="street">{t("form.street")}</Label>
              <Input
                id="street"
                {...register("street")}
                placeholder={t("form.streetPlaceholder")}
              />
              {errors.street && (
                <p className="text-sm text-error">{errors.street.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="street_number">{t("form.streetNumber")}</Label>
              <Input
                id="street_number"
                {...register("street_number")}
                placeholder={t("form.streetNumberPlaceholder")}
              />
              {errors.street_number && (
                <p className="text-sm text-error">
                  {errors.street_number.message}
                </p>
              )}
            </div>
          </div>

          {/* Floor + Postal Code */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="floor">{t("form.floor")}</Label>
              <Input
                id="floor"
                {...register("floor")}
                placeholder={t("form.floorPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">{t("form.postalCode")}</Label>
              <Input
                id="postal_code"
                {...register("postal_code")}
                placeholder={t("form.postalCodePlaceholder")}
                maxLength={4}
              />
              {errors.postal_code && (
                <p className="text-sm text-error">
                  {errors.postal_code.message}
                </p>
              )}
            </div>
          </div>

          {/* City + Canton */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="canton_id">{t("form.canton")}</Label>
              <Select
                value={watch("canton_id")}
                onValueChange={(value) => {
                  setValue("canton_id", value, { shouldValidate: true });
                  // Reset city when canton changes
                  setValue("city_id", "", { shouldValidate: false });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.cantonPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {cantonsData?.data?.map((canton) => (
                    <SelectItem key={canton.id} value={canton.id}>
                      {canton.name} ({canton.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.canton_id && (
                <p className="text-sm text-error">{errors.canton_id.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city_id">{t("form.city")}</Label>
              <Select
                value={watch("city_id")}
                onValueChange={(value) =>
                  setValue("city_id", value, { shouldValidate: true })
                }
                disabled={!selectedCantonId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedCantonId ? t("form.cityPlaceholder") : t("form.selectCantonFirst")} />
                </SelectTrigger>
                <SelectContent>
                  {filteredCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.city_id && (
                <p className="text-sm text-error">{errors.city_id.message}</p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">{t("form.instructions")}</Label>
            <Textarea
              id="instructions"
              {...register("instructions")}
              placeholder={t("form.instructionsPlaceholder")}
              rows={2}
            />
          </div>

          {/* Default address */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_default"
              checked={watch("is_default")}
              onCheckedChange={(checked) =>
                setValue("is_default", checked === true)
              }
            />
            <Label htmlFor="is_default" className="text-sm font-normal">
              {t("form.isDefault")}
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("form.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? t("form.saving") : t("form.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
