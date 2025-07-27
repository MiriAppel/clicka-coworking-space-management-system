import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import { ReactElement } from "react";

interface ProtectedRouteProps {
  children: ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Mostrar pantalla de carga mientras verifica token
  if (isLoading) {
    return <div className="auth-loading">Verificando sesión...</div>;
  }

  // Si no está autenticado o la sesión expiró, redirigir a /auth
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Si todo ok, renderizar hijos
  return children;
};
