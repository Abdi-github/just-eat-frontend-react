import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Star, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useRestaurant } from "../hooks/useRestaurant";
import {
  useGetOwnerRestaurantReviewsQuery,
  useReplyToReviewMutation,
} from "../restaurant-dashboard.api";
import type { RestaurantReview } from "../restaurant-dashboard.types";

const replySchema = z.object({
  reply: z.string().min(1).max(2000),
});
type ReplyFormValues = z.infer<typeof replySchema>;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? "fill-warning text-warning" : "text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  onReply,
}: {
  review: RestaurantReview;
  onReply: (review: RestaurantReview) => void;
}) {
  const { t } = useTranslation("restaurant-dashboard");

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-sm font-medium">{review.rating}/5</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {review.customer_name ?? t("reviews.anonymous")} ·{" "}
              {dayjs(review.created_at).format("DD.MM.YYYY")}
            </p>
          </div>
          {review.order_id && (
            <Badge variant="outline" className="text-xs">
              #{review.order_id.slice(-6)}
            </Badge>
          )}
        </div>

        {review.comment && <p className="text-sm">{review.comment}</p>}

        {/* Owner Reply */}
        {review.reply ? (
          <div className="rounded-md bg-muted p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              {t("reviews.yourReply")}
            </p>
            <p className="text-sm">{review.reply}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {review.reply_at
                ? dayjs(review.reply_at).format("DD.MM.YYYY")
                : ""}
            </p>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onReply(review)}>
            <MessageSquare size={14} className="mr-1" />
            {t("reviews.reply")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function RestaurantReviewsPage() {
  const { t } = useTranslation("restaurant-dashboard");
  const { restaurantId } = useRestaurant();

  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [replyReview, setReplyReview] = useState<RestaurantReview>();

  const { data, isLoading } = useGetOwnerRestaurantReviewsQuery(
    {
      restaurantId: restaurantId!,
      params: {
        page,
        limit: 10,
        ...(ratingFilter !== "all" ? { rating: Number(ratingFilter) } : {}),
      },
    },
    { skip: !restaurantId },
  );

  const [replyToReview, { isLoading: replying }] = useReplyToReviewMutation();

  const reviews = data?.data ?? [];
  const pagination = data?.meta;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
  });

  const onReplySubmit = async (values: ReplyFormValues) => {
    if (!replyReview || !restaurantId) return;
    try {
      await replyToReview({
        restaurantId,
        reviewId: replyReview.id,
        body: { reply: values.reply },
      }).unwrap();
      toast.success(t("reviews.replySent"));
      reset();
      setReplyReview(undefined);
    } catch {
      toast.error(t("common.error"));
    }
  };

  if (!restaurantId) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("reviews.title")}</h1>

        <Select
          value={ratingFilter}
          onValueChange={(v) => {
            setRatingFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("reviews.allRatings")}</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {"★".repeat(r)} ({r})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {t("reviews.noReviews")}
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReply={setReplyReview}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm">
            {page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog
        open={!!replyReview}
        onOpenChange={(v) => !v && setReplyReview(undefined)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("reviews.replyTo")}</DialogTitle>
          </DialogHeader>
          {replyReview && (
            <div className="space-y-3">
              <div className="rounded bg-muted p-3 text-sm">
                <StarRating rating={replyReview.rating} />
                {replyReview.comment && (
                  <p className="mt-1">{replyReview.comment}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  — {replyReview.customer_name ?? t("reviews.anonymous")}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onReplySubmit)}
                className="space-y-3"
              >
                <div>
                  <Label>{t("reviews.yourReplyLabel")}</Label>
                  <Textarea rows={4} {...register("reply")} />
                  {errors.reply && (
                    <p className="mt-1 text-xs text-error">
                      {t("common.required")}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setReplyReview(undefined)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" disabled={replying}>
                    {t("reviews.sendReply")}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
