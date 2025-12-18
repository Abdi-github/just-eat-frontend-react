import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AddressCard } from "./AddressCard";
import type { Address } from "../addresses.types";

interface AddressListProps {
  addresses: Address[];
  isLoading: boolean;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (id: string) => void;
  isSettingDefault?: boolean;
}

export function AddressList({
  addresses,
  isLoading,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault,
}: AddressListProps) {
  const { t } = useTranslation("addresses");

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          {t("noAddresses")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("noAddressesDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          isSettingDefault={isSettingDefault}
        />
      ))}
    </div>
  );
}
