import { Children, ReactNode, useEffect } from "react";
import { useAuthStore } from "../../../../Stores/Auth/useAuthStore";
import axios from "axios";

interface AuthProviderProps {
  children: ReactNode;
}
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, // Ensure cookies are sent with requests
});
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { setUser, clearUser, setLoading,isLoading } = useAuthStore();


    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                let res = await axiosInstance.get("/api/auth/verify");
                if (res.status == 200) {
                    console.log("Authenticated successfully in useEffect at App");
                    const data = res.data;
                    setUser(data.user);
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
    }, [setUser, clearUser, setLoading]);
// if(isLoading){
//     return <div className="auth-loading"> מאמת זהות...</div>
// }
return<>{children}</>

}