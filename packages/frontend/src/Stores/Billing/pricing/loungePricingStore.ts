// Stores/Billing/pricing/loungePricingStore.ts
import { create } from 'zustand';
import { 
  getCurrentLoungePricing, 
  createLoungePricingWithHistory,
  updateLoungePricing,
  deleteLoungePricing // וודא שזה מיובא
}  from '../../../Service/pricing.service';
import { LoungePricing, UpdateLoungePricingRequest } from 'shared-types';

interface LoungePricingState {
  current: LoungePricing | null;
  history: LoungePricing[]; // נניח שיש לך גם היסטוריה בסטור, אם לא, נצטרך להוסיף fetchHistory
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  fetchHistory: () => Promise<void>; // ייתכן ותצטרך פונקציה נפרדת להבאת היסטוריה
  save: (data: UpdateLoungePricingRequest, id?: string) => Promise<void>;
  delete: (id: string) => Promise<void>; // הוספת פונקציית מחיקה לסטור
}

export const useLoungePricingStore = create<LoungePricingState>((set, get) => ({
  current: null,
  history: [], // אתחול
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const pricing = await getCurrentLoungePricing();
      set({ current: pricing, loading: false });
    } catch (e: any) {
      set({ error: e?.message || 'שגיאה בטעינת מחירי לאונג', loading: false });
    }
  },
  // פונקציה להבאת היסטוריית מחירים (ייתכן שצריך להוסיף ל-pricing.service.ts)
  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      // נניח שיש לך פונקציה ב service שמביאה את כל ההיסטוריה
      // אם לא, נצטרך להוסיף אותה (לדוגמה: getAllLoungePricingHistory())
      // בינתיים, נשתמש ב current אם אין פונקציה אחרת
      // אולי ה-current מביא גם את ההיסטוריה, או שיש לו מערך היסטוריה בפנים
      // לצורך הדוגמה, נניח שיש API שמביא את כל הרשומות
      // חשוב: אם זה לא קיים ב service, תצטרך להוסיף אותו שם
      // const historyData = await getAllLoungePricingHistory(); 
      // set({ history: historyData, loading: false });
      set({ loading: false }); // אם אין fetchHistory בפועל, רק נוריד את הלואדינג
    } catch (e: any) {
      set({ error: e?.message || 'שגיאה בטעינת היסטוריית מחירי לאונג', loading: false });
    }
  },
  save: async (data, id) => {
    set({ loading: true, error: null });
    try {
      if (id) {
        await updateLoungePricing(id, data);
      } else {
        await createLoungePricingWithHistory(data);
      }
      set({ loading: false });
      await get().fetch(); // רענן את המידע הנוכחי
      await get().fetchHistory(); // *** רענן את נתוני ההיסטוריה לאחר שמירה/עדכון ***
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || 'שגיאה בשמירת הנתונים';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },
  // *** פונקציית מחיקה עם רענון לאחר מכן ***
  delete: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteLoungePricing(id);
      set({ loading: false });
      alert('המחיר נמחק בהצלחה!');
      await get().fetch(); // רענן את המידע הנוכחי (אם המחיר הנוכחי נמחק)
      await get().fetchHistory(); // *** רענן את נתוני ההיסטוריה לאחר מחיקה ***
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || 'שגיאה במחיקת הנתונים';
      set({ error: message, loading: false });
      alert(`שגיאה במחיקה: ${message}`);
      throw new Error(message);
    }
  },
}));