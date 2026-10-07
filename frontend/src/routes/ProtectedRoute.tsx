// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Role } from "@/features/auth/auth.types";
import { useAuth } from "@/context/AuthContext";
import { roleHome } from "./roleHome";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Wait for session restore, otherwise a refresh would redirect to login
  if (isLoading) return <div>Loading...</div>; // TODO: replace with a Spinner

  // Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Logged in, but wrong role: send to their own home
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  return <Outlet />;
}
