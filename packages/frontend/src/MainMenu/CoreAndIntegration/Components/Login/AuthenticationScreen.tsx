import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import { LoginWithGoogle } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { LoginWithPassword } from "./LoginWithPassword";

export const AuthenticationScreen = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // Si ya está autenticado, redirigir automáticamente a la página principal
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="authentication-screen">
      {isAuthenticated ? (
        <div>
          <h1>
            שלום {user?.firstName} {user?.lastName}
          </h1>
          <LogoutButton />
        </div>
      ) : (
        <div>
          <h1>ברוך הבא!</h1>
          <p>אנא התחבר כדי להמשיך</p>
          {/* Botón login con Google */}
          <LoginWithGoogle />
          {/* Login con usuario y contraseña */}
          <LoginWithPassword />
        </div>
      )}
    </div>
  );
};
