import { ID, DateISO } from "./core";

export interface Invoice {
  id: ID;
  number: string;
  customerId: ID;
  issueDate: DateISO;
  dueDate: DateISO;
  totalAmount: number;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
  items: InvoiceItem[];
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}