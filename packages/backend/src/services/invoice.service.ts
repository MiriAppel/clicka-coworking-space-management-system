import { BillingItem, ID } from "shared-types";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { InvoiceItemModel, InvoiceModel } from "../models/invoice.model";

import { UUID } from "crypto";
// טוען את משתני הסביבה מקובץ .env

// const supabaseUrl = process.env.SUPABASE_URL || 'https://htpiqwpvvydffoapkmzk.supabase.co'; // החלף עם ה-URL של פרויקט ה-Supabase שלך
// const supabaseAnonKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJp'; // החלף עם ה-Anon Key שלך
// const supabase = createClient(supabaseUrl, supabaseAnonKey);
//////////////////
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

////////////////
//crud functions
// יצירת חשבונית חדשה 

// export async function serviceCreateInvoice(data: Partial<InvoiceModel>): Promise<InvoiceModel> {
//     const { data: invoiceData, error } = await supabase
//         .from('invoice')
//         .insert([{
//             invoice_number: data.invoice_number || '',
//             customer_id: data.customer_id || '',
//             customer_name: data.customer_name || '',
//             status: data.status || 'DRAFT',
//             issue_date: data.issue_date || new Date().toISOString(),
//             due_date: data.due_date || new Date().toISOString(),
//             items: data.items || [],
//             subtotal: data.subtotal || 0,
//             tax_total: data.tax_total || 0,
//             payment_due_reminder: data.payment_due_reminder,
//             payment_dueReminder_sentAt: data.payment_dueReminder_sentAt,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//         }])
//         .select()
//         .single();

//     if(error) {
//         throw new Error(error.message);
//     }

//     return invoiceData as InvoiceModel;
// }

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

// קבלת כל החשבוניות עם JOIN
// export async function serviceGetAllInvoices(): Promise<InvoiceModel[]> {
//     console.log('🔍 בודק את מבנה הטבלאות...');
//     console.log('=== SERVICE START ===');
//     const { data, error } = await supabase
//         .from('invoice')
//         .select(`
//             *,
//             invoice_item (*)
//         `)
//         .order('created_at', { ascending: false });

//     console.log('=== DATA ===', data);
//     console.log('=== ERROR ===', error);

//     if (error) {
//         console.error('❌ שגיאה בשליפת חשבוניות:', error);
//         throw new Error(error.message);
//     }

//     if (!data || data.length === 0) {
//         console.log('📭 לא נמצאו חשבוניות');
//         return [];
//     }

//     // המרה לפורמט הנכון
//     const invoicesWithItems = data.map(invoice => {
//         console.log('🔄 מעבד חשבונית:', invoice.invoice_number);
//         console.log('📋 פריטים גולמיים:', invoice.invoice_item);

//         return {
//             ...invoice,
//             items: Array.isArray(invoice.invoice_item) ? invoice.invoice_item : []
//         };
//     }) as InvoiceModel[];

//     console.log('=== FINAL RESULT ===');
//     console.log('📊 מספר חשבוניות:', invoicesWithItems.length);
//     if (invoicesWithItems.length > 0) {
//         console.log('🧾 חשבונית ראשונה:', JSON.stringify(invoicesWithItems[0], null, 2));
//     }

//     return invoicesWithItems;
// }

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
    .eq('invoice_number', id) // השתמש ב-invoice_number במקום id
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
