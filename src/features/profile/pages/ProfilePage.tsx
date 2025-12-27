import { useTranslation } from "react-i18next";
import { AvatarUpload } from "../components/AvatarUpload";
import { ProfileForm } from "../components/ProfileForm";
import { PasswordChangeForm } from "../components/PasswordChangeForm";
import { NotificationSettings } from "../components/NotificationSettings";
import { DeactivateAccount } from "../components/DeactivateAccount";

export function ProfilePage() {
  const { t } = useTranslation("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <AvatarUpload />
      <ProfileForm />
      <PasswordChangeForm />
      <NotificationSettings />
      <DeactivateAccount />
    </div>
  );
}
