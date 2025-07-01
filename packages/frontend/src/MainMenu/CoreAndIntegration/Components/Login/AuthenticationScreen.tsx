import { use } from "react";
import { LoginWithGoogle } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { useEffect } from "react";
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
export const AuthenticationScreen = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="authentication-screen">
      {isAuthenticated ? (
        <div>
          <h1>שלום {user?.firstName}</h1>
          <LogoutButton />
        </div>
      ) : (
        <div>
          <h1>ברוך הבא!</h1>
          <p>אנא התחבר כדי להמשיך</p>
          <LoginWithGoogle />
        </div>
      )}
    </div>
  );
}
