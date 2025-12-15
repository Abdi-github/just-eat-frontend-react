import { useTranslation } from "react-i18next";
import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/utils/formatters";
import type { Review, RatingSummary } from "../restaurants.types";

// ── Rating Summary Display ──

interface RatingSummaryDisplayProps {
  summary: RatingSummary;
}

export function RatingSummaryDisplay({ summary }: RatingSummaryDisplayProps) {
  const { t } = useTranslation("restaurants");

  const maxCount = Math.max(...Object.values(summary.distribution), 1);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      {/* Average rating */}
      <div className="text-center">
        <div className="text-5xl font-bold text-foreground">
          {summary.average_rating.toFixed(1)}
        </div>
        <div className="mt-1 flex justify-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < Math.round(summary.average_rating)
                  ? "fill-warning text-warning"
                  : "text-border",
              )}
            />
          ))}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("reviews.totalReviews", { count: summary.review_count })}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 space-y-1.5">
        {([5, 4, 3, 2, 1] as const).map((stars) => {
          const count = summary.distribution[stars] || 0;
          const percentage = (count / maxCount) * 100;

          return (
            <div key={stars} className="flex items-center gap-2 text-sm">
              <span className="w-6 text-right text-muted-foreground">
                {stars}
              </span>
              <Star className="h-3 w-3 fill-warning text-warning" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-warning transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-6 text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Single Review Card ──

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useTranslation("restaurants");

  const userName = review.user
    ? `${review.user.first_name} ${review.user.last_name}`
    : "Anonymous";

  const initials = review.user
    ? `${review.user.first_name.charAt(0)}${review.user.last_name.charAt(0)}`
    : "A";

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{userName}</span>
            {review.is_verified && (
              <Badge
                variant="secondary"
                className="text-[10px] gap-0.5 px-1.5 py-0"
              >
                <CheckCircle className="h-2.5 w-2.5 text-success" />
                {t("reviews.verified")}
              </Badge>
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < review.rating
                      ? "fill-warning text-warning"
                      : "text-border",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.created_at)}
            </span>
          </div>

          {review.comment && (
            <p className="mt-2 text-sm text-foreground">{review.comment}</p>
          )}

          {/* Restaurant reply */}
          {review.restaurant_reply && (
            <div className="mt-3 rounded-md bg-muted p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                {t("reviews.restaurantReply")}
              </div>
              <p className="mt-1 text-sm text-foreground">
                {review.restaurant_reply}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Reviews Section (with summary + list) ──

interface RestaurantReviewsProps {
  reviews: Review[];
  summary: RatingSummary | null;
  isLoading?: boolean;
  hasMore?: boolean;
  ratingFilter: string;
  onRatingFilterChange: (value: string) => void;
  onLoadMore?: () => void;
}

export function RestaurantReviews({
  reviews,
  summary,
  isLoading,
  hasMore,
  ratingFilter,
  onRatingFilterChange,
  onLoadMore,
}: RestaurantReviewsProps) {
  const { t } = useTranslation("restaurants");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t("reviews.title")}</h2>

      {/* Rating summary */}
      {summary && summary.review_count > 0 && (
        <>
          <RatingSummaryDisplay summary={summary} />
          <Separator />
        </>
      )}

      {/* Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {summary
            ? t("reviews.totalReviews", { count: summary.review_count })
            : ""}
        </h3>
        <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("reviews.filterByRating")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("reviews.allRatings")}</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {t("reviews.stars", { count: r })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reviews list */}
      {isLoading && reviews.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            {t("reviews.noReviews")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("reviews.noReviewsDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id}>
              <ReviewCard review={review} />
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {t("reviews.loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-9 w-9 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
