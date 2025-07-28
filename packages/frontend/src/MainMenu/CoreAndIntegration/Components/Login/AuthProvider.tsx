import { ReactNode, useEffect, useCallback } from "react";
import { useAuthStore } from "../../../../Stores/CoreAndIntegration/useAuthStore";
import axios from "axios";
import { axiosInstance } from "../../../../Service/Axios";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, clearUser, setLoading, setSessionId, user } = useAuthStore();

  // Wrap verifyFunction in useCallback to avoid useEffect dependency warning
  const verifyFunction = useCallback(async () => {
    try {
      setLoading(true);
      let res = await axiosInstance.get("/auth/verify");
      if (res.status === 200) {
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
            const refreshRes = await axiosInstance.post("/auth/refresh");
            if (refreshRes.status === 200) {
              console.log("Refresh token success");
              const res = await axiosInstance.get("/auth/verify");
              if (res.status === 200) {
                const data = res.data;
                setUser(data.user);
                return;
              }
            }
          } catch (refreshErr) {
            console.warn(" Refresh token failed", refreshErr);
          }
        }
      }
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        console.warn("Session ID mismatch - logging out.");
        showAlert("", "התחברת ממכשיר אחר , אנא התחבר שוב!", "error");
        clearUser();
      }
      clearUser();
    } finally {
      setLoading(false);
    }
  }, [setUser, clearUser, setLoading, setSessionId]);

  useEffect(() => {
    const checkAuth = async () => {
      verifyFunction();
    };
    checkAuth();
  }, [verifyFunction]);

  // Check session every 30 seconds to see if the session is still valid and matches the one in the store
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (user != null) {
      interval = setInterval(async () => {
        verifyFunction();
      }, 30000); // every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval); // cleanup when component unmounts
    };
  }, [user, verifyFunction]);

  return (
    <>
      {/* {user == null && <GoogleOneTap />} */}
      {children}
    </>
  )

}