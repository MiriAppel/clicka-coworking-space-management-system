
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios from 'axios';
import { 
  Invoice, 
  BillingItemType, 
  InvoiceStatus 
} from '../../types/billing';

interface InvoiceState {
  // ===== STATE =====
  invoices: Invoice[];
  loading: boolean;
  error: string | null;

  // ===== פעולות בסיסיות =====
  fetchInvoices: () => Promise<void>;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;

  // ===== פעולות מתקדמות =====
  generateMonthlyInvoices: () => Promise<Invoice[]>;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<Invoice>;
  sendInvoiceByEmail: (invoiceId: string, email: string) => Promise<void>;

  // ===== חישובים ושאילתות =====
  getOverdueInvoices: () => Invoice[];
  getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
  calculateOpenInvoicesTotal: () => number;

  // ===== עזר =====
  clearError: () => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  devtools(
    persist(
      (set, get) => ({
        // ===== מצב התחלתי =====
        invoices: [],
        loading: false,
        error: null,

        // שליפת כל החשבוניות מהשרת
        // fetchInvoices: async () => {
        //   set({ loading: true, error: null });
        //   try {
        //     const response = await axios.get('http://localhost:3000/api/invoices');
        //     set({ invoices: response.data, loading: false });
        //   } catch (error) {
        //     set({ 
        //       error: 'Error fetching invoices', 
        //       loading: false 
        //     });
        //     console.error('Error fetching invoices:', error);
        //     throw error;
        //   }
        // },
        fetchInvoices: async () => {
  set({ loading: true, error: null });
  set({
    invoices: [
      {
        id: '1',
        invoice_number: '1001',
        customer_id: 'c1',
        customer_name: 'לקוח א',
        status: InvoiceStatus.ISSUED,
        issue_date: '2024-06-01',
        due_date: '2024-06-30',
        items: [],
        subtotal: 100,
        tax_total: 17,
        createdAt: '2024-06-01',
        updatedAt: '2024-06-01'
      }
    ],
    loading: false
  });
},

        // יצירת חשבונית חדשה
        createInvoice: async (newInvoice) => {
          set({ loading: true, error: null });
          try {
            const response = await axios.post('http://localhost:3000/api/invoices/create', newInvoice);
            set((state) => ({
              invoices: [...state.invoices, response.data],
              loading: false
            }));
            return response.data;
          } catch (error) {
            set({ error: 'Error creating invoice', loading: false });
            console.error('Error creating invoice:', error);
            throw error;
          }
        },

        // עדכון חשבונית קיימת
        updateInvoice: async (id, updates) => {
          try {
            const response = await axios.put(`http://localhost:3000/api/invoices/update/${id}`, updates);
            set((state) => ({
              invoices: state.invoices.map(invoice =>
                invoice.id === id ? { ...invoice, ...response.data } : invoice
              )
            }));
            return response.data;
          } catch (error) {
            set({ error: 'Error updating invoice' });
            console.error('Error updating invoice:', error);
            throw error;
          }
        },

        // מחיקת חשבונית
        deleteInvoice: async (id) => {
          try {
            await axios.delete(`http://localhost:3000/api/invoices/delete/${id}`);
            set((state) => ({
              invoices: state.invoices.filter(invoice => invoice.id !== id)
            }));
          } catch (error) {
            set({ error: 'Error deleting invoice' });
            console.error('Error deleting invoice:', error);
            throw error;
          }
        },

        // יצירת חשבוניות חודשיות אוטומטית לכל הלקוחות
        generateMonthlyInvoices: async () => {
          set({ loading: true, error: null });
          try {
            const response = await axios.post('http://localhost:3000/api/invoices/generateMonthly');
            set({ invoices: response.data, loading: false });
            return response.data;
          } catch (error) {
            set({ error: 'Error generating monthly invoices', loading: false });
            console.error('Error generating monthly invoices:', error);
            throw error;
          }
        },

        // שינוי סטטוס חשבונית (שולח, שולם, בוטל וכו')
        updateInvoiceStatus: async (id, status) => {
          return get().updateInvoice(id, { status });
        },

        // שליחת חשבונית למייל הלקוח
        sendInvoiceByEmail: async (invoiceId, email) => {
          try {
            await axios.post(`http://localhost:3000/api/invoices/${invoiceId}/send`, { email });
            await get().updateInvoiceStatus(invoiceId, InvoiceStatus.SENT);
          } catch (error) {
            set({ error: 'Error sending invoice by email' });
            console.error('Error sending invoice by email:', error);
            throw error;
          }
        },

        // קבלת חשבוניות באיחור (עברו את תאריך התשלום)
        getOverdueInvoices: () => {
          const { invoices } = get();
          const today = new Date().toISOString().split('T')[0];
          return invoices.filter(invoice =>
            invoice.status !== InvoiceStatus.PAID &&
            invoice.status !== InvoiceStatus.CANCELED &&
            invoice.due_date < today
          );
        },

        // קבלת חשבוניות לפי סטטוס (טיוטה, נשלח, שולם וכו')
        getInvoicesByStatus: (status) => {
          const { invoices } = get();
          return invoices.filter(invoice => invoice.status === status);
        },

        // חישוב סה"כ חשבוניות פתוחות (שטרם שולמו)
        calculateOpenInvoicesTotal: () => {
          const { invoices } = get();
          return invoices
            .filter(invoice => 
              invoice.status !== InvoiceStatus.PAID && 
              invoice.status !== InvoiceStatus.CANCELED
            )
            .reduce((total, invoice) => total + invoice.subtotal, 0);
        },

        // ניקוי הודעת שגיאה
        clearError: () => {
          set({ error: null });
        }
      }),
      {
        name: 'invoice-store', // שם לשמירה ב-localStorage
        partialize: (state) => ({ invoices: state.invoices }) // שומר רק את החשבוניות
      }
    ),
    { name: 'invoice-store' } // שם ב-DevTools
  )
);
