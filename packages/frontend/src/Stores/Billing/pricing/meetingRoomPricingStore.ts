// useMeetingRoomPricingStore.ts
import { create } from 'zustand';
import { 
  getCurrentMeetingRoomPricing, 
  createMeetingRoomPricingWithHistory,
  updateMeetingRoomPricing,
  deleteMeetingRoomPricing,     // ודא שזה מיובא
  getAllMeetingRoomPricingHistory // ודא שזה מיובא
}  from '../../../Service/pricing.service';
import { MeetingRoomPricing, UpdateMeetingRoomPricingRequest } from 'shared-types';

interface MeetingRoomPricingState {
  current: MeetingRoomPricing | null;
  history: MeetingRoomPricing[]; // הוספנו מצב (state) להיסטוריה
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  fetchHistory: () => Promise<void>; // פונקציה להבאת היסטוריה
  save: (data: UpdateMeetingRoomPricingRequest, id?: string) => Promise<void>; 
  delete: (id: string) => Promise<void>; // פונקציה למחיקה
}

export const useMeetingRoomPricingStore = create<MeetingRoomPricingState>((set, get) => ({
  current: null,
  history: [], // אתחול מערך ההיסטוריה
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const pricing = await getCurrentMeetingRoomPricing();
      set({ current: pricing, loading: false });
    } catch (e: any) { 
      set({ error: e?.message || 'שגיאה בטעינת מחירי חדרי ישיבות', loading: false });
    }
  },
  // *** חדש: פונקציה להבאת כל המחירים ההיסטוריים ***
  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      const historyData = await getAllMeetingRoomPricingHistory();
      set({ history: historyData, loading: false });
    } catch (e: any) {
      set({ error: e?.message || 'שגיאה בטעינת היסטוריית מחירי חדרי ישיבות', loading: false });
    }
  },
  save: async (data, id) => { 
    set({ loading: true, error: null });
    try {
      if (id) {
        await updateMeetingRoomPricing(id, data); 
      } else {
        await createMeetingRoomPricingWithHistory(data);
      }
      set({ loading: false });
      // **חשוב**: רענון הנתונים לאחר שמירה/עדכון
      await get().fetch(); 
      await get().fetchHistory(); // רענן את נתוני ההיסטוריה לאחר שמירה/עדכון
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || 'שגיאה בשמירת הנתונים';
      set({ error: message, loading: false });
      throw new Error(message); 
    }
  },
  // *** חדש: פונקציית מחיקה עם רענון לאחר מכן ***
  delete: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteMeetingRoomPricing(id);
      set({ loading: false });
      alert('המחיר נמחק בהצלחה!');
      await get().fetch(); // רענן את המחיר הנוכחי (למקרה שהמחיר הנוכחי נמחק)
      await get().fetchHistory(); // רענן את נתוני ההיסטוריה לאחר המחיקה
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || 'שגיאה במחיקת הנתונים';
      set({ error: message, loading: false });
      alert(`שגיאה במחיקה: ${message}`); 
      throw new Error(message);
    }
  },
}));