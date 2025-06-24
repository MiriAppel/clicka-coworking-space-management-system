import type{ DateISO, FileReference, ID, Payment, PaymentMethodType } from "shared-types";

export class PaymentModel implements Payment{
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
    constructor(
       id: ID,
       customer_id: ID,
       customer_name: string,
       amount: number,
       method: PaymentMethodType,
       date: DateISO,
       createdAt: DateISO,
       updatedAt: DateISO,
       transaction_reference?: string,
       invoice_id?: ID,
       notes?: string,
       receipt_file?: FileReference,
       invoice_number?: string,
    ){
        this.id=id;
        this.customer_id=customer_id;
        this.customer_name=customer_name;
        this.invoice_id=invoice_id;
        this.invoice_number=invoice_number;
        this.amount=amount;
        this.method=method;
        this.transaction_reference=transaction_reference;
        this.date=date;
        this.notes=notes;
        this.receipt_file=receipt_file;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;

    }

}
