import cron from 'node-cron';
import { createInvoice } from '../models/invoice.model';
import { customerService } from '../services/customer.service';
import { CustomerModel } from '../models/customer.model'; // מבנה לקוח
import { VAT_RATE } from '../constants';
import { calculateBillingForCustomer } from '../services/billingCalcullation.services';
import { validateInvoice } from '../utils/invoiceValidation';

// שירות לשליפת לקוחות
const serviceCustomer = new customerService();
// פונקציות עזר לחישוב תאריכים
function getFirstDayOfNextMonth(date = new Date()): string {
  const year = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
  const month = (date.getMonth() + 1) % 12;
  return new Date(year, month, 1).toISOString().slice(0, 10);
}
function getLastDayOfNextMonth(date = new Date()): string {
  const year = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
  const month = (date.getMonth() + 1) % 12;
  return new Date(year, month + 1, 0).toISOString().slice(0, 10);
}
function getDueDate(startDate: string): string {
  const d = new Date(startDate);
  d.setDate(10);
  return d.toISOString().slice(0, 10);
}
// תריץ כל 1 לחודש ב-02:00 בלילה
cron.schedule('0 2 1 * *', async () => {
  const allCustomers: CustomerModel[] = await serviceCustomer.getAll();
  // חישוב תאריכי חיוב לחודש הבא
  const startDate = getFirstDayOfNextMonth();
  const endDate = getLastDayOfNextMonth();
  const dueDate = getDueDate(startDate);
  for (const customer of allCustomers) {
    // ודא שללקוח יש מזהה
    if (!customer.id) {
      console.warn(`Customer without id found: ${JSON.stringify(customer)}`);
      continue;
    }
    // שולח רק מזהה לקוח + טווח תאריכים
    const billingResult = await calculateBillingForCustomer(
      customer.id,
      { startDate, endDate },
      dueDate,
      VAT_RATE
    );
    validateInvoice(billingResult.invoice);

    // יצירת חשבונית בפועל-שמירה במסד הנתונים
    await createInvoice({
      invoice_number: '', // אם יש מספר חשבונית, נכניס כאן
      customer_id: billingResult.invoice.customer_id,
      customer_name: billingResult.invoice.customer_name,
      status: billingResult.invoice.status,
      issue_date: billingResult.invoice.issue_date,
      due_date: billingResult.invoice.due_date,
      items: billingResult.invoice.items,
      subtotal: billingResult.invoice.subtotal,
      tax_total: billingResult.invoice.tax_total,
      payment_due_reminder: billingResult.invoice.payment_due_reminder,
      payment_dueReminder_sentAt: billingResult.invoice.payment_dueReminder_sentAt,
      createdAt: billingResult.invoice.createdAt,
      updatedAt: billingResult.invoice.updatedAt
    });
  }
  console.log('Monthly billing calculation and invoice creation completed');
});