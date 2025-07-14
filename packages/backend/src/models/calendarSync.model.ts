import { ID, DateISO } from  "shared-types/core";
import { CalendarSync,CalendarSyncStatus} from "shared-types/calendarSync";

// מחלקה לסינכרון קלנדר
export class CalendarSyncModel implements CalendarSync {
  id?: ID;
  bookingId: ID;
  calendarId: string;
  lastSyncAt: DateISO;
  syncStatus: CalendarSyncStatus;
  syncErrors?: string[];

  constructor(params: {
    id: ID;
    bookingId: ID;
    calendarId: string;
    lastSyncAt: DateISO;
    syncStatus: CalendarSyncStatus;
    syncErrors?: string[];
  }) {
    this.id = params.id|| undefined;
    this.bookingId = params.bookingId;
    this.calendarId = params.calendarId;
    this.lastSyncAt = params.lastSyncAt;
    this.syncStatus = params.syncStatus;
    this.syncErrors = params.syncErrors;
  }
  
 

  toDatabaseFormat() {
    return {
      booking_id: this.bookingId,
      calendar_id: this.calendarId,
      last_sync_at: this.lastSyncAt,
      sync_status: this.syncStatus,
      sync_errors: this.syncErrors,
    };
  }
}



