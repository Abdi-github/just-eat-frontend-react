import { useTranslation } from "react-i18next";
import { Gift, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { formatDate } from "@/shared/utils/formatters";
import type { UserStampProgress } from "../promotions.types";

interface StampCardProgressProps {
  progress: UserStampProgress;
  onRedeem: (id: string) => void;
  isRedeeming: boolean;
}

export function StampCardProgress({
  progress,
  onRedeem,
  isRedeeming,
}: StampCardProgressProps) {
  const { t } = useTranslation("promotions");

  const percentage = Math.min(
    (progress.stamps_collected / progress.stamps_required) * 100,
    100,
  );
  const stampsLeft = progress.stamps_required - progress.stamps_collected;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold">
              {progress.stamp_card_name}
            </h3>
            {progress.restaurant_name && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {progress.restaurant_name}
              </p>
            )}
          </div>
          {progress.is_complete && !progress.reward_redeemed && (
            <Badge className="bg-green-100 text-green-800">
              {t("stamps.complete")}
            </Badge>
          )}
          {progress.reward_redeemed && (
            <Badge variant="secondary">{t("stamps.redeemed")}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Progress bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t("stamps.progress", {
                collected: progress.stamps_collected,
                required: progress.stamps_required,
              })}
            </span>
            <span className="font-medium">{Math.round(percentage)}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stamps grid */}
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: progress.stamps_required }).map((_, i) => (
            <div
              key={i}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                i < progress.stamps_collected
                  ? "bg-primary text-white"
                  : "border border-dashed border-border bg-muted text-muted-foreground"
              }`}
            >
              {i < progress.stamps_collected ? "★" : i + 1}
            </div>
          ))}
        </div>

        {/* Reward description */}
        <div className="flex items-start gap-2 rounded-md bg-muted px-3 py-2">
          <Gift size={14} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {t("stamps.reward")}
            </p>
            <p className="text-sm">{progress.reward_description}</p>
          </div>
        </div>

        {/* Stamps left */}
        {!progress.is_complete && (
          <p className="text-center text-xs text-muted-foreground">
            {t("stamps.stampsLeft", { count: stampsLeft })}
          </p>
        )}
      </CardContent>

      {/* Redeem button */}
      {progress.is_complete && !progress.reward_redeemed && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => onRedeem(progress.id)}
            disabled={isRedeeming}
          >
            {isRedeeming && <Loader2 size={14} className="mr-2 animate-spin" />}
            {t("stamps.redeem")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
