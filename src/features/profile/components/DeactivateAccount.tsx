import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/shared/state/auth.slice";
import { useDeactivateAccountMutation } from "../profile.api";

export function DeactivateAccount() {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [deactivate, { isLoading }] = useDeactivateAccountMutation();

  const handleDeactivate = async () => {
    try {
      await deactivate().unwrap();
      toast.success(t("deactivate.success"));
      dispatch(logout());
      navigate("/");
    } catch {
      toast.error(t("deactivate.error"));
    }
  };

  return (
    <>
      <Card className="border-error/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-error">
            <AlertTriangle className="h-5 w-5" />
            {t("deactivate.title")}
          </CardTitle>
          <CardDescription>{t("deactivate.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setOpen(true)}>
            {t("deactivate.button")}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deactivate.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deactivate.confirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-error hover:bg-error/90"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("deactivate.button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
