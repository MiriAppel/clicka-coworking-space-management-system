import { Request, Response } from 'express'; // ייבוא סוגים ל-Request ו-Response מ-Express
import { generateRevenueData, generateExpenseData } from '../services/reportGenerators.service'; // ייבוא הפונקציות ליצירת הדוחות מה-Service
import { ReportType, ReportParameters } from 'shared-types'; // ייבוא סוגי טיפוסים מוגדרים מראש מה-shared-types שלך

/**
 * Controller כללי שמקבל קריאה לדוח לפי סוג
 * @param req - בקשת ה-HTTP (כוללת type ו-parameters)
 * @param res - תגובת השרת ללקוח
 */
export async function handleGenerateReport(req: Request, res: Response) {
  try {
    const { type } = req.params; // חילוץ סוג הדוח מה-URL (REVENUE / EXPENSES)
    const parameters = req.body as ReportParameters; // חילוץ הפרמטרים מה-body לפי מבנה ReportParameters

    let reportData;

    // בדיקה איזה סוג דוח להפעיל
    switch (type as ReportType) {
      case 'REVENUE':
        reportData = await generateRevenueData(parameters); // הפעלת דוח הכנסות
        break;
      case 'EXPENSES':
        reportData = await generateExpenseData(parameters); // הפעלת דוח הוצאות
        break;
      default:
        return res.status(400).json({ error: 'Unsupported report type' }); // טיפול במקרה שסוג הדוח לא נתמך
    }

    res.json(reportData); // החזרת תוצאת הדוח ללקוח בפורמט JSON

  } catch (error) {
    console.error('Error generating report:', error); // הדפסת שגיאה ללוג השרת
    res.status(500).json({ error: 'Failed to generate report' }); // החזרת שגיאה כללית ללקוח
  }
}
