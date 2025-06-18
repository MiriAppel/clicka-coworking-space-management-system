import { Request, Response } from "express";
//crud functions




















/**
 * בקר ליצירת חשבונית ידנית
 */
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await createInvoice(req.body); // ���������� ���������� - ������ auto
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

/**
 * בקר ליצירת חשבוניות אוטומטיות (למשל ללקוחות חוזיים)
 */
export const generateInvoices = async (_req: Request, res: Response) => {
  try {
    const customers = await getAllActiveCustomers(); // דוגמה: שליפה מבסיס נתונים
    const generatedInvoices = [];

    for (const customer of customers) {
      const items = await getItemsForCustomer(customer.id);

      if (!items.length) continue;

      const invoiceRequest: CreateInvoiceRequest = {
        customerId: customer.id,
        billingPeriod: {
          startDate: getStartOfMonth(),
          endDate: getEndOfMonth(),
        },
        dueDate: getEndOfMonth(),
        items,
        notes: "", // אופציונלי
      };

      const invoice = await createInvoice(invoiceRequest, { auto: true });
      generatedInvoices.push(invoice);
    }

    res.status(201).json({
      message:` נוצרו ${generatedInvoices.length} חשבוניות`,
      invoices: generatedInvoices,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};