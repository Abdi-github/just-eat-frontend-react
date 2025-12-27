import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "../profile.api";
import type { NotificationPreferences } from "../profile.types";

const settingKeyMap: Array<{
  key: keyof NotificationPreferences;
  label: string;
  desc: string;
}> = [
  {
    key: "email_order_updates",
    label: "notifications.emailOrderUpdates",
    desc: "notifications.emailOrderUpdatesDescription",
  },
  {
    key: "email_promotions",
    label: "notifications.emailPromotions",
    desc: "notifications.emailPromotionsDescription",
  },
  {
    key: "email_newsletter",
    label: "notifications.emailNewsletter",
    desc: "notifications.emailNewsletterDescription",
  },
  {
    key: "push_enabled",
    label: "notifications.pushEnabled",
    desc: "notifications.pushEnabledDescription",
  },
];

export function NotificationSettings() {
  const { t } = useTranslation("profile");
  const { data, isLoading } = useGetNotificationSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateNotificationSettingsMutation();

  const prefs = data?.data?.notification_preferences;

  const handleToggle = async (key: keyof NotificationPreferences) => {
    if (!prefs) return;

    try {
      await updateSettings({
        [key]: !prefs[key],
      }).unwrap();
      toast.success(t("notifications.saved"));
    } catch {
      toast.error(t("notifications.saveError"));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-1 h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("notifications.title")}</CardTitle>
        <CardDescription>{t("notifications.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settingKeyMap.map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
          >
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">{t(label)}</Label>
              <p className="text-xs text-muted-foreground">{t(desc)}</p>
            </div>
            <Switch
              checked={prefs?.[key] ?? false}
              onCheckedChange={() => handleToggle(key)}
              disabled={isUpdating}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
