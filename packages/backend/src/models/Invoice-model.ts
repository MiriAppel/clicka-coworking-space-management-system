import {BillingItem, BillingItemType, Invoice, InvoiceStatus} from '../../../types/billing'
import { ID , DateISO } from '../../../types/core';
export class InvoiceModel implements Invoice{
    id: ID;
    invoice_number: string;
    customer_id: ID;
    customer_name: string;
    status: InvoiceStatus;
    issue_date: DateISO;
    due_date: DateISO;
    items: BillingItem[];
    subtotal: number;
    taxTotal: number;
    payment_due_reminder?: boolean | undefined;
    payment_dueReminder_sentAt?: any;
    createdAt: DateISO;
    updatedAt: DateISO;

constructor(
    id: ID,
    invoice_number: string,
    customer_id: ID,
    customer_name: string,
    status: InvoiceStatus,
    issue_date: DateISO,
    due_date: DateISO,
    items: BillingItem[],
    subtotal: number,
    taxTotal: number,
    payment_due_reminder?: boolean | undefined,
    payment_dueReminder_sentAt?: any,
    createdAt?: DateISO,
    updatedAt?: DateISO
) {
this.id = id;
this.invoice_number = invoice_number;
this.customer_id = customer_id;
this.customer_name = customer_name; 
this.status = status;
this.issue_date = issue_date;
this.due_date = due_date;
this.items = items;
this.subtotal = subtotal;
this.taxTotal = taxTotal;
this.payment_due_reminder = payment_due_reminder;
this.payment_dueReminder_sentAt = payment_dueReminder_sentAt;
this.createdAt = createdAt ?? new Date().toISOString();
this.updatedAt = updatedAt ?? new Date().toISOString();
}

toDatabaseFormat() {
return {
    id: this.id,
    invoice_number: this.invoice_number,
    customer_id: this.customer_id,
    customer_name: this.customer_name,
    status: this.status,
    issue_date: this.issue_date,
    due_date: this.due_date,
    items: this.items.map(item => (item as InvoiceItemModel).toDatabaseFormat()),
    subtotal: this.subtotal,
    taxTotal: this.taxTotal,
    payment_due_reminder: this.payment_due_reminder,
    payment_dueReminder_sentAt: this.payment_dueReminder_sentAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt

}
}
}
export class InvoiceItemModel implements BillingItem{
    id: ID;
    invoice_id: ID;
    type: BillingItemType;
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    tax_rate: number;
    tax_amount: number;
    workspace_type?: any;
    booking_id?: any;
    createdAt: DateISO;
    updatedAt: DateISO;
    
    constructor(
        id: ID,
        invoice_id: ID,
        type: BillingItemType,  
        description: string,
        quantity: number,
        unit_price: number,
        total_price: number,
        tax_rate: number,
        tax_amount: number,
        workspace_type?: any,
        booking_id?: any,
        createdAt?: DateISO,
        updatedAt?: DateISO
    ) { 
       this.id = id;
        this.invoice_id = invoice_id;
        this.type = type;
        this.description = description;
        this.quantity = quantity;
        this.unit_price = unit_price;
        this.total_price = total_price;
        this.tax_rate = tax_rate;
        this.tax_amount = tax_amount;
        this.workspace_type = workspace_type;
        this.booking_id = booking_id;
        this.createdAt = createdAt ?? new Date().toISOString();
        this.updatedAt = updatedAt ?? new Date().toISOString();

    
}


    

toDatabaseFormat() {
return {
    id: this.id,
    invoice_id: this.invoice_id,
    type: this.type,
    description: this.description,
    quantity: this.quantity,
    unit_price: this.unit_price,
    total_price: this.total_price,
    tax_rate: this.tax_rate,
    tax_amount: this.tax_amount,
    workspace_type: this.workspace_type,
    booking_id: this.booking_id,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt

};
}
}

