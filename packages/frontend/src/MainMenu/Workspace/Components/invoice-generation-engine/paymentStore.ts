import type{ Payment } from "shared-types";
import { PaymentMethodType } from "shared-types";
import { create } from "zustand";

interface PaymentState {
    payments: Payment[];
    getAllPayments: () => Promise<void>;
    updatePayment: (payment: Payment) => Promise<void>;
    addPayment: (payment: Payment) => Promise<void>;
    deletePayment: (payment: Payment) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
    payments: [
        {
            id: 'p1',
            customer_id: 'c1',
            customer_name: 'לקוח א',
            invoice_id: '1',
            amount: 50,
            method: PaymentMethodType.CASH,
            date: '2024-06-10',
            created_at: '2024-06-10',
            updated_at: '2024-06-10'
        }
    ],
    getAllPayments: async () => {},
    addPayment: async (payment: Payment) => {
        set(state => ({
            payments: [...state.payments, payment]
        }));
    },
    updatePayment: async (payment: Payment) => {
        set(state => ({
            payments: state.payments.map(p => p.id === payment.id ? payment : p)
        }));
    },
    deletePayment: async (payment: Payment) => {
        set(state => ({
            payments: state.payments.filter(p => p.id !== payment.id)
        }));
    }
}));