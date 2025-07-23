import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import { ReactElement } from "react";

interface ProtectedRouteProps {
  children: ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};
