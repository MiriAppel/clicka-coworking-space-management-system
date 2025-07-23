import { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLog.service';

// הגדרת קונטרולר מבוסס מחלקה עבור יומן הפעולות (Audit Log)
export class AuditLogController {
  // יצירת מופע של השירות
  auditLogService = new AuditLogService();

  // פעולה: שליפת רשומות יומן עם אפשרות לפילטרים
  async getAuditLogs(req: Request, res: Response) {
    try {
      // חילוץ פרמטרים מתוך query string
      const { userEmail, action, startDate, endDate, limit } = req.query;

      // בניית אובייקט פילטרים
      const filters = {
        userEmail: userEmail as string,
        action: action as string,
        startDate: startDate as string,
        endDate: endDate as string,
        limit: limit ? parseInt(limit as string) : 50,
      };

      // שליפת רשומות לפי הפילטרים
      const auditLogs = await this.auditLogService.getAuditLogs(filters);

      // החזרת תוצאות
      return res.status(200).json(auditLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return res.status(500).json({ message: 'Failed to fetch audit logs' });
    }
  }
}
