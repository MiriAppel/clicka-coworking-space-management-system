import type { CreateInvoiceRequest, ID, Invoice } from "shared-types";
import { deleteInvoice, getAllInvoices, createInvoice, getInvoiceById, InvoiceModel, updateInvoice } from "../models/invoice.model";
import { supabase } from "../db/supabaseClient";

export async function serviceGetAllInvoices(): Promise<InvoiceModel[]> {
    const { data: invoices, error } = await supabase.from('invoice').select('*');
    if (error)
        throw new Error(error.message);
    const invoicesArray = invoices as InvoiceModel[];
    return invoicesArray;
}
//crud functions
// יצירת חשבונית חדשה 
export async function serviceCreateInvoice(data: Partial<InvoiceModel>): Promise<InvoiceModel> {
  return createInvoice(data);
}

// קבלת חשבונית לפי מזהה
export async function serviceGetInvoiceById(id: ID): Promise<InvoiceModel | null> {
  return getInvoiceById(id);
}

// עדכון חשבונית
export async function serviceUpdateInvoice(id: ID, updateData: Partial<InvoiceModel>): Promise<InvoiceModel | null> {
  return updateInvoice(id, updateData);
}

// מחיקת חשבונית
export async function serviceDeleteInvoice(id: ID): Promise<boolean> {
  return deleteInvoice(id);
}


/**
 * יוצרת חשבונית חדשה – ידנית או אוטומטית – בהתבסס על פרטי הבקשה שסופקו.
 *
 * @param request - נתוני החשבונית כולל לקוח, טווח חיוב, פריטים ושדות אופציונליים
 * @param options - פרמטרים נוספים (כגון האם החשבונית נוצרת אוטומטית)
 * @returns אובייקט חשבונית מוכן לאחסון או לעיבוד
 */

// export const createInvoice = async (
//   request: CreateInvoiceRequest,
//   options: { auto?: boolean } = {}
// ): Promise<Invoice> => {
//   // שלב 1: הפקת מזהים ותאריכים
//   const id = generateId(); // מזהה ייחודי לחשבונית
//   const invoiceNumber = generateInvoiceNumber(); // מספר חשבונית רציף וייחודי
//   const createdAt = new Date().toISOString(); // חותמת זמן יצירה
//   const invoiceDate = createdAt;

//   // שלב 2: בדיקות תקינות על טווח חיוב ותאריך יעד
//   if (new Date(request.billingPeriod.startDate) > new Date(request.billingPeriod.endDate)) {
//     throw new Error("תאריך התחלה של טווח החיוב חייב להיות לפני תאריך הסיום");
//   }

//   if (new Date(request.dueDate) < new Date(invoiceDate)) {
//     throw new Error("תאריך יעד לתשלום חייב להיות אחרי תאריך החשבונית");
//   }

//   // שלב 3: שליפת נתוני הלקוח
//   const customerName = await getCustomerName(request.customerId);

//   // שלב 4: עיבוד פריטים לחשבונית
//   const items: InvoiceItem[] = request.items.map((item) => {
//     if (item.quantity <= 0 || item.unitPrice < 0) {
//       throw new Error("כמות ומחיר ליחידה חייבים להיות חיוביים");
//     }

//     const lineTotal = item.quantity * item.unitPrice;

//     return {
//       id: generateId(),
//       type: item.type,
//       description: item.description,
//       quantity: item.quantity,
//       unitPrice: item.unitPrice,
//       lineTotal,
//       period: item.period,
//       workspaceId: item.workspaceId,
//       orderId: item.orderId,
//     };
//   });

//   // שלב 5: חישוב סכומים
//   const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
//   const taxRate = 0.17;
//   const taxAmount = subtotal * taxRate;
//   const total = subtotal + taxAmount;

//   // שלב 6: בניית אובייקט החשבונית הסופי
//   const invoice: Invoice = {
//     id,
//     invoiceNumber,
//     customerId: request.customerId,
//     customerName,
//     invoiceDate,
//     dueDate: request.dueDate,
//     billingPeriod: request.billingPeriod,
//     items,
//     subtotal,
//     taxAmount,
//     taxRate,
//     total,
//     status: "טיוטה",
//     paymentDate: request.paymentDate,
//     paymentAmount: request.paymentAmount,
//     notes: options.auto
//       ? (request.notes || "נוצרה אוטומטית על ידי המערכת")
//       : request.notes,
//     templateId: request.templateId,
//     documentFile: undefined,
//     createdAt,
//     updatedAt: createdAt,
//   };

//   // שלב 7: החזרת החשבונית המלאה
//   return invoice;
// };

//יצירת חשבונית ידנית - רחל יכולה להזין את כל השדות בעצמה
export const createManualInvoice = (manualInvoice: Invoice): Invoice => {
  return manualInvoice;
};

//התאמה אישית של תבנית החשבונית - נחמה יכולה לעדכן תבנית עיצובית
export const customizeInvoiceTemplate = (
  invoice: Invoice,
  customTemplateId: string
): Invoice => {
  return {
    ...invoice,
    // templateId: customTemplateId,
  };
};

// יוצרת חשבונית מס תקינה לפי דרישות החוק.
export const createTaxInvoice = async (
  request: CreateInvoiceRequest,
  options?: { auto?: boolean }
): Promise<Invoice> => {
  throw new Error("Not implemented yet");
};

//מפיקה מסמך פיננסי תקני (חשבונית מס, קבלה, תעודת זיכוי וכו') לפי דרישות החוק.
// export const generateFinancialDocument = async (
//   documentType: DocumentType,
//   entityId: ID,
//   variables: Record<string, any>
// ): Promise<GeneratedDocument> => {
//   throw new Error("Not implemented yet");
// };
