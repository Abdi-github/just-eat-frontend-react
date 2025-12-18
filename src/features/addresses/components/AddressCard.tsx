import { useTranslation } from "react-i18next";
import { MapPin, Star, Pencil, Trash2, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { Address } from "../addresses.types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (id: string) => void;
  isSettingDefault?: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault,
}: AddressCardProps) {
  const { t } = useTranslation("addresses");

  // Build street part, avoiding duplication if street already contains the number
  const streetPart =
    address.street_number && !address.street.endsWith(address.street_number)
      ? `${address.street} ${address.street_number}`
      : address.street;

  const fullAddress = [
    streetPart,
    `${address.postal_code} ${address.city?.name || ""}`.trim(),
    address.canton?.code,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card
      className={`relative transition-shadow hover:shadow-md ${
        address.is_default ? "border-primary/50 ring-1 ring-primary/20" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-secondary">
                  {address.label}
                </span>
                {address.is_default && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    <Star className="mr-1 h-3 w-3" />
                    {t("default")}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{fullAddress}</p>
              {address.instructions && (
                <p className="text-xs text-muted-foreground italic">
                  {address.instructions}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {!address.is_default && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetDefault(address.id)}
                disabled={isSettingDefault}
                className="text-xs text-muted-foreground hover:text-primary"
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                {t("setDefault")}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(address)}
              className="h-8 w-8 text-muted-foreground hover:text-secondary"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(address)}
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
