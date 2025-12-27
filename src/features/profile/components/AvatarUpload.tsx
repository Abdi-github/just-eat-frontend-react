import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  useGetProfileQuery,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} from "../profile.api";

export function AvatarUpload() {
  const { t } = useTranslation("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: profileData } = useGetProfileQuery();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const [deleteAvatar, { isLoading: isDeleting }] = useDeleteAvatarMutation();

  const profile = profileData?.data;
  const avatarUrl = previewUrl || profile?.avatar_url;
  const initials =
    (profile?.first_name?.[0] || "") + (profile?.last_name?.[0] || "");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t("avatar.formats"));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("avatar.maxSize"));
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar(formData).unwrap();
      toast.success(t("avatar.uploaded"));
    } catch {
      toast.error(t("avatar.uploadError"));
      setPreviewUrl(null);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async () => {
    try {
      await deleteAvatar().unwrap();
      setPreviewUrl(null);
      toast.success(t("avatar.removed"));
    } catch {
      toast.error(t("avatar.removeError"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("avatar.title")}</CardTitle>
        <CardDescription>
          {t("avatar.formats")} · {t("avatar.maxSize")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage
              src={avatarUrl || undefined}
              alt={profile?.first_name}
            />
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {isUploading ? t("avatar.uploading") : t("avatar.upload")}
              </Button>
              {avatarUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-error hover:text-error"
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  {t("avatar.remove")}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("avatar.formats")} · {t("avatar.maxSize")}
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
      </CardContent>
    </Card>
  );
}
