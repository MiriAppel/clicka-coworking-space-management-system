// src/utils/apiService.ts
import { useAuthStore } from '../../store/useAuthStore'

interface RequestOptions extends RequestInit {
  retryCount?: number; // הוסף אופציה למספר ניסיונות חוזרים
}

const MAX_RETRIES = 1; // מספר ניסיונות ריענון
const REFRESH_TOKEN_ENDPOINT = '/api/auth/refresh-token'; // ה-endpoint לריענון טוקן בשרת

async function refreshAuthToken(): Promise<boolean> {
  const { clearUser } = useAuthStore.getState(); // גישה ל-clearUser מחוץ לקומפוננטה

  try {
    const response = await fetch(REFRESH_TOKEN_ENDPOINT, {
      method: 'POST', // או PUT, בהתאם לשרת שלך
      credentials: 'include', // **חשוב!** כדי לכלול את ה-HttpOnly cookie
    });

    if (!response.ok) {
      // אם הריענון נכשל (לדוגמה, Refresh Token פג/לא תקף)
      clearUser(); // נקה את המשתמש
      console.error('Refresh token expired or invalid. User needs to log in again.');
      // כאן תוכלי להוסיף הפנייה לדף התחברות (לדוגמה, window.location.href = '/login')
      return false;
    }

    const data = await response.json();
    const newAccessToken: string = data.accessToken;
    localStorage.setItem('accessToken', newAccessToken); // שמור את ה-Access Token החדש
    console.log('Access token refreshed successfully.');
    return true; // הריענון הצליח

  } catch (error) {
    console.error('Error refreshing token:', error);
    clearUser(); // נקה את המשתמש במקרה של שגיאה
    return false;
  }
}

// פונקציית fetch עוטפת עם לוגיקת ריענון
export async function authenticatedFetch<T>(
  url: RequestInfo,
  options: RequestOptions = {},
  isRetry = false // דגל לבדיקה אם זו בקשה חוזרת
): Promise<T> {
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let response = await fetch(url, { ...options, headers });

  // אם ה-Access Token פג (קוד 401) וזו לא בקשת ריענון שכשלה כבר
  if (response.status === 401 && url !== REFRESH_TOKEN_ENDPOINT && !isRetry) {
    console.log('Access token expired. Attempting to refresh...');
    const refreshed = await refreshAuthToken(); // נסה לרענן את הטוקן

    if (refreshed) {
      // אם הריענון הצליח, נסה שוב את הבקשה המקורית עם הטוקן החדש
      return authenticatedFetch(url, options, true); // קריאה חוזרת עם דגל isRetry = true
    } else {
      // אם הריענון נכשל, זרוק שגיאה או טפל בהתנתקות
      throw new Error('Authentication required. Failed to refresh token.');
    }
  }

  // אם התגובה היא 403 (Forbidden) או שגיאה אחרת לאחר ניסיונות ריענון
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Network response was not ok.');
  }

  return response.json() as Promise<T>;
}