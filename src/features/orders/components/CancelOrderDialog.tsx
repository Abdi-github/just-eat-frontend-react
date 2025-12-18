import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { useCancelOrderMutation } from "../orders.api";
import { toast } from "sonner";

interface CancelOrderDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelOrderDialog({
  orderId,
  open,
  onOpenChange,
}: CancelOrderDialogProps) {
  const { t } = useTranslation("orders");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [cancelOrder, { isLoading }] = useCancelOrderMutation();

  const handleCancel = async () => {
    if (reason.trim().length < 3) {
      setError(t("cancel.reasonRequired"));
      return;
    }

    try {
      await cancelOrder({
        id: orderId,
        body: { cancellation_reason: reason.trim() },
      }).unwrap();

      toast.success(t("cancel.success"));
      onOpenChange(false);
      setReason("");
      setError("");
    } catch {
      toast.error(t("cancel.error"));
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setReason("");
      setError("");
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("cancel.title")}</DialogTitle>
          <DialogDescription>{t("cancel.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="cancel-reason">{t("cancel.reason")}</Label>
          <Textarea
            id="cancel-reason"
            placeholder={t("cancel.reasonPlaceholder")}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            rows={3}
            disabled={isLoading}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            {t("common:cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading || reason.trim().length < 3}
          >
            {isLoading ? t("cancel.cancelling") : t("cancel.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
