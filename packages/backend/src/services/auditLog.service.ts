import { AuditLog, AuditLogModel } from '../models/auditLog.model';
import { ID } from '../../../shared-types';

export class AuditLogService {
  
  async createAuditLog(data: Omit<AuditLog, 'id'>): Promise<AuditLogModel> {
    const auditLog = new AuditLogModel({
      id: this.generateId(),
      ...data
    });

    await this.saveToDatabase(auditLog);
    return auditLog;
  }

  private async saveToDatabase(auditLog: AuditLogModel): Promise<void> {
    try {
      const dbData = auditLog.toDatabaseFormat();
      
      // כאן תחליפי בקוד שלך לשמירה בDB
      // דוגמה עם MySQL/PostgreSQL:
      /*
      const connection = await getDbConnection(); // הפונקציה שלך לחיבור DB
      const query = `
        INSERT INTO audit_logs 
        (id, user_email, timestamp, action, function_name, target_user_email)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      await connection.execute(query, [
        auditLog.id,
        dbData.user_email,
        dbData.timestamp,
        dbData.action,
        dbData.function_name,
        dbData.target_user_email
      ]);
      */

      // זמנית - רק הדפסה לקונסול
      console.log('📝 Audit Log:', {
        userEmail: dbData.user_email,
        timestamp: dbData.timestamp,
        action: dbData.action,
        functionName: dbData.function_name,
        targetUserEmail: dbData.target_user_email
      });
      
    } catch (error) {
      console.error('Error saving audit log:', error);
    }
  }

  async getAuditLogs(filters?: {
    userEmail?: string;
    action?: string;
    functionName?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<AuditLogModel[]> {
    try {
      // כאן תחליפי בקוד שלך לשליפה מDB
      /*
      const connection = await getDbConnection();
      let query = 'SELECT * FROM audit_logs WHERE 1=1';
      const params: any[] = [];

      if (filters?.userEmail) {
        query += ' AND user_email = ?';
        params.push(filters.userEmail);
      }

      if (filters?.action) {
        query += ' AND action = ?';
        params.push(filters.action);
      }

      if (filters?.functionName) {
        query += ' AND function_name = ?';
        params.push(filters.functionName);
      }

      if (filters?.startDate) {
        query += ' AND timestamp >= ?';
        params.push(filters.startDate);
      }

      if (filters?.endDate) {
        query += ' AND timestamp <= ?';
        params.push(filters.endDate);
      }

      query += ' ORDER BY timestamp DESC';

      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
      }

      const [rows] = await connection.execute(query, params);
      return AuditLogModel.fromDatabaseFormatArray(rows as any[]);
      */

      return [];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }

  private generateId(): ID {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}