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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useChangePasswordMutation } from "../profile.api";

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Required"),
    new_password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[a-z]/, "Must contain lowercase")
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[0-9]/, "Must contain number")
      .regex(/[@$!%*?&]/, "Must contain special character"),
    confirm_password: z.string().min(1, "Required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function PasswordChangeForm() {
  const { t } = useTranslation("profile");
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      await changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
      }).unwrap();
      toast.success(t("password.changed"));
      reset();
    } catch {
      toast.error(t("password.changeError"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("password.title")}</CardTitle>
        <CardDescription>{t("password.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">
              {t("password.currentPassword")}
            </Label>
            <Input
              id="current_password"
              type="password"
              {...register("current_password")}
            />
            {errors.current_password && (
              <p className="text-sm text-error">
                {errors.current_password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">{t("password.newPassword")}</Label>
            <Input
              id="new_password"
              type="password"
              {...register("new_password")}
            />
            {errors.new_password && (
              <p className="text-sm text-error">
                {errors.new_password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {t("password.requirements")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">
              {t("password.confirmPassword")}
            </Label>
            <Input
              id="confirm_password"
              type="password"
              {...register("confirm_password")}
            />
            {errors.confirm_password && (
              <p className="text-sm text-error">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("password.change")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
