import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
import { Plus, Pencil, Trash2, GripVertical, ImageIcon } from "lucide-react";
import { formatCHF } from "@/shared/utils/formatters";
import { CategoryForm } from "../components/CategoryForm";
import { MenuItemForm } from "../components/MenuItemForm";
import { useRestaurant } from "../hooks/useRestaurant";
import {
  useGetMenuCategoriesQuery,
  useCreateMenuCategoryMutation,
  useUpdateMenuCategoryMutation,
  useDeleteMenuCategoryMutation,
  useGetMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useToggleMenuItemAvailabilityMutation,
  useUploadMenuItemImageMutation,
  useDeleteMenuItemImageMutation,
} from "../restaurant-dashboard.api";
import type {
  MenuCategory,
  MenuItem,
  CreateMenuCategoryRequest,
  UpdateMenuCategoryRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from "../restaurant-dashboard.types";

export function MenuManagementPage() {
  const { t } = useTranslation("restaurant-dashboard");
  const { restaurantId } = useRestaurant();

  // Category state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null,
  );
  const [deletingCategory, setDeletingCategory] = useState<MenuCategory | null>(
    null,
  );

  // Item state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  // Filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // API queries
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetMenuCategoriesQuery(
      { restaurantId: restaurantId!, params: { limit: 100 } },
      { skip: !restaurantId },
    );
  const categories = categoriesData?.data ?? [];

  const { data: itemsData, isLoading: itemsLoading } = useGetMenuItemsQuery(
    {
      restaurantId: restaurantId!,
      params: {
        limit: 100,
        category_id:
          selectedCategoryId !== "all" ? selectedCategoryId : undefined,
        search: searchQuery || undefined,
      },
    },
    { skip: !restaurantId },
  );
  const items = itemsData?.data ?? [];

  // Mutations
  const [createCategory, { isLoading: creating }] =
    useCreateMenuCategoryMutation();
  const [updateCategory, { isLoading: updating }] =
    useUpdateMenuCategoryMutation();
  const [deleteCategory] = useDeleteMenuCategoryMutation();

  const [createItem, { isLoading: creatingItem }] = useCreateMenuItemMutation();
  const [updateItem, { isLoading: updatingItem }] = useUpdateMenuItemMutation();
  const [deleteItem] = useDeleteMenuItemMutation();
  const [toggleAvailability] = useToggleMenuItemAvailabilityMutation();
  const [uploadImage] = useUploadMenuItemImageMutation();
  const [deleteImage] = useDeleteMenuItemImageMutation();

  // Category handlers
  const handleCategorySubmit = useCallback(
    async (data: CreateMenuCategoryRequest | UpdateMenuCategoryRequest) => {
      if (!restaurantId) return;
      try {
        if (editingCategory) {
          await updateCategory({
            restaurantId,
            categoryId: editingCategory.id,
            body: data,
          }).unwrap();
          toast.success(t("menu.categoryUpdated"));
        } else {
          await createCategory({
            restaurantId,
            body: data as CreateMenuCategoryRequest,
          }).unwrap();
          toast.success(t("menu.categoryCreated"));
        }
        setCategoryDialogOpen(false);
        setEditingCategory(null);
      } catch {
        toast.error(t("common.error"));
      }
    },
    [restaurantId, editingCategory, createCategory, updateCategory, t],
  );

  const handleDeleteCategory = useCallback(async () => {
    if (!restaurantId || !deletingCategory) return;
    try {
      await deleteCategory({
        restaurantId,
        categoryId: deletingCategory.id,
      }).unwrap();
      toast.success(t("menu.categoryDeleted"));
    } catch {
      toast.error(t("common.error"));
    }
    setDeletingCategory(null);
  }, [restaurantId, deletingCategory, deleteCategory, t]);

  // Item handlers
  const handleItemSubmit = useCallback(
    async (data: CreateMenuItemRequest | UpdateMenuItemRequest) => {
      if (!restaurantId) return;
      try {
        if (editingItem) {
          await updateItem({
            restaurantId,
            itemId: editingItem.id,
            body: data,
          }).unwrap();
          toast.success(t("menu.itemUpdated"));
        } else {
          await createItem({
            restaurantId,
            body: data as CreateMenuItemRequest,
          }).unwrap();
          toast.success(t("menu.itemCreated"));
        }
        setItemDialogOpen(false);
        setEditingItem(null);
      } catch {
        toast.error(t("common.error"));
      }
    },
    [restaurantId, editingItem, createItem, updateItem, t],
  );

  const handleDeleteItem = useCallback(async () => {
    if (!restaurantId || !deletingItem) return;
    try {
      await deleteItem({
        restaurantId,
        itemId: deletingItem.id,
      }).unwrap();
      toast.success(t("menu.itemDeleted"));
    } catch {
      toast.error(t("common.error"));
    }
    setDeletingItem(null);
  }, [restaurantId, deletingItem, deleteItem, t]);

  const handleToggleAvailability = useCallback(
    async (item: MenuItem) => {
      if (!restaurantId) return;
      try {
        await toggleAvailability({
          restaurantId,
          itemId: item.id,
          is_available: !item.is_available,
        }).unwrap();
      } catch {
        toast.error(t("common.error"));
      }
    },
    [restaurantId, toggleAvailability, t],
  );

  const handleImageUpload = useCallback(
    async (itemId: string, file: File) => {
      if (!restaurantId) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        await uploadImage({ restaurantId, itemId, formData }).unwrap();
        toast.success(t("menu.imageUploaded"));
      } catch {
        toast.error(t("common.error"));
      }
    },
    [restaurantId, uploadImage, t],
  );

  const handleImageDelete = useCallback(
    async (itemId: string) => {
      if (!restaurantId) return;
      try {
        await deleteImage({ restaurantId, itemId }).unwrap();
        toast.success(t("menu.imageRemoved"));
      } catch {
        toast.error(t("common.error"));
      }
    },
    [restaurantId, deleteImage, t],
  );

  if (!restaurantId) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">{t("dashboard.noRestaurants")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("menu.title")}</h1>

      {/* Categories Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("menu.categories")}</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setEditingCategory(null);
              setCategoryDialogOpen(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            {t("menu.addCategory")}
          </Button>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("menu.noCategories")}
            </p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.slug} · {cat.item_count ?? 0} {t("menu.items").toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={cat.is_active ? "default" : "secondary"}>
                      {cat.is_active ? t("menu.active") : t("menu.inactive")}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryDialogOpen(true);
                      }}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-error"
                      onClick={() => setDeletingCategory(cat)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{t("menu.items")}</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("menu.searchItems")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("menu.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("menu.allCategories")}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => {
                setEditingItem(null);
                setItemDialogOpen(true);
              }}
              disabled={categories.length === 0}
            >
              <Plus size={16} className="mr-1" />
              {t("menu.addItem")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {itemsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {categories.length === 0
                ? t("menu.noItemsAny")
                : t("menu.noItems")}
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const category = categories.find(
                  (c) => c.id === item.category_id,
                );
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical
                        size={16}
                        className="text-muted-foreground"
                      />
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                          <ImageIcon
                            size={18}
                            className="text-muted-foreground"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {category && <span>{category.name}</span>}
                          {item.allergens.length > 0 && (
                            <span>
                              · {item.allergens.length}{" "}
                              {t("menu.allergens").toLowerCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {formatCHF(item.price)}
                      </span>
                      <Badge
                        variant={item.is_available ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleAvailability(item)}
                      >
                        {item.is_available
                          ? t("menu.isAvailable")
                          : t("menu.inactive")}
                      </Badge>
                      {item.is_popular && (
                        <Badge
                          variant="outline"
                          className="border-warning text-warning"
                        >
                          {t("menu.isPopular")}
                        </Badge>
                      )}
                      {/* Image upload */}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(item.id, file);
                            e.target.value = "";
                          }}
                        />
                        <ImageIcon
                          size={14}
                          className="text-muted-foreground hover:text-primary"
                        />
                      </label>
                      {item.image_url && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-error"
                          onClick={() => handleImageDelete(item.id)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingItem(item);
                          setItemDialogOpen(true);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-error"
                        onClick={() => setDeletingItem(item)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Form Dialog */}
      <CategoryForm
        open={categoryDialogOpen}
        onClose={() => {
          setCategoryDialogOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        isSubmitting={creating || updating}
        category={editingCategory}
      />

      {/* Menu Item Form Dialog */}
      <MenuItemForm
        open={itemDialogOpen}
        onClose={() => {
          setItemDialogOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleItemSubmit}
        isSubmitting={creatingItem || updatingItem}
        item={editingItem}
        categories={categories}
      />

      {/* Delete Category Confirm */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("menu.deleteCategory")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("menu.deleteCategoryConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-error text-white hover:bg-error/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Item Confirm */}
      <AlertDialog
        open={!!deletingItem}
        onOpenChange={(open) => {
          if (!open) setDeletingItem(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("menu.deleteItem")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("menu.deleteItemConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              className="bg-error text-white hover:bg-error/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
