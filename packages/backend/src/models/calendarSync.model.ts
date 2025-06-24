import type{ DateISO, ID } from "shared-types";

// מחלקה לסינכרון קלנדר
export class CalendarSync {
  bookingId: ID;
  googleEventId: string;
  calendarId: string;
  lastSyncAt: DateISO;
  syncStatus: CalendarSyncStatus;
  syncErrors?: string[];

  constructor(params: {
    bookingId: ID;
    googleEventId: string;
    calendarId: string;
    lastSyncAt: DateISO;
    syncStatus: CalendarSyncStatus;
    syncErrors?: string[];
  }) {
    this.bookingId = params.bookingId;
    this.googleEventId = params.googleEventId;
    this.calendarId = params.calendarId;
    this.lastSyncAt = params.lastSyncAt;
    this.syncStatus = params.syncStatus;
    this.syncErrors = params.syncErrors;
  }

  toDatabaseFormat() {
    return {
      bookingId: this.bookingId,
      googleEventId: this.googleEventId,
      calendarId: this.calendarId,
      lastSyncAt: this.lastSyncAt,
      syncStatus: this.syncStatus,
      syncErrors: this.syncErrors,
    };
  }
}

// סטטוס סינכרון קלנדר
export enum CalendarSyncStatus {
  SYNCED = 'SYNCED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CONFLICT = 'CONFLICT'
}

export interface SyncBookingsWithGoogleRequest {
  roomId?: ID;
  startDate?: DateISO;
  endDate?: DateISO;
  forceSync?: boolean;
}

export interface CalendarConflict {
  bookingId: ID;
  googleEventId: string;
  conflictType: 'TIME_OVERLAP' | 'ROOM_CONFLICT' | 'PERMISSION_ERROR';
  description: string;
  suggestedResolution: string;
}


