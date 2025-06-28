import { ID, DateISO, FileReference } from './core';
import { WorkspaceType } from './customer';
export declare enum InvoiceStatus {
    DRAFT = "DRAFT",
    ISSUED = "ISSUED",
    PAID = "PAID",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    OVERDUE = "OVERDUE",
    CANCELED = "CANCELED",
    SENT = "SENT"
}
export declare enum PaymentMethodType {
    CREDIT_CARD = "CREDIT_CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    CHECK = "CHECK",
    CASH = "CASH",
    OTHER = "OTHER"
}
export declare enum BillingItemType {
    WORKSPACE = "WORKSPACE",
    MEETING_ROOM = "MEETING_ROOM",
    LOUNGE = "LOUNGE",
    SERVICE = "SERVICE",
    DISCOUNT = "DISCOUNT",
    OTHER = "OTHER"
}
export interface BillingItem {
    id: ID;
    invoice_id: ID;
    type: BillingItemType;
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    tax_rate: number;
    tax_amount: number;
    workspace_type?: WorkspaceType;
    booking_id?: ID;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface Invoice {
    id: ID;
    invoice_number: string;
    customer_id: ID;
    customer_name: string;
    status: InvoiceStatus;
    issue_date: DateISO;
    due_date: DateISO;
    items: BillingItem[];
    subtotal: number;
    taxtotal: number;
    payment_due_reminder?: boolean;
    payment_dueReminder_sentAt?: DateISO;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface Payment {
    id: ID;
    customer_id: ID;
    customer_name: string;
    invoice_id?: ID;
    invoice_number?: string;
    amount: number;
    method: PaymentMethodType;
    transaction_reference?: string;
    date: DateISO;
    notes?: string;
    receipt_file?: FileReference;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface CreateInvoiceRequest {
    customerId: ID;
    issueDate: DateISO;
    dueDate: DateISO;
    items: {
        type: BillingItemType;
        description: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
        workspaceType?: WorkspaceType;
        bookingId?: ID;
    }[];
    notes?: string;
}
export interface UpdateInvoiceRequest {
    status?: InvoiceStatus;
    issueDate?: DateISO;
    dueDate?: DateISO;
    notes?: string;
}
export interface GetInvoicesRequest {
    customerId?: ID;
    status?: InvoiceStatus[];
    issueDateFrom?: DateISO;
    issueDateTo?: DateISO;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}
export interface RecordPaymentRequest {
    customerId: ID;
    invoiceId?: ID;
    amount: number;
    method: PaymentMethodType;
    transactionReference?: string;
    date: DateISO;
    notes?: string;
    receiptFile?: FileReference;
}
export interface UpdatePaymentRequest {
    invoiceId?: ID;
    amount?: number;
    method?: PaymentMethodType;
    transactionReference?: string;
    date?: DateISO;
    notes?: string;
    receiptFile?: FileReference;
}
export interface GetPaymentsRequest {
    customerId?: ID;
    invoiceId?: ID;
    method?: PaymentMethodType[];
    dateFrom?: DateISO;
    dateTo?: DateISO;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}
export interface CalculateBillingRequest {
    customerId: ID;
    billingPeriod: {
        startDate: DateISO;
        endDate: DateISO;
    };
    includeWorkspace?: boolean;
    includeMeetingRooms?: boolean;
    includeOtherServices?: boolean;
}
export interface CalculateBillingResponse {
    customerId: ID;
    customerName: string;
    billingPeriod: {
        startDate: DateISO;
        endDate: DateISO;
    };
    items: {
        type: BillingItemType;
        description: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        taxRate: number;
        taxAmount: number;
        workspaceType?: WorkspaceType;
        bookingId?: ID;
    }[];
    subtotal: number;
    taxTotal: number;
    total: number;
}
export interface GenerateMonthlyInvoicesRequest {
    month: number;
    year: number;
    issueDate: DateISO;
    dueDate: DateISO;
    customerIds?: ID[];
}
export interface GenerateMonthlyInvoicesResponse {
    generatedInvoices: number;
    failedInvoices: Array<{
        customerId: ID;
        customerName: string;
        error: string;
    }>;
    invoices: Invoice[];
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELED = "CANCELED"
}
