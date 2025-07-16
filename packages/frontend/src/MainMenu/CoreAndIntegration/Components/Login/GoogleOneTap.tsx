import { useEffect } from 'react';
import { useAuthStore } from '../../../../Stores/CoreAndIntegration/useAuthStore';
import { axiosInstance } from '../../../../Services/Axios';

export default function GoogleOneTap() {
  const { setUser, setSessionId } = useAuthStore();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).google) {
         try {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: true,
        });

        (window as any).google.accounts.id.prompt(); // מציג את החלון האוטומטי
         console.log("✔️ Google One Tap initialized");
          } catch (error) {
        console.error("❌ שגיאה באתחול Google One Tap:", error);
      }
      }
    };

  script.onerror = () => {
    console.error("❌ שגיאה בטעינת Google script");
  };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    try {
      const res = await axiosInstance.post('auth/google-login', { idToken });
      if (res.status === 200) {
        setUser(res.data.user);
        setSessionId(res.data.sessionId);
        console.log("✔️ התחברות אוטומטית הצליחה");
      }
    } catch (err) {
      console.error("❌ שגיאה בהתחברות עם Google One Tap", err);
    }
  };

  return null;
  
}
