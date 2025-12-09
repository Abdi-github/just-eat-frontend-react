import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

interface RoleRouteProps {
  allowedRoles: string[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = user.roles.some((role) => allowedRoles.includes(role));
  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
