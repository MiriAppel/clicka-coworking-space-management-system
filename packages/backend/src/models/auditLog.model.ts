import { ID, DateISO } from '../../../shared-types';

export interface AuditLog {
  id?: ID;
  userEmail: string;           // אמייל של המשתמש שביצע את הפעולה
  timestamp: DateISO;          // תאריך ושעה
  action: 'POST' | 'PUT' | 'DELETE';  // פעולה
  functionName: string;        // איזה פונקציה
  targetUserEmail?: string;    // אמייל של המשתמש שעליו ביצעו את הפעולה
}

export class AuditLogModel implements AuditLog {
  id?: ID;
  userEmail: string;
  timestamp: DateISO;
  action: 'POST' | 'PUT' | 'DELETE';
  functionName: string;
  targetUserEmail?: string;

  constructor(data: {
    id?: ID;
    userEmail: string;
    timestamp: DateISO;
    action: 'POST' | 'PUT' | 'DELETE';
    functionName: string;
    targetUserEmail?: string;
  }) {
    this.id = data.id;
    this.userEmail = data.userEmail;
    this.timestamp = data.timestamp;
    this.action = data.action;
    this.functionName = data.functionName;
    this.targetUserEmail = data.targetUserEmail;
  }

  // המרה לפורמט DB
  toDatabaseFormat() {
    return {
      user_email: this.userEmail,
      timestamp: this.timestamp,
      action: this.action,
      function_name: this.functionName,
      target_user_email: this.targetUserEmail,
    };
  }

  // המרה מפורמט DB
  static fromDatabaseFormat(dbData: any): AuditLogModel {
    return new AuditLogModel({
      id: dbData.id,
      userEmail: dbData.user_email,
      timestamp: dbData.timestamp,
      action: dbData.action,
      functionName: dbData.function_name,
      targetUserEmail: dbData.target_user_email,
    });
  }

  static fromDatabaseFormatArray(dbDataArray: any[]): AuditLogModel[] {
    return dbDataArray.map(dbData => AuditLogModel.fromDatabaseFormat(dbData));
  }
}