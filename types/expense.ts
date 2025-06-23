// expense-types.d.ts

import { ID, DateISO, FileReference, ApiResponse, PaginatedResponse } from './core';

// Expense category enum
export enum ExpenseCategory {
  RENT = 'RENT',
  UTILITIES = 'UTILITIES',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  REFRESHMENTS = 'REFRESHMENTS',
  MARKETING = 'MARKETING',
  SALARIES = 'SALARIES',
  INSURANCE = 'INSURANCE',
  SOFTWARE = 'SOFTWARE',
  PROFESSIONAL_SERVICES = 'PROFESSIONAL_SERVICES',
  TAXES = 'TAXES',
  EVENTS = 'EVENTS',
  FURNITURE = 'FURNITURE',
  EQUIPMENT = 'EQUIPMENT',
  PETTY_CASH = 'PETTY_CASH',
  OTHER = 'OTHER'
}
export enum VendorCategory {
  MAINTENANCE = 'MAINTENANCE',
  UTILITIES = 'UTILITIES',
  OFFICE_SUPPLIES = 'OFFICE_SUPPLIES',
  CLEANING = 'CLEANING',
  PROFESSIONAL_SERVICES = 'PROFESSIONAL_SERVICES',
  TECHNOLOGY = 'TECHNOLOGY',
  OTHER = 'OTHER'
}

// Vendor status enum
export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}


// Expense status enum
export enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  REJECTED = 'REJECTED'
}

// Payment method (for expenses)
export enum ExpensePaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  CASH = 'CASH',
  PETTY_CASH = 'PETTY_CASH',
  OTHER = 'OTHER'
}

// Vendor model
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
 
// Expense model
export interface Expense {
  success: any;
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
export enum PaymentMethod {
  BankTransfer = 'BankTransfer',   
  CreditCard = 'CreditCard',      
  Cash = 'Cash',                  
  Other = 'Other'                 
}
export enum VendorStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended'
}
export enum VendorCategory {
  Equipment = 'Equipment',
  Services = 'Services',
  Maintenance = 'Maintenance',
  Other = 'Other'
}

// Create vendor request
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

// Update vendor request
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

// Get vendors request
export interface GetVendorsRequest {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Create expense request
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

// Update expense request
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

// Get expenses request
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

// Mark expense as paid request
export interface MarkExpenseAsPaidRequest {
  paidDate: DateISO;
  paymentMethod: ExpensePaymentMethod;
  reference?: string;
  notes?: string;
}
export enum PaymentTerms {
  NET_15 = 'Net 15',
  NET_30 = 'Net 30',
  EOM = 'End of Month',
  COD = 'Cash on Delivery'
}