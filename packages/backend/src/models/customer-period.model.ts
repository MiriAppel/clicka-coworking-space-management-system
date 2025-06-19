import { ID } from "../types/core";
import { CustomerPeriod, ExitReason } from "../types/customer";


export class CustomerPeriodModel implements CustomerPeriod {

  id: ID; // PK
  customerId: ID; // FK. לקוח יכול להיות פעיל בכמה תקופות שונות (לדוגמה: עזב וחזר), לכן יש טבלת תקופות נפרדת.
  entryDate: string;
  exitDate?: string;
  exitNoticeDate?: string;
  exitReason?: ExitReason;
  exitReasonDetails?: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: ID,
    customerId: ID,
    entryDate: string,
    createdAt: string,
    updatedAt: string,
    exitDate?: string,
    exitNoticeDate?: string,
    exitReason?: ExitReason,
    exitReasonDetails?: string
  ) {
    this.id = id;
    this.customerId = customerId;
    this.entryDate = entryDate;
    this.exitDate = exitDate;
    this.exitNoticeDate = exitNoticeDate;
    this.exitReason = exitReason;
    this.exitReasonDetails = exitReasonDetails;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      customerId: this.customerId,
      entryDate: this.entryDate,
      exitDate: this.exitDate,
      exitNoticeDate: this.exitNoticeDate,
      exitReason: this.exitReason,
      exitReasonDetails: this.exitReasonDetails,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
