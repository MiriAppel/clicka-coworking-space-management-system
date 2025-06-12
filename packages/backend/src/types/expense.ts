// expense-types.d.ts

import { ID, DateISO, FileReference, ApiResponse, PaginatedResponse } from './core-types';

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
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  taxId?: string;
  notes?: string;
  createdAt: DateISO;
  updatedAt: DateISO;
}

// Expense model
export interface Expense {
  id: ID;
  vendorId: ID;
  vendorName: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  tax?: number;
  date: DateISO;
  dueDate?: DateISO;
  paidDate?: DateISO;
  status: ExpenseStatus;
  paymentMethod?: ExpensePaymentMethod;
  reference?: string;
  invoiceNumber?: string;
  invoiceFile?: FileReference;
  receiptFile?: FileReference;
  notes?: string;
  createdAt: DateISO;
  updatedAt: DateISO;
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