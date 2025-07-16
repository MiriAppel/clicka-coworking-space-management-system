import type {
  DateISO,
  FileReference,
  ID,
  Payment,
  PaymentMethodType,
} from "shared-types";

// מודל תשלום
export class PaymentModel implements Payment {
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

  constructor(params: {
    id?: ID;  // אופציונלי לפי ההנחיות לגבי UUID שנוצר אוטומטית
    customer_id: ID;
    customer_name: string;
    amount: number;
    method: PaymentMethodType;
    date: DateISO;
    createdAt: DateISO;
    updatedAt: DateISO;
    transaction_reference?: string;
    invoice_id?: ID;
    notes?: string;
    receipt_file?: FileReference;
    invoice_number?: string;
  }) {
    if (!params.id) {
      throw new Error("ID is required for PaymentModel instance.");
    }
    this.id = params.id;
    this.customer_id = params.customer_id;
    this.customer_name = params.customer_name;
    this.invoice_id = params.invoice_id;
    this.invoice_number = params.invoice_number;
    this.amount = params.amount;
    this.method = params.method;
    this.transaction_reference = params.transaction_reference;
    this.date = params.date;
    this.notes = params.notes;
    this.receipt_file = params.receipt_file;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}

// המרת מודל למסד (לשמות עם קו תחתי)
export function toDatabaseFormat(payment: PaymentModel): any {
  return {
    customer_id: payment.customer_id,
    customer_name: payment.customer_name,
    invoice_id: payment.invoice_id,
    invoice_number: payment.invoice_number,
    amount: payment.amount,
    method: payment.method,
    transaction_reference: payment.transaction_reference,
    date: payment.date,
    notes: payment.notes,
    receipt_file: payment.receipt_file,
    created_at: payment.createdAt,
    updated_at: payment.updatedAt,
  };
  
}


