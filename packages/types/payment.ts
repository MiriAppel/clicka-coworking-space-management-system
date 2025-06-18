import { ID, DateISO } from "./core";

export interface Payment {
  id: ID;
  invoiceId: ID;
  amount: number;
  paymentDate: DateISO;
  method: "CASH" | "CREDIT_CARD" | "BANK_TRANSFER" | "CHECK" | "OTHER";
  reference?: string;
  notes?: string;
}