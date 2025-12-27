import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import type {
  MenuCategory,
  CreateMenuCategoryRequest,
  UpdateMenuCategoryRequest,
} from "../restaurant-dashboard.types";

const categorySchema = z.object({
  name_en: z.string().min(1).max(200),
  name_fr: z.string().min(1).max(200),
  name_de: z.string().min(1).max(200),
  name_it: z.string().min(1).max(200),
  is_active: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateMenuCategoryRequest | UpdateMenuCategoryRequest,
  ) => void;
  isSubmitting: boolean;
  category?: MenuCategory | null;
}

export function CategoryForm({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  category,
}: CategoryFormProps) {
  const { t } = useTranslation("restaurant-dashboard");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name_en: "",
      name_fr: "",
      name_de: "",
      name_it: "",
      is_active: category?.is_active ?? true,
    },
  });

  const handleFormSubmit = (values: CategoryFormValues) => {
    onSubmit({
      name: {
        en: values.name_en,
        fr: values.name_fr,
        de: values.name_de,
        it: values.name_it,
      },
      is_active: values.is_active,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? t("menu.editCategory") : t("menu.addCategory")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              {t("menu.categoryName")}
            </p>
            {(["en", "fr", "de", "it"] as const).map((lang) => (
              <div key={lang}>
                <Label htmlFor={`name_${lang}`}>{t(`settings.${lang}`)}</Label>
                <Input
                  id={`name_${lang}`}
                  {...register(`name_${lang}` as keyof CategoryFormValues)}
                  placeholder={t(`settings.${lang}`)}
                />
                {errors[`name_${lang}` as keyof CategoryFormValues] && (
                  <p className="mt-1 text-xs text-error">
                    {t("common.required")}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={undefined}
              defaultChecked={category?.is_active ?? true}
              {...register("is_active")}
            />
            <Label htmlFor="is_active">{t("menu.active")}</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {category ? t("common.save") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
