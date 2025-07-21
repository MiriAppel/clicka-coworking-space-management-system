import { Router } from 'express';
import { Request, Response } from 'express';
import { createInvoice, deleteInvoice, getAllInvoiceItems,sendEmail, getAllInvoices, getInvoiceById, updateInvoice } from '../controllers/invoice.controller';
import { sendInvoiceUpdateMail } from '../controllers/InvoiceUpdateMail';

const invoiceRouter = Router();
console.log('✅ invoice router loaded');

// נתיב בדיקה
invoiceRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    message: 'Invoice routes are working!',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET    /api/invoices         - Get all invoices',
      'GET    /api/invoices/:invoice_id/items     - Get invoice by invoiceId',
      'GET    /api/invoices/:id     - Get invoice by ID',
      'POST   /api/invoices/create  - Create manual invoice',
      'POST   /api/invoices/generate - Generate automatic invoices',
      'PUT    /api/invoices/:id     - Update invoice',
      'DELETE /api/invoices/:id     - Delete invoice'
    ]
  });
});
// CREATE - יצירת חשבוניות
invoiceRouter.post('/create', createInvoice);                    // יצירת חשבונית ידנית            // יצירת חשבוניות אוטומטיות
// READ - קריאת חשבוניות
invoiceRouter.get('/', getAllInvoices);                          // כל החשבוניות
 invoiceRouter.get('/:invoice_id/items', getAllInvoiceItems);               // פרטי חשבונית
invoiceRouter.get('/:id', getInvoiceById);                       // חשבונית ספציפית
// UPDATE - עדכון חשבונית
invoiceRouter.put('/:id', updateInvoice);                        // עדכון חשבונית (הסרתי 'update/')
// DELETE - מחיקת חשבונית
invoiceRouter.delete('/:id', deleteInvoice); 
// שליחת מייל
invoiceRouter.post('/sendemail', sendEmail);
//עידכון מייל
invoiceRouter.post('/send-invoice-update-email', sendInvoiceUpdateMail);

invoiceRouter.get('/health', (req, res) => {
  res.json({ message: 'INVOICE ROUTER OK' });
});


export default invoiceRouter;