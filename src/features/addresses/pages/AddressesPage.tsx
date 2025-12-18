import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
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
import { AddressList } from "../components/AddressList";
import { AddressForm } from "../components/AddressForm";
import {
  useGetAddressesListQuery,
  useCreateNewAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetAddressDefaultMutation,
} from "../addresses.api";
import type { Address, CreateAddressRequest } from "../addresses.types";

export function AddressesPage() {
  const { t } = useTranslation("addresses");

  const { data, isLoading } = useGetAddressesListQuery();
  const [createAddress, { isLoading: isCreating }] =
    useCreateNewAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefault, { isLoading: isSettingDefault }] =
    useSetAddressDefaultMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

  const addresses = data?.data || [];
  const maxReached = addresses.length >= 10;

  const handleAdd = () => {
    setEditingAddress(null);
    setFormOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData: CreateAddressRequest) => {
    try {
      if (editingAddress) {
        await updateAddress({
          id: editingAddress.id,
          body: formData,
        }).unwrap();
        toast.success(t("success.updated"));
      } else {
        await createAddress(formData).unwrap();
        toast.success(t("success.created"));
      }
      setFormOpen(false);
      setEditingAddress(null);
    } catch {
      toast.error(
        editingAddress ? t("error.updateFailed") : t("error.createFailed"),
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingAddress) return;
    try {
      await deleteAddress(deletingAddress.id).unwrap();
      toast.success(t("success.deleted"));
      setDeletingAddress(null);
    } catch {
      toast.error(t("error.deleteFailed"));
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefault(id).unwrap();
      toast.success(t("success.defaultSet"));
    } catch {
      toast.error(t("error.defaultFailed"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={handleAdd} disabled={maxReached}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addAddress")}
        </Button>
      </div>

      {maxReached && <p className="text-sm text-warning">{t("maxReached")}</p>}

      <AddressList
        addresses={addresses}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeletingAddress}
        onSetDefault={handleSetDefault}
        isSettingDefault={isSettingDefault}
      />

      <AddressForm
        open={formOpen}
        onOpenChange={setFormOpen}
        address={editingAddress}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingAddress}
        onOpenChange={(open) => !open && setDeletingAddress(null)}
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
