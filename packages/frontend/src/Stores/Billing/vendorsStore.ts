// vendors.store.ts
import { create } from 'zustand';
import { Vendor, Expense } from 'shared-types';

interface VendorsState {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  expenses: Expense[];
  loading: boolean;
  error?: string;
  fetchVendors: () => Promise<void>;
  selectVendor: (vendorId: string | null) => void;
  deleteVendor: (vendorId: string) => Promise<void>;
  fetchExpensesByVendorId: (vendorId: string) => Promise<void>;
}

export const useVendorsStore = create<VendorsState>((set, get) => ({
  vendors: [],
  selectedVendor: null,
  expenses: [],
  loading: false,
  error: undefined,

  fetchVendors: async () => {
    set({ loading: true, error: undefined });
    try {
      const res = await fetch('http://localhost:3001/vendor/');
      const data = await res.json();
      set({ vendors: data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "שגיאה בטעינת ספקים", loading: false });
    }
  },

  selectVendor: (vendorId: string | null) => {
    const vendor = get().vendors.find(v => v.id === vendorId) || null;
    set({ selectedVendor: vendor });
  },

  deleteVendor: async (vendorId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/vendor/${vendorId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("שגיאה במחיקה");
      set(state => ({
        vendors: state.vendors.filter(v => v.id !== vendorId),
        selectedVendor: state.selectedVendor?.id === vendorId ? null : state.selectedVendor
      }));
    } catch (error) {
      console.error(error);
    }
  },

  fetchExpensesByVendorId: async (vendorId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/expenses/getExpensesByVendorId/${vendorId}`);
      const data = await res.json();
      set({ expenses: data });
    } catch (error) {
      console.error("שגיאה בטעינת הוצאות:", error);
      set({ expenses: [] });
    }
  },
}));
