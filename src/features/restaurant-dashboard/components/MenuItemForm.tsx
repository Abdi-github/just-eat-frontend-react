import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import type {
  MenuItem as MenuItemType,
  MenuCategory,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  Allergen,
  DietaryFlag,
} from "../restaurant-dashboard.types";

const ALL_ALLERGENS: Allergen[] = [
  "gluten",
  "crustaceans",
  "eggs",
  "fish",
  "peanuts",
  "soybeans",
  "milk",
  "nuts",
  "celery",
  "mustard",
  "sesame",
  "sulphites",
  "lupin",
  "molluscs",
];

const ALL_DIETARY_FLAGS: DietaryFlag[] = [
  "vegetarian",
  "vegan",
  "halal",
  "kosher",
  "gluten_free",
  "lactose_free",
  "organic",
  "sugar_free",
];

const itemSchema = z.object({
  category_id: z.string().min(1, "Required"),
  name_en: z.string().min(1).max(200),
  name_fr: z.string().min(1).max(200),
  name_de: z.string().min(1).max(200),
  name_it: z.string().min(1).max(200),
  description_en: z.string().max(500).optional().or(z.literal("")),
  description_fr: z.string().max(500).optional().or(z.literal("")),
  description_de: z.string().max(500).optional().or(z.literal("")),
  description_it: z.string().max(500).optional().or(z.literal("")),
  price: z.coerce.number().min(0.01),
  allergens: z.array(z.string()),
  dietary_flags: z.array(z.string()),
  is_available: z.boolean(),
  is_popular: z.boolean(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

interface MenuItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMenuItemRequest | UpdateMenuItemRequest) => void;
  isSubmitting: boolean;
  item?: MenuItemType | null;
  categories: MenuCategory[];
}

export function MenuItemForm({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  item,
  categories,
}: MenuItemFormProps) {
  const { t } = useTranslation("restaurant-dashboard");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      category_id: item?.category_id ?? "",
      name_en: "",
      name_fr: "",
      name_de: "",
      name_it: "",
      description_en: "",
      description_fr: "",
      description_de: "",
      description_it: "",
      price: item?.price ?? 0,
      allergens: item?.allergens ?? [],
      dietary_flags: item?.dietary_flags ?? [],
      is_available: item?.is_available ?? true,
      is_popular: item?.is_popular ?? false,
    },
  });

  // Reset form when item changes
  useEffect(() => {
    if (open) {
      reset({
        category_id: item?.category_id ?? "",
        name_en: "",
        name_fr: "",
        name_de: "",
        name_it: "",
        description_en: "",
        description_fr: "",
        description_de: "",
        description_it: "",
        price: item?.price ?? 0,
        allergens: item?.allergens ?? [],
        dietary_flags: item?.dietary_flags ?? [],
        is_available: item?.is_available ?? true,
        is_popular: item?.is_popular ?? false,
      });
    }
  }, [open, item, reset]);

  const allergens = watch("allergens");
  const dietaryFlags = watch("dietary_flags");

  const handleFormSubmit = (values: ItemFormValues) => {
    const data: CreateMenuItemRequest = {
      category_id: values.category_id,
      name: {
        en: values.name_en,
        fr: values.name_fr,
        de: values.name_de,
        it: values.name_it,
      },
      description: {
        en: values.description_en || undefined,
        fr: values.description_fr || undefined,
        de: values.description_de || undefined,
        it: values.description_it || undefined,
      },
      price: values.price,
      allergens: values.allergens as Allergen[],
      dietary_flags: values.dietary_flags as DietaryFlag[],
      is_available: values.is_available,
      is_popular: values.is_popular,
    };
    onSubmit(data);
  };

  const toggleArrayItem = (
    arr: string[],
    item: string,
    field: "allergens" | "dietary_flags",
  ) => {
    const next = arr.includes(item)
      ? arr.filter((a) => a !== item)
      : [...arr, item];
    setValue(field, next);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item ? t("menu.editItem") : t("menu.addItem")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Category */}
          <div>
            <Label>{t("menu.categories")}</Label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={t("menu.allCategories")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category_id && (
              <p className="mt-1 text-xs text-error">{t("common.required")}</p>
            )}
          </div>

          {/* Name (4 languages) */}
          <div className="space-y-3">
            <p className="text-sm font-medium">{t("menu.itemName")}</p>
            {(["en", "fr", "de", "it"] as const).map((lang) => (
              <div key={lang}>
                <Label htmlFor={`name_${lang}`}>{t(`settings.${lang}`)}</Label>
                <Input
                  id={`name_${lang}`}
                  {...register(`name_${lang}` as keyof ItemFormValues)}
                />
                {errors[`name_${lang}` as keyof ItemFormValues] && (
                  <p className="mt-1 text-xs text-error">
                    {t("common.required")}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Description (4 languages) */}
          <div className="space-y-3">
            <p className="text-sm font-medium">{t("menu.description")}</p>
            {(["en", "fr", "de", "it"] as const).map((lang) => (
              <div key={lang}>
                <Label htmlFor={`description_${lang}`}>
                  {t(`settings.${lang}`)}
                </Label>
                <Textarea
                  id={`description_${lang}`}
                  rows={2}
                  {...register(`description_${lang}` as keyof ItemFormValues)}
                />
              </div>
            ))}
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">{t("menu.price")} (CHF)</Label>
            <Input
              id="price"
              type="number"
              step="0.05"
              min="0"
              {...register("price")}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-error">{t("common.required")}</p>
            )}
          </div>

          {/* Allergens */}
          <div>
            <p className="mb-2 text-sm font-medium">{t("menu.allergens")}</p>
            <div className="flex flex-wrap gap-3">
              {ALL_ALLERGENS.map((allergen) => (
                <label
                  key={allergen}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <Checkbox
                    checked={allergens.includes(allergen)}
                    onCheckedChange={() =>
                      toggleArrayItem(allergens, allergen, "allergens")
                    }
                  />
                  {t(`allergens.${allergen}`)}
                </label>
              ))}
            </div>
          </div>

          {/* Dietary Flags */}
          <div>
            <p className="mb-2 text-sm font-medium">{t("menu.dietaryFlags")}</p>
            <div className="flex flex-wrap gap-3">
              {ALL_DIETARY_FLAGS.map((flag) => (
                <label key={flag} className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={dietaryFlags.includes(flag)}
                    onCheckedChange={() =>
                      toggleArrayItem(dietaryFlags, flag, "dietary_flags")
                    }
                  />
                  {t(`dietaryFlags.${flag}`)}
                </label>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Controller
                name="is_available"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="is_available"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="is_available">{t("menu.isAvailable")}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Controller
                name="is_popular"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="is_popular"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="is_popular">{t("menu.isPopular")}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {item ? t("common.save") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
