import cron from 'node-cron';
import { calculateBillingForCustomer } from '../services/billingCalcullation.services';
import { serviceCreateInvoice } from '../services/invoice.service'; // ייבוא השירות
import { customerService } from '../services/customer.service';
import { VAT_RATE } from '../constants'; // אחוז המע"מ
import { CustomerModel } from '../models/customer.model'; // מבנה לקוח
import { createInvoice } from '../controllers/invoice.controller'; // בקר יצירת חשבונית
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
function getDueDate(endDate: string): string {
  const d = new Date(endDate);
  d.setDate(d.getDate() + 10); // הוספת 10 ימים לתאריך הסיום
  return d.toISOString().slice(0, 10);
}

// תריץ כל 5 דקות
cron.schedule('*/5 * * * *', async () => {
  console.log('Cron job started: Fetching all customers...');
  try {
    const allCustomers: CustomerModel[] = await serviceCustomer.getAll();
    console.log(`Found ${allCustomers.length} customers.`);

    const startDate = getFirstDayOfNextMonth();
    const endDate = getLastDayOfNextMonth();
    const dueDate = getDueDate(endDate);
    console.log(`Billing period: ${startDate} to ${endDate}, Due date: ${dueDate}`);

    for (const customer of allCustomers) {
      if (!customer.id) {
        console.warn(`Customer without id found: ${JSON.stringify(customer)}`);
        continue;
      }

      console.log(`Calculating billing for customer ID: ${customer.id}`);
      const billingResult = await calculateBillingForCustomer(
        customer.id,
        { startDate, endDate },
        dueDate,
        VAT_RATE
      );

      console.log(`Billing result for customer ID ${customer.id}:`, billingResult);

      try {
        const invoiceData = {
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
        };

        console.log(`Creating invoice for customer ID: ${customer.id}`);
        console.log(`inoviceData: ${invoiceData}`);
        await serviceCreateInvoice(invoiceData); // שמירת החשבונית במסד הנתונים
        console.log(`Invoice created for customer ID: ${customer.id}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error creating invoice for customer ${customer.id}: ${error.message}`);
        } else {
          console.error(`Unexpected error creating invoice for customer ${customer.id}:`, error);
        }
      }
    }
    
    console.log('Cron job completed successfully.');
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});
