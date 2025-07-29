import {  ID } from "shared-types";
import dotenv from 'dotenv';
import { InvoiceItemModel, InvoiceModel } from "../models/invoice.model";

import { UUID } from "crypto";
import { supabase } from "../db/supabaseClient";
import { EmailTemplateService } from "./emailTemplate.service";
import { sendEmail } from "./gmail-service";
// טוען את משתני הסביבה מקובץ .env

dotenv.config();

export async function serviceCreateInvoice(data: Partial<InvoiceModel>): Promise<InvoiceModel> {
    const { data: invoiceData, error } = await supabase
        .from('invoice')
        .insert([{
            invoice_number: data.invoice_number || '',
            customer_id: data.customer_id || '',
            customer_name: data.customer_name || '',
            status: data.status || 'DRAFT',
            issue_date: data.issue_date || new Date().toISOString(),
            due_date: data.due_date || new Date().toISOString(),
            subtotal: data.subtotal || 0,
            tax_total: data.tax_total || 0,
            payment_due_reminder: data.payment_due_reminder,
            payment_due_reminder_sent_at: data.payment_dueReminder_sentAt, // ← השתמש בשם מה-Model
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return invoiceData as InvoiceModel;
}

//פונקציה ליצירת פריט חשבונית
export async function serviceCreateInvoiceItem(data: Partial<InvoiceItemModel>): Promise<InvoiceItemModel> {
    console.log('🔍 מתחילים ליצור פריט חשבונית עם הנתונים:', data);

    // הכנת הנתונים להוספה
    const itemData = {
        invoice_id: data.invoice_id || '',
        type: data.type || '', // ברירת מחדל
        description: data.description || '',
        quantity: data.quantity || 0,
        unit_price: data.unit_price || 0,
        total_price: data.total_price || 0,
        tax_rate: data.tax_rate || 0,
        tax_amount: data.tax_amount || 0,
        workspace_type: data.workspace_type,
        booking_id: data.booking_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    console.log('📦 נתוני הפריט המוכנים להוספה:', itemData);

    const { data: invoiceItemData, error } = await supabase
        .from('invoice_item')
        .insert([itemData])
        .select()
        .single();

    if (error) {
        console.error('❌ שגיאה בהוספת פריט חשבונית:', error);
        throw new Error(error.message);
    }

    console.log('✅ פריט החשבונית נוצר בהצלחה:', invoiceItemData);
    return invoiceItemData as InvoiceItemModel;
}


// קבלת כל החשבוניות
export async function serviceGetAllInvoices(): Promise<InvoiceModel[]> {
    const { data: invoices, error } = await supabase.from('invoice').select('*');
    if (error)
        throw new Error(error.message);
    const invoicesArray = invoices as InvoiceModel[];
    return invoicesArray;
    // return getAllInvoices();
}

export async function serviceGetAllInvoiceItems(invoice_id: UUID): Promise<InvoiceItemModel[]> {
    console.log('serviceGetAllInvoiceItems');
    const { data: invoices, error } = await supabase.from('invoice_item').select('*').eq('invoice_id', invoice_id);
    console.log("invoices ++++", invoices);

    if (error)
        throw new Error(error.message + "jjjjj");
    const invoicesArray = invoices as InvoiceItemModel[];
    console.log("vvvv");
    return invoicesArray;

}

export async function serviceGetInvoiceById(id: ID): Promise<InvoiceModel | null> {
    const { data: invoice, error } = await supabase
        .from('invoice')
        .select(`
            *,
            invoice_item (*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // No rows found
            return null;
        }
        throw new Error(error.message);
    }

    // המרה לפורמט הרצוי
    const invoiceWithItems = {
        ...invoice,
        items: invoice.invoice_item || []
    } as InvoiceModel;

    return invoiceWithItems;
}

// עדכון חשבונית
export async function serviceUpdateInvoice(id: ID, updateData: Partial<InvoiceModel>): Promise<InvoiceModel | null> {
    // הכן את הנתונים לעדכון - רק שדות שקיימים
    const dataToUpdate: any = {
        updated_at: new Date().toISOString()
    };
    const existingInvoice = await serviceGetInvoiceById(id);
    if (!existingInvoice) {
        throw new Error(`Invoice with ID ${id} does not exist.`);
    }
    // הוסף רק שדות שקיימים ב-updateData
    if (updateData.invoice_number !== undefined) dataToUpdate.invoice_number = updateData.invoice_number;
    if (updateData.customer_id !== undefined) dataToUpdate.customer_id = updateData.customer_id;
    if (updateData.customer_name !== undefined) dataToUpdate.customer_name = updateData.customer_name;
    if (updateData.status !== undefined) dataToUpdate.status = updateData.status;
    if (updateData.issue_date !== undefined) dataToUpdate.issue_date = updateData.issue_date;
    if (updateData.due_date !== undefined) dataToUpdate.due_date = updateData.due_date;
    if (updateData.subtotal !== undefined) dataToUpdate.subtotal = updateData.subtotal;
    if (updateData.tax_total !== undefined) dataToUpdate.tax_total = updateData.tax_total;
    if (updateData.payment_due_reminder !== undefined) dataToUpdate.payment_due_reminder = updateData.payment_due_reminder;
    if (updateData.payment_dueReminder_sentAt !== undefined) dataToUpdate.payment_due_reminder_sent_at = updateData.payment_dueReminder_sentAt;

    const { data: invoice, error } = await supabase
        .from('invoice')
        .update(dataToUpdate)
        .eq('id', id) // השתמש ב-invoice_number במקום id
        .select()
        .single();

    if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
    }

    return invoice as InvoiceModel;
}

// מחיקת חשבונית
export async function serviceDeleteInvoice(id: ID): Promise<boolean> {
    const { error } = await supabase.from('invoice').delete().eq('id', id);
    if (error)
        throw new Error(error.message);
    return true;

    //return deleteInvoice(id);
}


//שליחת מייל
const emailService = new EmailTemplateService();

export const sendStatusChangeEmails = async (
    customerName: string, amount: number, invoiceNumber: string,
    token: any,
): Promise<void> => {

    const emailPromises: Promise<any>[] = [];
    function encodeSubject(subject: string): string {
        return `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
    }
    // פונקציה לשליחת מייל ללקוח
    const sendCustomerEmail = async () => {
        try {
            const template = await emailService.getTemplateByName(
                "אישור תשלום",
            );
            if (!template) {
                console.warn("Team email template not found");
                return;
            }
            const renderedHtml = await emailService.renderTemplate(
                template.bodyHtml,
                {
                    "customerName": customerName,
                    "amount": amount.toString(),
                    "invoiceNumber": invoiceNumber,
                },
            );
            const response = await sendEmail(
                "me",
                {
                    to: ["ettylax@gmail.com"],
                    subject: encodeSubject(template.subject),
                    body: renderedHtml,
                    isHtml: true,
                },
                token,
            );
            console.log(template.subject);
            console.log("HTML before sending:\n", renderedHtml);

            console.log("Team email sent successfully:", response);
        } catch (err) {
            console.error("שגיאה בשליחת מייל לצוות:", err);
        }
    };

    //אם פרומיס אחד נכשל זה לא מפעיל את השליחה
    emailPromises.push(
        sendCustomerEmail().catch((err) => {
            console.error("שגיאה בשליחת מייל ללקוח", err);
        }),
    );
    await Promise.all(emailPromises);
};





