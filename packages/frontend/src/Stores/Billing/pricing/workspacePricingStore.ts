// Stores/Billing/pricing/workspacePricingStore.ts
import { create } from 'zustand';
import { getCurrentPricingTier,
   createPricingTierWithHistory, 
   updatePricingTierPricing, 
   deleteLoungePricing} from '../../../Service/pricing.service';
import { PricingTier ,UpdatePricingTierRequest} from 'shared-types';

interface WorkspacePricingState {
  current: PricingTier | null;
  loading: boolean;
  error: string | null;
//  fetch: (workspaceType: string) => Promise<void>;
 // save: (data: PricingTierCreateRequest) => Promise<void>;
   fetch: (workspaceType: string) => Promise<void>;
    fetchHistory: () => Promise<void>; // ייתכן ותצטרך פונקציה נפרדת להבאת היסטוריה
    save: (data: UpdatePricingTierRequest, id?: string) => Promise<void>;
    delete: (id: string) => Promise<void>; // הוספת פונקציית מחיקה לסטור
}
export const useWorkspacePricingStore = create<WorkspacePricingState>((set, get) => ({
  current: null,
  history: [], // אתחול
  loading: false,
  error: null,
  fetch: async (workspaceType) => {
    set({ loading: true, error: null });
    try {
      const pricing = await getCurrentPricingTier(workspaceType);
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
        await updatePricingTierPricing(id, data);
      } else {
        await createPricingTierWithHistory(data);
      }
      set({ loading: false });
    //  await get().fetch(); // רענן את המידע הנוכחי
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
      //await get().fetch(); // רענן את המידע הנוכחי (אם המחיר הנוכחי נמחק)
      await get().fetchHistory(); // *** רענן את נתוני ההיסטוריה לאחר מחיקה ***
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || 'שגיאה במחיקת הנתונים';
      set({ error: message, loading: false });
      alert(`שגיאה במחיקה: ${message}`);
      throw new Error(message);
    }
  }
}));
/*
export const useWorkspacePricingStore = create<WorkspacePricingState>((set) => ({
  current: null,
  loading: false,
  error: null,
  fetch: async (workspaceType) => {
    set({ loading: true, error: null });
    try {
      const pricing = await getCurrentPricingTier(workspaceType);
      set({ current: pricing, loading: false });
    } catch (err: any) {
      console.error("שגיאה ב-fetch (Zustand):", err);
      set({ error: err.message || 'שגיאה בטעינת המחיר הנוכחי.', loading: false });
      // חשוב: זרוק את השגיאה גם החוצה כדי שהקומפוננטה תוכל לתפוס אותה
      throw err; 
    }
  },
  save: async (data) => {
    set({ loading: true, error: null }); // נקה שגיאות קודמות לפני ניסיון חדש
    try {
  
      const result = await updatePricingTierPricing(data);
      set({ loading: false, current: result });
    } catch (err: any) {
      console.error("שגיאה ב-save (Zustand):", err);
      // חשוב: השתמש ב-err.message שנוצר ב-pricing.service.ts
      set({ error: err.message || 'שגיאה בשמירת הנתונים.' });
      set({ loading: false }); // ודא ש-loading מתאפס
      // *** הנקודה המרכזית: זרוק את השגיאה הלאה! ***
      throw err; 
    }
  },
}));*/