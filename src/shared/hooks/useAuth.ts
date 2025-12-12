import { useAppSelector } from "@/app/hooks";

export function useAuth() {
  const { user, isAuthenticated, token } = useAppSelector(
    (state) => state.auth,
  );

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) ?? false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => hasRole(role));
  };

  return {
    user,
    isAuthenticated,
    token,
    hasRole,
    hasAnyRole,
    isCustomer: hasRole("customer"),
    isRestaurantOwner: hasRole("restaurant_owner"),
    isRestaurantStaff: hasRole("restaurant_staff"),
    isCourier: hasRole("courier"),
  };
}
