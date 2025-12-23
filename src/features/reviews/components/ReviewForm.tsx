import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { StarRating } from "./StarRating";
import type {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "../reviews.types";

interface ReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: Review | null;
  onSubmit: (data: CreateReviewRequest | UpdateReviewRequest) => void;
  isSubmitting?: boolean;
}

export function ReviewForm({
  open,
  onOpenChange,
  review,
  onSubmit,
  isSubmitting,
}: ReviewFormProps) {
  const { t } = useTranslation("reviews");
  const isEdit = !!review;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment || "");
    } else {
      setRating(0);
      setComment("");
    }
    setRatingError("");
  }, [review, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setRatingError(t("form.ratingRequired"));
      return;
    }

    if (isEdit) {
      onSubmit({
        rating,
        comment: comment.trim() || undefined,
      } as UpdateReviewRequest);
    } else {
      onSubmit({
        restaurant_id: "",
        order_id: "",
        rating,
        comment: comment.trim() || undefined,
      } as CreateReviewRequest);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("editReview") : t("writeReview")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>{t("form.ratingLabel")}</Label>
            <StarRating value={rating} onChange={setRating} size="lg" />
            {ratingError && <p className="text-sm text-error">{ratingError}</p>}
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {t("form.stars", { count: rating })}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment">{t("comment")}</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("commentPlaceholder")}
              rows={4}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/2000
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("deleteConfirm.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit
                ? isSubmitting
                  ? t("updating")
                  : t("updateReview")
                : isSubmitting
                  ? t("submitting")
                  : t("submitReview")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
