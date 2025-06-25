// src/utils/apiService.ts
import axios from 'axios';
import { useAuthStore } from '../../../../Stores/Auth/useAuthStore';
import { Response } from 'express';

interface RequestOptions extends RequestInit {
  retryCount?: number; // הוסף אופציה למספר ניסיונות חוזרים
}
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true, // Ensure cookies are sent with requests
});
const MAX_RETRIES = 1; // מספר ניסיונות ריענון
const REFRESH_TOKEN_ENDPOINT = '/api/auth/refresh'; // ה-endpoint לריענון טוקן בשרת

async function refreshAuthToken(): Promise<boolean> {
  const { clearUser } = useAuthStore.getState(); // גישה ל-clearUser מחוץ לקומפוננטה
  try {
    const response = await axiosInstance.post<Response>(REFRESH_TOKEN_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      // אם הריענון נכשל (לדוגמה, Refresh Token פג/לא תקף)
      clearUser(); // נקה את המשתמש
      console.error('Refresh token expired or invalid. User needs to log in again.');
      // כאן תוכלי להוסיף הפנייה לדף התחברות (לדוגמה, window.location.href = '/login')
      return false;
    }

    return true; // refresh successful

  } catch (error) {
    console.error('Error refreshing token:', error);
    clearUser(); // clear the user if there's an error
    return false;
  }
}

// function feth with authentication and retry logic
export async function authenticatedFetch<T>(
  url: RequestInfo,
  options: RequestOptions = {},
  isRetry = false // flag to indicate if this is a retry attempt
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