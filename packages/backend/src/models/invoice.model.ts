
import type{ BillingItem, BillingItemType, DateISO, ID, Invoice } from 'shared-types';
import { InvoiceStatus } from 'shared-types';
import { generateId, invoicesMockDb } from './invoice.mock-db';
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
    tax_total: number;
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
    tax_total: number,
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
this.tax_total = tax_total;
this.payment_due_reminder = payment_due_reminder;
this.payment_dueReminder_sentAt = payment_dueReminder_sentAt;
this.createdAt = createdAt ?? new Date().toISOString();
this.updatedAt = updatedAt ?? new Date().toISOString();
this.taxtotal = 0;
}
    taxtotal: number;

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
    tax_total: this.tax_total,
    payment_due_reminder: this.payment_due_reminder,
    payment_dueReminder_sentAt: this.payment_dueReminder_sentAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt

        }
    }
}
export class InvoiceItemModel implements BillingItem {
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
//crud functions

// יצירת חשבונית חדשה
export async function createInvoice(invoiceData: Partial<InvoiceModel>): Promise<InvoiceModel> {
    const id = generateId();
    const invoice = new InvoiceModel(
        id,
        invoiceData.invoice_number ?? "",
        invoiceData.customer_id ?? "",
        invoiceData.customer_name ?? "",
        invoiceData.status ?? InvoiceStatus.DRAFT,
        invoiceData.issue_date ?? new Date().toISOString(),
        invoiceData.due_date ?? new Date().toISOString(),
        invoiceData.items ?? [],
        invoiceData.subtotal ?? 0,
        invoiceData.tax_total ?? 0,
        invoiceData.payment_due_reminder,
        invoiceData.payment_dueReminder_sentAt,
        invoiceData.createdAt,
        invoiceData.updatedAt
    );
    invoicesMockDb.push(invoice);
    return invoice;
}

// שליפת חשבונית לפי מזהה
export async function getInvoiceById(id: ID): Promise<InvoiceModel | null> {
    const invoice = invoicesMockDb.find(inv => inv.id === id);
    return invoice || null;
}


// שליפת כל החשבוניות
export async function getAllInvoices(): Promise<InvoiceModel[]> {
    return invoicesMockDb;
}

// עדכון חשבונית
export async function updateInvoice(id: ID, updateData: Partial<InvoiceModel>): Promise<InvoiceModel | null> {
    const index = invoicesMockDb.findIndex(inv => inv.id === id);
    if (index === -1) {
        return null;
    }
    invoicesMockDb[index] = {
        ...invoicesMockDb[index],
        ...updateData,
        toDatabaseFormat: invoicesMockDb[index].toDatabaseFormat // שומר את הפונקציה המקורית
    };
    return invoicesMockDb[index];
}

// מחיקת חשבונית
export async function deleteInvoice(id: ID): Promise<boolean> {
    const index = invoicesMockDb.findIndex(inv => inv.id === id);
    if (index === -1) {
        return false;
    }
    invoicesMockDb.splice(index, 1);
    return true;
}

