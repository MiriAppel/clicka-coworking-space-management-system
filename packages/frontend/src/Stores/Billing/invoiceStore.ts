import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  CreateInvoiceRequest,
  Invoice,
} from 'shared-types';
import { InvoiceStatus } from 'shared-types';
import { UUID } from 'crypto';
import axiosInstance from '../../Service/Axios';

interface InvoiceState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;

  fetchInvoices: () => Promise<void>;
  getAllInvoices: () => Promise<void>;
  getAllInvoiceItems: (invoiceId: UUID) => Promise<void>;
  createInvoice: (invoice: CreateInvoiceRequest) => Promise<Invoice>;
  updateInvoice: (invoiceNumber: string, updates: Partial<Invoice>) => Promise<Invoice>;
  deleteInvoice: (invoiceNumber: string) => Promise<void>;

  generateMonthlyInvoices: () => Promise<Invoice[]>;
  updateInvoiceStatus: (invoiceNumber: string, status: InvoiceStatus) => Promise<Invoice>;
  sendInvoiceByEmail: (invoiceNumber: string, email: string) => Promise<void>;

  getOverdueInvoices: () => Invoice[];
  getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
  calculateOpenInvoicesTotal: () => number;

  clearError: () => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  devtools(
    persist(
      (set, get) => ({
        invoices: [],
        loading: false,
        error: null,

        fetchInvoices: async () => {
          set({ loading: true, error: null });
          set({
            invoices: [],
            loading: false,
          });
        },

        getAllInvoices: async () => {
          set({ loading: true, error: null });
          try {
            const response = await axiosInstance.get('/invoices/');
            const invoicesData = Array.isArray(response.data.invoices) ? response.data.invoices : [];
            const processedInvoices = invoicesData.map((invoice: any) => ({
              ...invoice,
              items: invoice.items || invoice.invoice_item || [],
            }));
            set({ invoices: processedInvoices, loading: false });
          } catch (error) {
            console.error('שגיאה בשליפת חשבוניות:', error);
            set({
              error: 'Error fetching invoices',
              loading: false,
              invoices: [],
            });
            throw error;
          }
        },

        createInvoice: async (newInvoice) => {
          set({ loading: true, error: null });
          try {
            const response = await axiosInstance.post('/invoices', newInvoice);
            set((state) => ({
              invoices: Array.isArray(state.invoices) ? [...state.invoices, response.data] : [response.data],
              loading: false,
            }));
            return response.data;
          } catch (error) {
            set({ error: 'Error creating invoice', loading: false });
            console.error('Error creating invoice:', error);
            throw error;
          }
        },

        getAllInvoiceItems: async (invoiceId) => {
          try {
            const response = await axiosInstance.get(`/invoices/${invoiceId}/items`);
            return response.data;
          } catch (error) {
            console.error('Error fetching invoice items:', error);
            throw error;
          }
        },

        updateInvoice: async (invoiceId, updates) => {
          try {
            console.log('Store - Invoice Number:', invoiceId);
            console.log('Store - Updates:', JSON.stringify(updates, null, 2));
            const response = await axiosInstance.put(`/invoices/${invoiceId}`, updates);
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

        deleteInvoice: async (id) => {
          try {
            console.log('מוחק חשבונית:', id);
            console.log('URL:', `/invoices/${id}`);

            const response = await axiosInstance.delete(`/invoices/${id}`);
            console.log('תגובה מהשרת:', response);

            set((state) => {
              const filteredInvoices = state.invoices.filter(invoice => invoice.id !== id);
              return {
                invoices: filteredInvoices,
              };
            });
          } catch (error: any) {
            console.error('שגיאה במחיקת חשבונית:', error);
            console.error('פרטי השגיאה:', error.response?.data);
            set({ error: `Error deleting invoice: ${error.response?.data?.message || error.message}` });
            throw error;
          }
        },

        generateMonthlyInvoices: async () => {
          set({ loading: true, error: null });
          try {
            const response = await axiosInstance.post('/invoices/generateMonthly');
            set({ invoices: response.data, loading: false });
            return response.data;
          } catch (error) {
            set({ error: 'Error generating monthly invoices', loading: false });
            console.error('Error generating monthly invoices:', error);
            throw error;
          }
        },

        updateInvoiceStatus: async (id, status) => {
          return get().updateInvoice(id, {});
        },

        sendInvoiceByEmail: async (invoiceId, email) => {
          try {
            await axiosInstance.post(`/invoices/${invoiceId}/send`, { email });
            await get().updateInvoiceStatus(invoiceId, InvoiceStatus.DRAFT);
          } catch (error) {
            set({ error: 'Error sending invoice by email' });
            console.error('Error sending invoice by email:', error);
            throw error;
          }
        },

        getOverdueInvoices: () => {
          const { invoices } = get();
          const today = new Date().toISOString().split('T')[0];
          return invoices.filter(invoice =>
            invoice.status !== InvoiceStatus.PAID &&
            invoice.status !== InvoiceStatus.DRAFT &&
            invoice.due_date < today
          );
        },

        getInvoicesByStatus: (status) => {
          const { invoices } = get();
          return invoices.filter(invoice => invoice.status === status);
        },

        calculateOpenInvoicesTotal: () => {
          const { invoices } = get();
          return invoices
            .filter(invoice =>
              invoice.status !== InvoiceStatus.PAID &&
              invoice.status !== InvoiceStatus.DRAFT
            )
            .reduce((total, invoice) => total + invoice.subtotal, 0);
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'invoice-store',
        partialize: (state) => ({ invoices: state.invoices }),
      }
    ),
    { name: 'invoice-store' }
  )
);
