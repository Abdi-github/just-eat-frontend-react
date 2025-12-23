import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Pencil, Trash2, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { StarRating } from "./StarRating";
import { formatDate } from "@/shared/utils/formatters";
import type { Review } from "../reviews.types";

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-error/10 text-error",
  FLAGGED: "bg-error/10 text-error",
};

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const { t } = useTranslation("reviews");

  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {/* Restaurant name + date */}
            <div className="flex items-center gap-2">
              <Link
                to={`/restaurants/${review.restaurant.slug}`}
                className="truncate font-semibold text-secondary hover:text-primary"
              >
                {review.restaurant.name}
              </Link>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDate(review.created_at)}
              </span>
            </div>

            {/* Rating + badges */}
            <div className="flex items-center gap-2">
              <StarRating value={review.rating} readonly size="sm" />
              {review.is_verified && (
                <Badge
                  variant="outline"
                  className="border-success/30 text-xs text-success"
                >
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {t("verified")}
                </Badge>
              )}
              <Badge
                variant="secondary"
                className={`text-xs ${statusColors[review.status] || ""}`}
              >
                {t(`status.${review.status}`)}
              </Badge>
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-sm text-foreground">{review.comment}</p>
            )}

            {/* Restaurant reply */}
            {review.restaurant_reply && (
              <div className="mt-2 rounded-lg bg-muted p-3">
                <div className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {t("restaurantReply")}
                </div>
                <p className="text-sm text-foreground">
                  {review.restaurant_reply}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(review)}
              className="h-8 w-8 text-muted-foreground hover:text-secondary"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(review)}
              className="h-8 w-8 text-muted-foreground hover:text-error"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
