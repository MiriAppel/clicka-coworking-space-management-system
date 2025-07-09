import type{ DateISO, Expense, ExpenseCategory, ExpensePaymentMethod, ExpenseStatus, FileReference, ID } from "shared-types";

export class ExpenseModel implements Expense {
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
  approved_by?: ID; 
  approvedAt?: DateISO; 
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: ID,
    vendor_id: ID,
    vendor_name: string,
    category: ExpenseCategory,
    description: string,
    amount: number,
    tax: number | undefined,
    date: DateISO,
    due_date: DateISO | undefined,
    paid_date: DateISO | undefined,
    status: ExpenseStatus,
    payment_method: ExpensePaymentMethod | undefined,
    reference: string | undefined,
    invoice_number: string | undefined,
    invoice_file: FileReference | undefined,
    receipt_file: FileReference | undefined,
    notes: string | undefined,
    approved_by: ID | undefined,
    approvedAt: DateISO | undefined,
    createdAt: DateISO,
    updatedAt: DateISO
  ) {
    this.id = id;
    this.vendor_id = vendor_id;
    this.vendor_name = vendor_name;
    this.category = category;
    this.description = description;
    this.amount = amount;
    this.tax = tax;
    this.date = date;
    this.due_date = due_date;
    this.paid_date = paid_date;
    this.status = status;
    this.payment_method = payment_method;
    this.reference = reference;
    this.invoice_number = invoice_number;
    this.invoice_file = invoice_file;
    this.receipt_file = receipt_file;
    this.notes = notes;
    this.approved_by = approved_by;
    this.approvedAt = approvedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.vendorId = vendor_id;
    this.vendorName = vendor_name;
  }
  vendorId: string;
  vendorName: string;
  dueDate?: string | undefined;
  paidDate?: string | undefined;
  paymentMethod?: ExpensePaymentMethod | undefined;
  invoiceNumber?: string | undefined;
  invoiceFile?: FileReference | undefined;
  receiptFile?: FileReference | undefined;
  success: any;
  toDatabaseFormat() {
return {
id: this.id,
vendor_id: this.vendor_id,
vendor_name: this.vendor_name,
category: this.category,
description: this.description,
amount: this.amount,
tax: this.tax,
date: this.date,
due_date: this.due_date,
paid_date: this.paid_date,
status: this.status,
payment_method: this.payment_method,
reference: this.reference,
invoice_number: this.invoice_number,
invoice_file: this.invoice_file,
receipt_file: this.receipt_file,
notes: this.notes,
approved_by: this.approved_by,
approved_at: this.approvedAt,
created_at: this.createdAt,
updated_at: this.updatedAt,
};
}
}