import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useGetProfileQuery, useUpdateProfileMutation } from "../profile.api";

const profileSchema = z.object({
  first_name: z.string().min(1, "Required").max(50),
  last_name: z.string().min(1, "Required").max(50),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{7,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  preferred_language: z.enum(["en", "de", "fr", "it"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { t } = useTranslation("profile");
  const { data: profileData, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      preferred_language: "de",
    },
  });

  const profile = profileData?.data;

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone || "",
        preferred_language:
          (profile.preferred_language as "en" | "de" | "fr" | "it") || "de",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone || undefined,
        preferred_language: values.preferred_language,
      }).unwrap();
      toast.success(t("profileUpdated"));
    } catch {
      toast.error(t("profileUpdateError"));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("personalInfo")}</CardTitle>
        <CardDescription>{t("personalInfoDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t("firstName")}</Label>
              <Input
                id="first_name"
                {...register("first_name")}
                placeholder={t("firstName")}
              />
              {errors.first_name && (
                <p className="text-sm text-error">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{t("lastName")}</Label>
              <Input
                id="last_name"
                {...register("last_name")}
                placeholder={t("lastName")}
              />
              {errors.last_name && (
                <p className="text-sm text-error">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              value={profile?.email || ""}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+41 79 123 45 67"
            />
            {errors.phone && (
              <p className="text-sm text-error">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("preferredLanguage")}</Label>
            <Select
              value={watch("preferred_language")}
              onValueChange={(val) =>
                setValue(
                  "preferred_language",
                  val as "en" | "de" | "fr" | "it",
                  {
                    shouldDirty: true,
                  },
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={!isDirty || isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveChanges")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
