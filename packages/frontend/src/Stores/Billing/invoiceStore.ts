
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios from 'axios';
import {
  CreateInvoiceRequest,
  Invoice,
//   InvoiceItem,
} from 'shared-types';
import { InvoiceStatus } from 'shared-types';
import { UUID } from 'crypto';
interface InvoiceState {
  //  STATE 
  invoices: Invoice[];
  loading: boolean;
  error: string | null;

  //  פעולות בסיסיות 
  getAllInvoices: () => Promise<void>;
  getAllInvoiceItems: (invoiceId: UUID) => Promise<void>;
  createInvoice: (invoice: CreateInvoiceRequest) => Promise<Invoice>;
  updateInvoice: (invoiceNumber: string, updates: Partial<Invoice>) => Promise<Invoice>; // שינוי מ-id ל-invoiceNumber
  deleteInvoice: (invoiceNumber: string) => Promise<void>; // שינוי מ-id ל-invoiceNumber

  // פעולות מתקדמות
  generateMonthlyInvoices: () => Promise<Invoice[]>;
  updateInvoiceStatus: (invoiceNumber: string, status: InvoiceStatus) => Promise<Invoice>; // שינוי מ-id ל-invoiceNumber
  sendInvoiceByEmail: (invoiceNumber: string, email: string) => Promise<void>; // שינוי מ-invoiceId ל-invoiceNumber

  //  חישובים ושאילתות 
  getOverdueInvoices: () => Invoice[];
  getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
  calculateOpenInvoicesTotal: () => number;

  //  עזר 
  clearError: () => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  devtools(
    persist(
      (set, get) => ({
        //מצב התחלתי 
        invoices: [],
        loading: false,
        error: null,
        
        getAllInvoices: async () => {
          set({ loading: true, error: null });
          try {
            const response = await axios.get('http://localhost:3001/api/invoices/');

            // השרת מחזיר אובייקט עם message ו-invoices
            const invoicesData = Array.isArray(response.data.invoices) ? response.data.invoices : [];

            // 🔧 עיבוד הפריטים - זה החלק החדש היחיד!
            const processedInvoices = invoicesData.map((invoice: any) => {

              return {
                ...invoice,
                // וודא שהפריטים נמצאים בשדה הנכון
                items: invoice.items || invoice.invoice_item || []
              };
            });
            // 🔍 דיבוג נוסף - בדיקת items
            if (processedInvoices.length > 0) {
              console.log('🧾 דוגמה לחשבונית ראשונה:', processedInvoices[0]);
              console.log('📋 פריטים בחשבונית הראשונה:', processedInvoices[0]?.items);
              console.log('🔢 כמות פריטים:', processedInvoices[0]?.items?.length || 0);
            }

            set({ invoices: processedInvoices, loading: false });
          } catch (error) {
            console.error('❌ שגיאה בשליפת חשבוניות:', error);
            set({
              error: 'Error fetching invoices',
              loading: false,
              invoices: []
            });
            throw error;
          }
        },

        // יצירת חשבונית חדשה
        createInvoice: async (newInvoice) => {
          set({ loading: true, error: null });
          try {
            const response = await axios.post('http://localhost:3001/api/invoices/create', newInvoice);
            set((state) => ({
              invoices: Array.isArray(state.invoices) ? [...state.invoices, response.data] : [response.data],
              loading: false
            }));
            return response.data;
          } catch (error) {
            set({ error: 'Error creating invoice', loading: false });
            console.error('Error creating invoice:', error);
            throw error;
          }
        },
        getAllInvoiceItems: async (invoiceId) => {
          console.log('stor44444');
          try {
            const response = await axios.get(`http://localhost:3001/api/invoices/items/${invoiceId}`);
            return response.data;
          } catch (error) {
            console.error('Error fetching invoice items:', error);
            throw error;
          }
        },
        // עדכון חשבונית קיימת
        updateInvoice: async (invoiceId, updates) => {
          try {
            console.log('Store - Invoice Number:', invoiceId);
            console.log('Store - Updates:', JSON.stringify(updates, null, 2));
            const response = await axios.put(`http://localhost:3001/api/invoices/${invoiceId}`, updates);
            console.log('Store - Response:', response.data);
            set((state) => ({
              invoices: state.invoices.map(invoice =>
                invoice.id === invoiceId ? { ...invoice, ...response.data.invoice } : invoice
              )
            }));
            return response.data.invoice;
          } catch (error: any) {
            console.error('Store - Error updating invoice:', error);
            console.error('Store - Error response:', error.response?.data);
            set({ error: 'Error updating invoice' });
            throw error;
          }
        },
        // updateInvoice: async (invoiceNumber, updates) => {
        //   try {
        //     const response = await axios.put(`http://localhost:3001/api/invoices/${invoiceNumber}`, updates);
        //     set((state) => ({
        //       invoices: state.invoices.map(invoice =>
        //         invoice.invoice_number === invoiceNumber ? { ...invoice, ...response.data } : invoice
        //       )
        //     }));
        //     return response.data;
        //   } catch (error) {
        //     set({ error: 'Error updating invoice' });
        //     console.error('Error updating invoice:', error);
        //     throw error;
        //   }
        // },

        // מחיקת חשבונית
        deleteInvoice: async (id) => {
          try {
            console.log('מוחק חשבונית:', id);
            console.log('URL:', `http://localhost:3001/api/invoices/${id}`);

            const response = await axios.delete(`http://localhost:3001/api/invoices/${id}`);
            console.log('תגובה מהשרת:', response);

            set((state) => {
              const filteredInvoices = state.invoices.filter(invoice => {
                console.log('בודק חשבונית:', invoice.id, 'נגד:', id);
                return invoice.id !== id;
              });
              console.log('חשבוניות לפני מחיקה:', state.invoices.length);
              console.log('חשבוניות אחרי מחיקה:', filteredInvoices.length);

              return {
                invoices: filteredInvoices
              };
            });
          } catch (error: any) {
            console.error('שגיאה במחיקת חשבונית:', error);
            console.error('פרטי השגיאה:', error.response?.data);
            console.error('סטטוס קוד:', error.response?.status);
            console.error('הודעת השגיאה מהשרת:', error.response?.data?.message);
            console.error('פרטים נוספים:', error.response?.data?.error);
            set({ error: `Error deleting invoice: ${error.response?.data?.message || error.message}` });
            throw error;
          }
        },

        // יצירת חשבוניות חודשיות אוטומטית לכל הלקוחות
        generateMonthlyInvoices: async () => {
          set({ loading: true, error: null });
          try {
            const response = await axios.post('http://localhost:3001/api/invoices/generateMonthly');
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
          return get().updateInvoice(id, {});
        },

        // שליחת חשבונית למייל הלקוח
        sendInvoiceByEmail: async (invoiceId, email) => {
          try {
            await axios.post(`http://localhost:3001/api/invoices/${invoiceId}/send`, { email });
            await get().updateInvoiceStatus(invoiceId, InvoiceStatus.DRAFT);
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
            invoice.status !== InvoiceStatus.DRAFT &&
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
              invoice.status !== InvoiceStatus.DRAFT
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
