import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { roleHome } from "./roleHome";

export default function RootRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>; // TODO: Spinner

  return (
    <Navigate
      to={isAuthenticated && user ? roleHome[user.role] : "/auth/login"}
      replace
    />
  );
}
