import { Expense, ExpenseCategory, ExpenseStatus, ExpensePaymentMethod } from '../types/expense';
import { ID, DateISO, FileReference } from '../types/core';

export class ExpenseModel implements Expense {
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

  constructor(
    id: ID,
    vendorId: ID,
    vendorName: string,
    category: ExpenseCategory,
    description: string,
    amount: number,
    tax: number | undefined,
    date: DateISO,
    dueDate: DateISO | undefined,
    paidDate: DateISO | undefined,
    status: ExpenseStatus,
    paymentMethod: ExpensePaymentMethod | undefined,
    reference: string | undefined,
    invoiceNumber: string | undefined,
    invoiceFile: FileReference | undefined,
    receiptFile: FileReference | undefined,
    notes: string | undefined,
    approvedBy: ID | undefined,
    approvedAt: DateISO | undefined,
    createdAt: DateISO,
    updatedAt: DateISO
  ) {
    this.id = id;
    this.vendorId = vendorId;
    this.vendorName = vendorName;
    this.category = category;
    this.description = description;
    this.amount = amount;
    this.tax = tax;
    this.date = date;
    this.dueDate = dueDate;
    this.paidDate = paidDate;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.reference = reference;
    this.invoiceNumber = invoiceNumber;
    this.invoiceFile = invoiceFile;
    this.receiptFile = receiptFile;
    this.notes = notes;
    this.approvedBy = approvedBy;
    this.approvedAt = approvedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  toDatabaseFormat() {
return {
id: this.id,
vendorId: this.vendorId,
vendorName: this.vendorName,
category: this.category,
description: this.description,
amount: this.amount,
tax: this.tax,
date: this.date,
dueDate: this.dueDate,
paidDate: this.paidDate,
status: this.status,
paymentMethod: this.paymentMethod,
reference: this.reference,
invoiceNumber: this.invoiceNumber,
invoiceFile: this.invoiceFile,
receiptFile: this.receiptFile,
notes: this.notes,
approvedBy: this.approvedBy,
approvedAt: this.approvedAt,
createdAt: this.createdAt,
updatedAt: this.updatedAt,
};
}
}