import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { roleHome } from "./roleHome";

export default function PublicRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>; // TODO: Spinner

  if (isAuthenticated && user) {
    return <Navigate to={roleHome[user.role]} replace />;
  }

  return <Outlet />;
}
