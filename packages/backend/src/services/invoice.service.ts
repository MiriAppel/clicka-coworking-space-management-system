import { BillingItem, ID } from "shared-types";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { InvoiceItemModel, InvoiceModel } from "../models/invoice.model";

import { UUID } from "crypto";
// טוען את משתני הסביבה מקובץ .env


dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

////////////////
//crud functions
// יצירת חשבונית חדשה 



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
  const { data: invoices, error } = await supabase.from('invoice_item').select('*').eq('invoice_id', invoice_id);
  if (error)
    throw new Error(error.message);
  const invoicesArray = invoices as InvoiceItemModel[];
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
export async function serviceUpdateInvoice(id: ID, updateData: Partial<InvoiceModel & { items?: any[] }>): Promise<any> {
  const dataToUpdate: any = {
    updated_at: new Date().toISOString()
  };

  // עדכון חשבונית
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

  const { data, error } = await supabase
    .from('invoice')
    .update(dataToUpdate)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) return null;

  // ✅ הוספת עדכון פרטי חיוב (invoice_item)
  if (updateData.items && Array.isArray(updateData.items)) {
    for (const item of updateData.items) {
      if (!item.id) continue;

      const itemUpdate: any = {};
      if (item.type !== undefined) itemUpdate.type = item.type;
      if (item.description !== undefined) itemUpdate.description = item.description;
      if (item.quantity !== undefined) itemUpdate.quantity = item.quantity;
      if (item.unit_price !== undefined) itemUpdate.unit_price = item.unit_price;

      if (Object.keys(itemUpdate).length > 0) {
        const { error: itemError } = await supabase
          .from('invoice_item')
          .update(itemUpdate)
          .eq('id', item.id);

        if (itemError) {
          throw new Error(`שגיאה בעדכון שורת חיוב ${item.id}: ${itemError.message}`);
        }
      }
    }
  }

  // שליפת פרטי חיוב ידנית
  const { data: items, error: itemsError } = await supabase
    .from('invoice_item')
    .select('id, type, description, quantity, unit_price')
    .eq('invoice_id', id);

  if (itemsError) throw new Error(`שגיאה בשליפת פרטי חיוב: ${itemsError.message}`);

  return {
    ...data[0],
    items
  };
}




// export async function serviceUpdateInvoice(id: ID, updateData: Partial<InvoiceModel>): Promise<InvoiceModel | null> {
//   // הכן את הנתונים לעדכון - רק שדות שקיימים
//   const dataToUpdate: any = {
//     updated_at: new Date().toISOString()
//   };
//   // הוסף רק שדות שקיימים ב-updateData
//   if (updateData.invoice_number !== undefined) dataToUpdate.invoice_number = updateData.invoice_number;
//   if (updateData.customer_id !== undefined) dataToUpdate.customer_id = updateData.customer_id;
//   if (updateData.customer_name !== undefined) dataToUpdate.customer_name = updateData.customer_name;
//   if (updateData.status !== undefined) dataToUpdate.status = updateData.status;
//   if (updateData.issue_date !== undefined) dataToUpdate.issue_date = updateData.issue_date;
//   if (updateData.due_date !== undefined) dataToUpdate.due_date = updateData.due_date;
//   if (updateData.subtotal !== undefined) dataToUpdate.subtotal = updateData.subtotal;
//   if (updateData.tax_total !== undefined) dataToUpdate.tax_total = updateData.tax_total;
//   if (updateData.payment_due_reminder !== undefined) dataToUpdate.payment_due_reminder = updateData.payment_due_reminder;
//   if (updateData.payment_dueReminder_sentAt !== undefined) dataToUpdate.payment_due_reminder_sent_at = updateData.payment_dueReminder_sentAt;
//   const { data, error } = await supabase
//   .from('invoice')
//   .update(dataToUpdate)
//   .eq('id', id)
//   .select(); // בלי .single()
// if (error) {
//   throw new Error(error.message);
// }
// if (!data || data.length === 0) {
//   return null; // לא נמצאה חשבונית
// }
// return data[0] as InvoiceModel;
// }

// מחיקת חשבונית
export async function serviceDeleteInvoice(id: ID): Promise<boolean> {
  const { error } = await supabase.from('invoice').delete().eq('id', id);
  if (error)
    throw new Error(error.message);
  return true;

  //return deleteInvoice(id);
}
