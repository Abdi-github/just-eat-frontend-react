import { useTranslation } from "react-i18next";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { OrderCard } from "./OrderCard";
import type { OrderListItem } from "../orders.types";

interface OrderListProps {
  orders: OrderListItem[];
  isLoading: boolean;
}

export function OrderList({ orders, isLoading }: OrderListProps) {
  const { t } = useTranslation("orders");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
