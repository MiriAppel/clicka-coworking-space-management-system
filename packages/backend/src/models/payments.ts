import {Payment, PaymentMethodType} from '../types/billing'
import { ID , DateISO, FileReference } from '../types/core';

export class PaymentModel implements Payment{
     id: ID;
     customerId: ID;
     customerName: string;
     invoiceId?: ID;
     invoiceNumber?: string;
     amount: number;
     method: PaymentMethodType;
     transactionReference?: string;
     date: DateISO;
     notes?: string;
     receiptFile?: FileReference;
     createdAt: DateISO;
     updatedAt: DateISO;
    constructor(
       id: ID,
       customerId: ID,
       customerName: string,
       amount: number,
       method: PaymentMethodType,
       date: DateISO,
       createdAt: DateISO,
       updatedAt: DateISO,
       transactionReference?: string,
       invoiceId?: ID,
       notes?: string,
       receiptFile?: FileReference,
       invoiceNumber?: string,
    ){
        this.id=id;
        this.customerId=customerId;
        this.customerName=customerName;
        this.invoiceId=invoiceId;
        this.invoiceNumber=invoiceNumber;
        this.amount=amount;
        this.method=method;
        this.transactionReference=transactionReference;
        this.date=date;
        this.notes=notes;
        this.receiptFile=receiptFile;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;

    }

}