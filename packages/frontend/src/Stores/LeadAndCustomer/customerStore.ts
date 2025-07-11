import { CreateCustomerRequest, Customer, CustomerStatus } from 'shared-types'; // עדכן את הנתיב אם צריך
import { create } from 'zustand';

interface CustomerStore {
    customersPage: Customer[];
    customers: Customer[];
    selectedCustomer: Customer | null;
    loading: boolean;
    error?: string;
    currentPage: number;
    limit: number;
    fetchNextPage: () => Promise<void>;
    fetchPrevPage: () => Promise<void>;
    fetchCustomers: () => Promise<void>;
    fetchCustomersByPage: () => Promise<void>;
    searchCustomersByText: (searchTerm: string) => Promise<void>;
    searchCustomersInPage: (searchTerm: string) => Promise<void>;
    fetchCustomerById: (id: string) => Promise<Customer | null>;
    createCustomer: (customer: CreateCustomerRequest) => Promise<void>;
    updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    resetSelectedCustomer: () => void;
}

const BASE_API_URL = `${process.env.REACT_APP_API_URL}/customers`;

export const useCustomerStore = create<CustomerStore>((set) => ({
    customersPage: [],
    customers: [],
    selectedCustomer: null,
    currentPage: 1,
    limit: 20, // מספר הלקוחות לעמוד
    loading: false,
    error: undefined,

    fetchCustomers: async () => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(BASE_API_URL);
            if (!response.ok) {
                throw new Error("Failed to fetch customers");
            }
            const data: Customer[] = await response.json();
            set({ customers: data, loading: false });
        } catch (error: any) {
            set({ error: error.message || "שגיאה בטעינת הלקוחות", loading: false });
        }
    },

    fetchCustomersByPage: async () => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(`${BASE_API_URL}/page?page=${useCustomerStore.getState().currentPage}&limit=${useCustomerStore.getState().limit}`);
            if (!response.ok) {
                throw new Error("Failed to fetch customers by page");
            }
            const data: Customer[] = await response.json();
            set({ customers: data, customersPage: data, loading: false });

        } catch (error: any) {
            set({ error: error.message || "שגיאה בטעינת הלקוחות בעמוד", loading: false });
        }
    },

    fetchNextPage: async () => {
        set({ currentPage: useCustomerStore.getState().currentPage + 1 });
        try {
            await useCustomerStore.getState().fetchCustomersByPage();
        } catch (error: any) {
            set({ error: error.message || "שגיאה בטעינת העמוד הבא", loading: false });
        }

    },

    fetchPrevPage: async () => {
        set({ currentPage: useCustomerStore.getState().currentPage - 1 });
        try {
            await useCustomerStore.getState().fetchCustomersByPage();
        } catch (error: any) {
            set({ error: error.message || "שגיאה בטעינת העמוד הקודם", loading: false });
        }
    },



    searchCustomersByText: async (searchTerm: string) => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(`${BASE_API_URL}/search?text=${searchTerm}`);
            if (!response.ok) {
                throw new Error("Failed to search customers");
            }
            const data: Customer[] = await response.json();
            set({ customers: data, loading: false });
        } catch (error: any) {
            set({ error: error.message || "שגיאה בחיפוש לקוחות", loading: false });
        }
    },

    searchCustomersInPage: async (searchTerm: string) => {
        set({ loading: true, error: undefined });
        try {

            if (!searchTerm.trim()) {
                // אם ריק, מחזירים לתצוגה רגילה
                await useCustomerStore.getState().fetchCustomersByPage();
                return;
            }

            const lower = searchTerm.toLowerCase();

            const filtered = useCustomerStore.getState().customersPage.filter(
                (c) =>
                    c.name.toLowerCase().includes(lower) ||
                    c.phone.toLowerCase().includes(lower) ||
                    c.email.toLowerCase().includes(lower) ||
                    c.businessName?.toLowerCase().includes(lower) ||
                    c.businessType?.toLowerCase().includes(lower) ||
                    statusLabels[c.status].toLowerCase().includes(lower)
            );
            set({ customers: filtered, loading: false });
        }
        catch (error: any) {
            set({ error: error.message || "שגיאה בחיפוש לקוחות", loading: false });
        }
    },

    fetchCustomerById: async (id: string) => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(`${BASE_API_URL}/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch customer by ID");
            }
            const data: Customer = await response.json();
            set({ selectedCustomer: data, loading: false });
            return data;
        } catch (error: any) {
            set({ error: error.message || "שגיאה בטעינת לקוח לפי מזהה", loading: false });
            return null;
        }
    },

    createCustomer: async (customer: CreateCustomerRequest) => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(`${BASE_API_URL}/post-customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customer),
            });
            if (!response.ok) {
                let errorMsg = "Failed to create customer";
                try {
                    const errorBody = await response.json();
                    errorMsg = errorBody?.error?.details || errorBody?.error?.message || errorBody?.message || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
            await useCustomerStore.getState().fetchCustomersByPage(); // עדכן את הלקוחות
        } catch (error: any) {
            set({ error: error.message || "שגיאה ביצירת לקוח", loading: false });
        } finally {
            set({ loading: false });
        }
    },

    updateCustomer: async (id: string, customer: Partial<Customer>) => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(`${BASE_API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customer),
            });
            if (!response.ok) {
                // ננסה לקרוא את גוף התשובה (אם יש)
                let errorMsg = "Failed to update customer";
                try {
                    const errorBody = await response.json();
                    // נניח שהשרת מחזיר error.details או error.message
                    errorMsg = errorBody?.error?.details || errorBody?.error?.message || errorBody?.message || errorMsg;
                } catch (e) {
                    // אם לא הצלחנו לקרוא json, נשאיר את הודעת ברירת המחדל
                }
                throw new Error(errorMsg);
            }
            await useCustomerStore.getState().fetchCustomersByPage(); // עדכן את הלקוחות
        } catch (error: any) {
            set({ error: error.message || "שגיאה בעדכון לקוח", loading: false });
        } finally {
            set({ loading: false });
        }
    },

    deleteCustomer: async (id: string) => {
        set({ loading: true, error: undefined });
        try {
            const response = await fetch(`${BASE_API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error("Failed to delete customer");
            }
            // await useCustomerStore.getState().fetchCustomers(); // עדכן את הלקוחות
            await useCustomerStore.getState().fetchCustomersByPage(); // עדכן את הלקוחות
        } catch (error: any) {
            set({ error: error.message || "שגיאה במחיקת לקוח", loading: false });
        } finally {
            set({ loading: false });
        }
    },

    resetSelectedCustomer: () => {
        set({ selectedCustomer: null });
    },
}));

const statusLabels: Record<CustomerStatus, string> = {
    ACTIVE: "פעיל",
    NOTICE_GIVEN: "הודעת עזיבה",
    EXITED: "עזב",
    PENDING: "בהמתנה",
};
