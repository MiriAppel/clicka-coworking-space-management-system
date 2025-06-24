import type{ DateISO, ID } from "shared-types";

// מחלקה לסינכרון קלנדר
export class CalendarSyncModel implements CalendarSync {
  id: ID;
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
    this.id = params.id;
    this.bookingId = params.bookingId;
    this.calendarId = params.calendarId;
    this.lastSyncAt = params.lastSyncAt;
    this.syncStatus = params.syncStatus;
    this.syncErrors = params.syncErrors;
  }
  
 

  toDatabaseFormat() {
    return {
      id: this.id,
      bookingId: this.bookingId,
      calendarId: this.calendarId,
      lastSyncAt: this.lastSyncAt,
      syncStatus: this.syncStatus,
      syncErrors: this.syncErrors,
    };
  }
}



