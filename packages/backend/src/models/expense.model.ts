// models/Expense.ts
import { v4 as uuidv4 } from "uuid";
import type {
  DateISO,
  ID,
  FileReference,
  ExpenseCategory,
  ExpensePaymentMethod,
  ExpenseStatus,
} from "shared-types";

export class ExpenseModel {
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
  approvedBy?: ID;
  approvedAt?: DateISO;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(params: {
    id?: ID;
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
    approved_at?: DateISO;
    created_at: DateISO;
    updated_at: DateISO;
  }) {
    this.id = params.id ?? uuidv4();
    this.vendorId = params.vendor_id;
    this.vendorName = params.vendor_name;
    this.category = params.category;
    this.description = params.description;
    this.amount = params.amount;
    this.tax = params.tax;
    this.date = params.date;
    this.dueDate = params.due_date;
    this.paidDate = params.paid_date;
    this.status = params.status;
    this.paymentMethod = params.payment_method;
    this.reference = params.reference;
    this.invoiceNumber = params.invoice_number;
    this.invoiceFile = params.invoice_file;
    this.receiptFile = params.receipt_file;
    this.notes = params.notes;
    this.approvedBy = params.approved_by;
    this.approvedAt = params.approved_at;
    this.createdAt = params.created_at;
    this.updatedAt = params.updated_at;
  }

  toDatabaseFormat() {
    return {
      vendor_id: this.vendorId,
      vendor_name: this.vendorName,
      category: this.category,
      description: this.description,
      amount: this.amount,
      tax: this.tax,
      date: this.date,
      due_date: this.dueDate,
      paid_date: this.paidDate,
      status: this.status,
      payment_method: this.paymentMethod,
      reference: this.reference,
      invoice_number: this.invoiceNumber,
      invoice_file: this.invoiceFile,
      receipt_file: this.receiptFile,
      notes: this.notes,
      approved_by: this.approvedBy,
      approved_at: this.approvedAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  static fromDatabaseFormat(db: any): ExpenseModel {
    return new ExpenseModel({
      id: db.id,
      vendor_id: db.vendor_id,
      vendor_name: db.vendor_name,
      category: db.category,
      description: db.description,
      amount: db.amount,
      tax: db.tax,
      date: db.date,
      due_date: db.due_date,
      paid_date: db.paid_date,
      status: db.status,
      payment_method: db.payment_method,
      reference: db.reference,
      invoice_number: db.invoice_number,
      invoice_file: db.invoice_file,
      receipt_file: db.receipt_file,
      notes: db.notes,
      approved_by: db.approved_by,
      approved_at: db.approved_at,
      created_at: db.created_at,
      updated_at: db.updated_at,
    });
  }
}
