
import { Router } from 'express';
import { Request, Response } from 'express';
import {
  createInvoice,
  createInvoiceItem,
  getAllInvoiceItems,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
} from '../controllers/invoice.controller';
const invoiceRouter = Router();
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
      'POST   /api/invoices/:invoice_id  - Create invoice item',
      'POST   /api/invoices/generate - Generate automatic invoices',
      'PUT    /api/invoices/:id     - Update invoice',
      'DELETE /api/invoices/:id     - Delete invoice'
    ]
  });
});
// CREATE - יצירת חשבוניות
invoiceRouter.post('/create', createInvoice);      
// יצירת חשבונית ידנית            // יצירת חשבוניות אוטומטיות
// READ - קריאת חשבוניות
invoiceRouter.get('/', getAllInvoices);                          // כל החשבוניות
invoiceRouter.get('/:invoice_id/items', getAllInvoiceItems);               // פרטי חשבונית
invoiceRouter.get('/:id', getInvoiceById);                       // חשבונית ספציפית
// UPDATE - עדכון חשבונית
invoiceRouter.put('/:id', updateInvoice);                        // עדכון חשבונית (הסרתי 'update/')
// DELETE - מחיקת חשבונית
invoiceRouter.delete('/:id', deleteInvoice);     

// יצירת פריט חשבונית
invoiceRouter.post('/:invoice_id', createInvoiceItem); 

export default invoiceRouter;