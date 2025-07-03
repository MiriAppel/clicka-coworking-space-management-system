import { Children, ReactNode, useEffect } from "react";
import { useAuthStore } from "../../../../Stores/Auth/useAuthStore";
import axios from "axios";
import { axiosInstance } from "../../../../service/Axios";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, clearUser, setLoading, setSessionId, sessionId, user } = useAuthStore();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        let res = await axiosInstance.get("/api/auth/verify");
        if (res.status == 200) {
          console.log("Authenticated successfully");
          const data = res.data;
          setUser(data.user);
          setSessionId(data.sessionId);
          return;
        }
        clearUser();
      }
      catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          const data = err.response.data;
          if (data.error === 'TokenExpired') {
            console.log(" Token expired, trying to refresh...");
            try {
              const refreshRes = await axiosInstance.post("/api/auth/refresh");
              if (refreshRes.status === 200) {
                console.log("Refresh token success");
                const res = await axiosInstance.get("/api/auth/verify");
                if (res.status === 200) {
                  const data = res.data;
                  setUser(data.user);
                  return;
                }
              }
            } catch (refreshErr) {
              console.warn("❌ Refresh token failed", refreshErr);
            }
          }
        }
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          console.warn("Session ID mismatch - logging out.");
          alert("you logged in in another device -please log in again")
          clearUser();
        }

        clearUser();

      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [setUser, clearUser, setLoading, setSessionId]);
  //check session every 30 seconds to check if the session is still valid and same as the one in the store
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (user != null) {
      interval = setInterval(async () => {
        try {
          const res = await axiosInstance.get("/api/auth/verify");
        } catch (err: any) {
          if (axios.isAxiosError(err) && err.response?.status === 409) {
            console.warn("Session ID mismatch - logging out.");
             alert("you logged in in another device -logging out")
            clearUser();
          }
          console.error("Failed session check", err);
          clearUser();
        }
      }, 30000); // כל 30 שניות
    }

    return () => {
      if (interval) clearInterval(interval); // ניקוי כאשר הקומפוננטה מוסרת
    };
  }, [user, clearUser]);

  // if(isLoading){
  //     return <div className="auth-loading"> מאמת זהות...</div>
  // }
  return <>{children}</>

}