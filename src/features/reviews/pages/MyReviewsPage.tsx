import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MessageSquareText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
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
import { ReviewCard } from "../components/ReviewCard";
import { ReviewForm } from "../components/ReviewForm";
import {
  useGetMyReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "../reviews.api";
import type { Review, UpdateReviewRequest } from "../reviews.types";

export function MyReviewsPage() {
  const { t } = useTranslation("reviews");

  const { data, isLoading } = useGetMyReviewsQuery();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  const reviews = data?.data || [];

  const handleEdit = (review: Review) => {
    setEditingReview(review);
  };

  const handleEditSubmit = async (
    formData: UpdateReviewRequest | Record<string, unknown>,
  ) => {
    if (!editingReview) return;
    try {
      await updateReview({
        id: editingReview.id,
        body: formData as UpdateReviewRequest,
      }).unwrap();
      toast.success(t("success.updated"));
      setEditingReview(null);
    } catch {
      toast.error(t("error.updateFailed"));
    }
  };

  const handleDelete = async () => {
    if (!deletingReview) return;
    try {
      await deleteReview(deletingReview.id).unwrap();
      toast.success(t("success.deleted"));
      setDeletingReview(null);
    } catch {
      toast.error(t("error.deleteFailed"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <MessageSquareText className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">
            {t("noReviews")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("noReviewsDescription")}
          </p>
          <Button asChild className="mt-4">
            <Link to="/account/orders">{t("browseOrders")}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEdit}
              onDelete={setDeletingReview}
            />
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <ReviewForm
        open={!!editingReview}
        onOpenChange={(open) => !open && setEditingReview(null)}
        review={editingReview}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingReview}
        onOpenChange={(open) => !open && setDeletingReview(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirm.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteConfirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-error hover:bg-error/90"
            >
              {t("deleteConfirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
