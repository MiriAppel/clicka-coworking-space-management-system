import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import React from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
   


  if (isLoading) {
    return <div>טוען...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
