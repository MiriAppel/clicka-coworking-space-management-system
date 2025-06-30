import { ID, DateISO, FileReference } from './core';
export declare enum ExpenseCategory {
    RENT = "RENT",
    UTILITIES = "UTILITIES",
    CLEANING = "CLEANING",
    MAINTENANCE = "MAINTENANCE",
    OFFICE_SUPPLIES = "OFFICE_SUPPLIES",
    REFRESHMENTS = "REFRESHMENTS",
    MARKETING = "MARKETING",
    SALARIES = "SALARIES",
    INSURANCE = "INSURANCE",
    SOFTWARE = "SOFTWARE",
    PROFESSIONAL_SERVICES = "PROFESSIONAL_SERVICES",
    TAXES = "TAXES",
    EVENTS = "EVENTS",
    FURNITURE = "FURNITURE",
    EQUIPMENT = "EQUIPMENT",
    PETTY_CASH = "PETTY_CASH",
    OTHER = "OTHER"
}
export declare enum ExpenseStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    PAID = "PAID",
    REJECTED = "REJECTED"
}
export declare enum ExpensePaymentMethod {
    CREDIT_CARD = "CREDIT_CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    CHECK = "CHECK",
    CASH = "CASH",
    PETTY_CASH = "PETTY_CASH",
    OTHER = "OTHER"
}
export interface Vendor {
    id: ID;
    name: string;
    contact_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    tax_id?: string;
    payment_terms?: string;
    preferred_payment_method?: PaymentMethod;
    category?: VendorCategory;
    status?: VendorStatus;
    notes?: string;
    documents?: FileReference[];
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface Expense {
    id: ID;
    vendor_id: ID;
    vendor_name: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    tax?: number;
    date: DateISO;
    due_date?: DateISO;
    paid_date?: DateISO;
    status: ExpenseStatus;
    payment_method?: ExpensePaymentMethod;
    reference?: string;
    invoice_number?: string;
    invoice_file?: FileReference;
    receipt_file?: FileReference;
    notes?: string;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export declare enum PaymentMethod {
    BankTransfer = "BankTransfer",
    CreditCard = "CreditCard",
    Cash = "Cash",
    Other = "Other"
}
export declare enum VendorStatus {
    Active = "Active",
    Inactive = "Inactive",
    Suspended = "Suspended"
}
export declare enum VendorCategory {
    Equipment = "Equipment",
    Services = "Services",
    Maintenance = "Maintenance",
    Other = "Other"
}
export interface CreateVendorRequest {
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    taxId?: string;
    notes?: string;
}
export interface UpdateVendorRequest {
    name?: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    taxId?: string;
    notes?: string;
}
export interface GetVendorsRequest {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}
export interface CreateExpenseRequest {
    vendorId: ID;
    category: ExpenseCategory;
    description: string;
    amount: number;
    tax?: number;
    date: DateISO;
    dueDate?: DateISO;
    status: ExpenseStatus;
    invoiceNumber?: string;
    invoiceFile?: FileReference;
    receiptFile?: FileReference;
    notes?: string;
}
export interface UpdateExpenseRequest {
    vendorId?: ID;
    category?: ExpenseCategory;
    description?: string;
    amount?: number;
    tax?: number;
    date?: DateISO;
    dueDate?: DateISO;
    status?: ExpenseStatus;
    invoiceNumber?: string;
    invoiceFile?: FileReference;
    receiptFile?: FileReference;
    notes?: string;
}
export interface GetExpensesRequest {
    vendorId?: ID;
    category?: ExpenseCategory[];
    status?: ExpenseStatus[];
    dateFrom?: DateISO;
    dateTo?: DateISO;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}
export interface MarkExpenseAsPaidRequest {
    paidDate: DateISO;
    paymentMethod: ExpensePaymentMethod;
    reference?: string;
    notes?: string;
}
export declare enum PaymentTerms {
    NET_15 = "Net 15",
    NET_30 = "Net 30",
    EOM = "End of Month",
    COD = "Cash on Delivery"
}
