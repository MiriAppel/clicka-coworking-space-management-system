import { use } from "react";
import { LoginWithGoogle } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
export const AuthenticationScreen = () => {
  const { user, isAuthenticated, setUser, clearUser, setLoading } = useAuthStore();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/verify", {
          credentials: "include", // חשוב לשם שליחת ה-cookie
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          clearUser(); // אם אין התחברות תקפה
        }
      } catch (err) {
        console.log("Not authenticated");
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, clearUser, setLoading]);
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
/**import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore"; // הנתיב שלך
import { LoginWithGoogle } from "./LoginButton";
import { LogoutButton } from "./LogoutButton";

export const AuthenticationScreen = () => {
  



  return (
    <div className="authentication-screen">
      {isAuthenticated ? (
        <>
          <h1>שלום {user?.firstName}</h1>
          <LogoutButton />
        </>
      ) : (
        <>
          <h1>ברוך הבא!</h1>
          <p>אנא התחבר כדי להמשיך</p>
          <LoginWithGoogle />
        </>
      )}
    </div>
  );
};
 */