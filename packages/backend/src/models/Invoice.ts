import {BillingItem, BillingItemType, Invoice, InvoiceStatus} from '../types/billing'
import { ID , DateISO } from '../types/core';
export class InvoiceModel implements Invoice{
    id: ID;
    invoiceNumber: string;
    customerId: ID;
    customerName: string;
    status: InvoiceStatus;
    issueDate: DateISO;
    dueDate: DateISO;
    items: InvoiceItemModel[];
    subtotal: number;
    tax_amount: number;
    tax_rate: number;
    total: number;
    amountPaid: number;
    paid_date: DateISO;
    balance: number;
    notes?: string | undefined;
    pdfFile?: any;
    billingPeriodStart: DateISO;
    billingPeriodEnd: DateISO;
    templateId: ID;
    createdAt: DateISO;
    updatedAt: DateISO;
    constructor(
        id: ID,
        invoiceNumber: string,
        customerId: ID,
        customerName: string,
        status: InvoiceStatus,
        issueDate: DateISO,
        dueDate: DateISO,
        items: InvoiceItemModel[],
        subtotal: number,
        tax_amount: number,
        tax_rate: number,
        total: number,
        amountPaid: number,
        paid_date: DateISO,
        balance: number,
        notes?: string,
        pdfFile?: any,
        billingPeriodStart?: DateISO,
        billingPeriodEnd?: DateISO,
        templateId?: ID
    ) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.customerId = customerId;
        this.customerName = customerName;
        this.status = status;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.items = items;
        this.subtotal = subtotal;
        this.tax_amount = tax_amount;
        this.tax_rate = tax_rate;
        this.total = total;
        this.amountPaid = amountPaid;
        this.paid_date = paid_date;
        this.balance = balance;
        this.notes = notes;
        this.pdfFile = pdfFile;
        this.billingPeriodStart = billingPeriodStart || issueDate; 
        this.billingPeriodEnd = billingPeriodEnd || dueDate;
        this.templateId = templateId || ''; 
        this.createdAt = new Date().toISOString() as DateISO; 
        this.updatedAt = new Date().toISOString() as DateISO;   
    }
    
toDatabaseFormat() {
return {
id: this.id,
invoiceNumber: this.invoiceNumber,
customerId: this.customerId,
customerName: this.customerName,
status: this.status,
issueDate: this.issueDate,
dueDate: this.dueDate,
billingPeriodStart: this.billingPeriodStart,
billingPeriodEnd: this.billingPeriodEnd,
subtotal: this.subtotal,
items: this.items.map(item => item.toDatabaseFormat()),
tax_amount: this.tax_amount,
tax_rate: this.tax_rate,
total: this.total,
paid_amount: this.amountPaid,
paid_date: this.paid_date,
balance: this.balance,
notes: this.notes,
document_file: this.pdfFile,
template_id: this.templateId,
created_at: this.createdAt,
updated_at: this.updatedAt
};
}
}
export class InvoiceItemModel implements BillingItem{
    id: ID;
    invoiceId: ID;
    type: BillingItemType;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    workspaceType?: any;
    bookingId?: any;
    period_start: DateISO;
    period_end: DateISO;
    constructor(
        id: ID,
        invoiceId: ID,
        type: BillingItemType,
        description: string,
        quantity: number,
        unitPrice: number,
        totalPrice: number,
        period_start: DateISO,
        period_end: DateISO,
        workspaceType?: any,
        bookingId?: any
    ) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.type = type;
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
        this.period_start = period_start;
        this.period_end = period_end;
        this.workspaceType = workspaceType;
        this.bookingId = bookingId;
    }
toDatabaseFormat() {
return {
id: this.id,
invoiceId: this.invoiceId,
type: this.type,
description: this.description,
quantity: this.quantity,
unitPrice: this.unitPrice,
totalPrice: this.totalPrice,
period_start: this.period_start,
period_end: this.period_end,
workspaceType: this.workspaceType,
bookingId: this.bookingId,
};
}
}

