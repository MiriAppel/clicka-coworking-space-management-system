import { Children, ReactNode, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { setUser, clearUser, setLoading,isLoading } = useAuthStore();


    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                let res = await fetch("/api/auth/verify", {
                    credentials: "include", // חשוב לשם שליחת ה-cookie
                });
                if (res.status == 200) {
                    console.log("Authenticated successfully in useEffect at App");
                    const data = await res.json();
                    setUser(data.user);
                    console.log(data.user);
                } else if (res.status == 401) {
                    const data = await res.json();
                    if (data.error === 'TokenExpired') {
                        const refreshRes = await fetch("/api/auth/refresh", {
                            method: "POST",
                            credentials: "include", // חשוב לשם שליחת ה-cookie
                        });
                        if (refreshRes.ok) {
                            console.log("Refresh token success in useEffect at App");
                            res = await fetch("/api/auth/verify", {
                                credentials: "include",
                            });
                            if (res.ok) {
                                const data = await res.json();
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
if(isLoading){
    return <div className="auth-loading"> מאמת זהות...</div>
}
return<>{children}</>

}