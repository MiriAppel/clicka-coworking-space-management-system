
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios from 'axios';
import type{ Invoice } from 'shared-types';
import { InvoiceStatus } from 'shared-types';


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

interface FetchInvoicesResponse {
  data: Invoice[];
}

interface CreateInvoiceResponse {
  data: Invoice;
}

interface InvoiceStorePersist {
  invoices: Invoice[];
}

export const useInvoiceStore = create<InvoiceState>()(
  devtools(
    persist(
      (
        set,
        get,
        _store
      ) => ({
        invoices: [],
        loading: false,
        error: null,

        // שליפת כל החשבוניות מהשרת
        fetchInvoices: async (): Promise<void> => {
          set({ loading: true, error: null });
          try {
            const response: FetchInvoicesResponse = await axios.get('http://localhost:3000/api/invoices');
            set({ invoices: response.data, loading: false });
          } catch (error: unknown) {
            set({ 
              error: 'Error fetching invoices', 
              loading: false 
            });
            console.error('Error fetching invoices:', error);
            throw error;
          }
        },


        // יצירת חשבונית חדשה
        createInvoice: async (
          newInvoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>
        ): Promise<Invoice> => {
          set({ loading: true, error: null });
          try {
            const response: CreateInvoiceResponse = await axios.post('http://localhost:3000/api/invoices/create', newInvoice);
            set((state: InvoiceState) => ({
              invoices: [...state.invoices, response.data],
              loading: false
            }));
            return response.data;
          } catch (error: unknown) {
            set({ error: 'Error creating invoice', loading: false });
            console.error('Error creating invoice:', error);
            throw error;
          }
        },

        // עדכון חשבונית קיימת
        updateInvoice: async (id: string, updates: Partial<Invoice>): Promise<Invoice> => {
          let updatedInvoice: Invoice | undefined;
          set((state: InvoiceState) => {
            const invoices: Invoice[] = state.invoices.map((invoice: Invoice) => {
              if (invoice.id === id) {
                updatedInvoice = { ...invoice, ...updates };
                return updatedInvoice;
              }
              return invoice;
            });
            return { invoices };
          });
          if (!updatedInvoice) throw new Error('Invoice not found');
          return updatedInvoice;
        },

        // מחיקת חשבונית
        deleteInvoice: async (id: string): Promise<void> => {
          try {
            await axios.delete<void>(`http://localhost:3000/api/invoices/delete/${id}`);
            set((state: InvoiceState) => ({
              invoices: state.invoices.filter((invoice: Invoice) => invoice.id !== id)
            }));
          } catch (error: unknown) {
            set({ error: 'Error deleting invoice' });
            console.error('Error deleting invoice:', error);
            throw error;
          }
        },

        // יצירת חשבוניות חודשיות אוטומטית לכל הלקוחות
        generateMonthlyInvoices: async (): Promise<Invoice[]> => {
          set({ loading: true, error: null });
          try {
            const response: FetchInvoicesResponse = await axios.post('http://localhost:3000/api/invoices/generateMonthly');
            set({ invoices: response.data, loading: false });
            return response.data;
          } catch (error: unknown) {
            set({ error: 'Error generating monthly invoices', loading: false });
            console.error('Error generating monthly invoices:', error);
            throw error;
          }
        },

        // שינוי סטטוס חשבונית (שולח, שולם, בוטל וכו')
        updateInvoiceStatus: async (id: string, status: InvoiceStatus): Promise<Invoice> => {
          return get().updateInvoice(id, { status });
        },
        // שליחת חשבונית למייל הלקוח
        sendInvoiceByEmail: async (invoiceId: string, email: string): Promise<void> => {
          try {
            await axios.post<void>(`http://localhost:3000/api/invoices/${invoiceId}/send`, { email });
            await get().updateInvoiceStatus(invoiceId, InvoiceStatus.SENT);
          } catch (error: unknown) {
            set({ error: 'Error sending invoice by email' });
            console.error('Error sending invoice by email:', error);
            throw error;
          }
        },
        // קבלת חשבוניות באיחור (עברו את תאריך התשלום)
        getOverdueInvoices: (): Invoice[] => {
          const { invoices } = get();
          const today = new Date().toISOString().split('T')[0];
          return invoices.filter((invoice: Invoice) =>
            invoice.status !== InvoiceStatus.PAID &&
            invoice.status !== InvoiceStatus.CANCELED &&
            invoice.due_date < today
          );
        },

        // קבלת חשבוניות לפי סטטוס (טיוטה, נשלח, שולם וכו')
        getInvoicesByStatus: (status: InvoiceStatus): Invoice[] => {
          const { invoices } = get();
          return invoices.filter((invoice: Invoice) => invoice.status === status);
        },  // חישוב סה"כ חשבוניות פתוחות (שטרם שולמו)
        calculateOpenInvoicesTotal: (): number => {
          const { invoices } = get();
          return invoices
            .filter((invoice: Invoice) => 
              invoice.status !== InvoiceStatus.PAID && 
              invoice.status !== InvoiceStatus.CANCELED
            )
            .reduce((total: number, invoice: Invoice) => total + invoice.subtotal, 0);
        },

        // ניקוי הודעת שגיאה
        clearError: (): void => {
          set({ error: null });
        }
      }),
      {
        // שם לשמירה ב-localStorage
        name: 'invoice-store', // שם ב-localStorage
        partialize: (state: InvoiceState): InvoiceStorePersist => ({ invoices: state.invoices }) // שומר רק את החשבוניות
      }
    ),
    { name: 'invoice-store' } // שם ב-DevTools
  )
);
