import { Children, ReactNode, useEffect } from "react";
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import axios from "axios";

interface AuthProviderProps {
  children: ReactNode;
}
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, // Ensure cookies are sent with requests
});
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, clearUser, setLoading, setSessionId, sessionId } = useAuthStore();


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
          
        } else if (res.status == 401) {
          const data = res.data;
          if (data.error === 'TokenExpired') {
            const refreshRes = await axiosInstance.post("/api/auth/refresh");
            if (refreshRes.status === 200) {
              console.log("Refresh token success in useEffect at App");
              res = await axiosInstance.get("/api/auth/verify");
              if (res.status === 200) {
                const data = res.data;
                setUser(data.user);
                return;
              }
            }
          }
          clearUser();
        } else {
          clearUser();
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [setUser, clearUser, setLoading, setSessionId]);
  //check session every 30 seconds to check if the session is still valid and same as the one in the store
  //     useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       const res = await axiosInstance.get("/api/auth/verify");
  //       if (res.status === 200) {
  //         const data = res.data;
  //         const currentSessionId = useAuthStore.getState().sessionId;

  //         if (data.sessionId !== currentSessionId) {
  //           console.warn("Session ID mismatch - logging out.");
  //           clearUser();

  //         }
  //       }
  //     } catch (err) {
  //       console.error("Failed session check", err);
  //       clearUser();
  //     }
  //   }, 30000); // כל 30 שניות

  //   return () => clearInterval(interval); // ניקוי כאשר הקומפוננטה מוסרת
  // }, []);

  // if(isLoading){
  //     return <div className="auth-loading"> מאמת זהות...</div>
  // }
  return <>{children}</>

}