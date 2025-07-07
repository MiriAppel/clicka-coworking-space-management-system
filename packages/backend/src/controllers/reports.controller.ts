import { Request, Response, NextFunction } from 'express';
import { generateRevenueDataFromPayments, generateExpenseData } from '../services/reportGenerators.service';
import { ReportType, ReportParameters } from 'shared-types';

/**
 * Controller כללי שמקבל קריאה לדוח לפי סוג
 * @param req - בקשת ה-HTTP (כוללת type ו-parameters)
 * @param res - תגובת השרת ללקוח
 */
export class ReportController {
 handleGenerateReport = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const { type } = req.params;
    const parameters = req.body as ReportParameters;
    console.log('Generating report of type:', type, 'with parameters:', parameters);
    let reportData;
    switch (type as ReportType) {
      case 'REVENUE':
        reportData = await generateRevenueDataFromPayments(parameters);
        break;
      case 'EXPENSES':
        reportData = await generateExpenseData(parameters);
        break;
      default:
        res.status(400).json({ error: 'Unsupported report type' });
        return;
    }
    res.json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    next(error);
  }
}
}
