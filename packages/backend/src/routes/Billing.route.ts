import express, { Request, Response } from 'express';
 import { calculateBillingForCustomer } from '../services/billingCalcullation.services';

const router = express.Router();

// פונקציה עזר לחישוב dueDate (למשל 10 לחודש)
function getDueDate(startDate: string): string {
  const d = new Date(startDate);
  d.setDate(10);
  return d.toISOString().slice(0, 10);
}

// מחשב חיוב ללקוח בודד לפי מזהה וטווח תאריכים
router.post('/calculate/:customerId', async (req: Request, res: Response) => {
  try {
    const customerId = req.params.customerId;
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'חובה לציין תאריכים' });
    }

    const dueDate = getDueDate(startDate);

    const result = await calculateBillingForCustomer(
      customerId,
      { startDate, endDate },
      dueDate
    );

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'שגיאה בחישוב החיוב', details: err?.message });
  }
});

export default router;