import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Plus, Check, Home, Building2, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
} from "../checkout.api";
import type { Address } from "../checkout.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

interface AddressSelectorProps {
  selectedAddressId: string | null;
  onSelect: (address: Address) => void;
  orderType: "delivery" | "pickup";
}

function createAddressSchema(t: (key: string) => string) {
  return z.object({
    label: z
      .string()
      .min(1, t("checkout:address.validation.labelRequired"))
      .max(50, t("checkout:address.validation.labelMax")),
    street: z
      .string()
      .min(1, t("checkout:address.validation.streetRequired"))
      .max(200, t("checkout:address.validation.streetMax")),
    street_number: z
      .string()
      .min(1, t("checkout:address.validation.streetNumberRequired")),
    floor: z.string().optional(),
    postal_code: z
      .string()
      .min(1, t("checkout:address.validation.postalCodeRequired"))
      .regex(/^\d{4}$/, t("checkout:address.validation.postalCodeFormat")),
    city_id: z.string().min(1, t("checkout:address.validation.cityRequired")),
    canton_id: z
      .string()
      .min(1, t("checkout:address.validation.cantonRequired")),
    instructions: z.string().optional(),
  });
}

type AddressFormValues = z.infer<ReturnType<typeof createAddressSchema>>;

export function AddressSelector({
  selectedAddressId,
  onSelect,
  orderType,
}: AddressSelectorProps) {
  const { t } = useTranslation("checkout");
  const [showForm, setShowForm] = useState(false);
  const { data: addressData, isLoading } = useGetAddressesQuery(undefined, {
    skip: orderType === "pickup",
  });
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();

  const addresses = addressData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(createAddressSchema(t)),
    defaultValues: {
      label: "",
      street: "",
      street_number: "",
      floor: "",
      postal_code: "",
      city_id: "",
      canton_id: "",
      instructions: "",
    },
  });

  const onSubmitAddress = async (data: AddressFormValues) => {
    try {
      const result = await createAddress(data).unwrap();
      onSelect(result.data);
      setShowForm(false);
      reset();
      toast.success(t("address.form.save"));
    } catch {
      toast.error(t("errors.generic"));
    }
  };

  if (orderType === "pickup") {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-5 w-5" />
          <p className="text-sm">{t("address.pickupNote")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <MapPin className="h-5 w-5 text-primary" />
        {t("address.title")}
      </h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("address.noAddresses")}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("address.addNew")}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {addresses.map((address) => (
              <button
                key={address.id}
                type="button"
                onClick={() => onSelect(address)}
                className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  selectedAddressId === address.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="mt-0.5">
                  {address.label?.toLowerCase().includes("home") ? (
                    <Home className="h-5 w-5 text-primary" />
                  ) : (
                    <Building2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{address.label}</span>
                    {address.is_default && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {t("address.default")}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {address.street_number && !address.street.endsWith(address.street_number)
                      ? `${address.street} ${address.street_number}`
                      : address.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.postal_code} {address.city?.name}
                  </p>
                  {address.instructions && (
                    <p className="mt-1 text-xs text-muted-foreground italic">
                      {address.instructions}
                    </p>
                  )}
                </div>
                {selectedAddressId === address.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>

          {!showForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              {t("address.addNew")}
            </Button>
          )}
        </>
      )}

      {showForm && (
        <>
          <Separator />
          <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="addr-label" className="text-sm">
                  {t("address.form.label")}
                </Label>
                <Input
                  id="addr-label"
                  placeholder={t("address.form.labelPlaceholder")}
                  {...register("label")}
                />
                {errors.label && (
                  <p className="text-xs text-error">{errors.label.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-floor" className="text-sm">
                  {t("address.form.floor")}
                </Label>
                <Input
                  id="addr-floor"
                  placeholder={t("address.form.floorPlaceholder")}
                  {...register("floor")}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="addr-street" className="text-sm">
                  {t("address.form.street")}
                </Label>
                <Input
                  id="addr-street"
                  placeholder={t("address.form.streetPlaceholder")}
                  {...register("street")}
                />
                {errors.street && (
                  <p className="text-xs text-error">{errors.street.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-number" className="text-sm">
                  {t("address.form.streetNumber")}
                </Label>
                <Input
                  id="addr-number"
                  placeholder={t("address.form.streetNumberPlaceholder")}
                  {...register("street_number")}
                />
                {errors.street_number && (
                  <p className="text-xs text-error">
                    {errors.street_number.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="addr-postal" className="text-sm">
                  {t("address.form.postalCode")}
                </Label>
                <Input
                  id="addr-postal"
                  placeholder={t("address.form.postalCodePlaceholder")}
                  {...register("postal_code")}
                />
                {errors.postal_code && (
                  <p className="text-xs text-error">
                    {errors.postal_code.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-city" className="text-sm">
                  {t("address.form.city")}
                </Label>
                <Input
                  id="addr-city"
                  placeholder={t("address.form.cityPlaceholder")}
                  {...register("city_id")}
                />
                {errors.city_id && (
                  <p className="text-xs text-error">{errors.city_id.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-canton" className="text-sm">
                  {t("address.form.canton")}
                </Label>
                <Input
                  id="addr-canton"
                  placeholder={t("address.form.cantonPlaceholder")}
                  {...register("canton_id")}
                />
                {errors.canton_id && (
                  <p className="text-xs text-error">
                    {errors.canton_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addr-instructions" className="text-sm">
                {t("address.form.instructions")}
              </Label>
              <Input
                id="addr-instructions"
                placeholder={t("address.form.instructionsPlaceholder")}
                {...register("instructions")}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    {t("address.form.saving")}
                  </>
                ) : (
                  t("address.form.save")
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
              >
                {t("address.form.cancel")}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
