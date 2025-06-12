import { ID, DateISO } from "../../types/core";

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

// מחלקה לבקשה לסינכרון הזמנות עם גוגל
export class SyncBookingsWithGoogleRequest {
  roomId?: ID;
  startDate?: DateISO;
  endDate?: DateISO;
  forceSync?: boolean;

  constructor(params: {
    roomId?: ID;
    startDate?: DateISO;
    endDate?: DateISO;
    forceSync?: boolean;
  }) {
    this.roomId = params.roomId;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.forceSync = params.forceSync;
  }

  toDatabaseFormat() {
    return {
      roomId: this.roomId,
      startDate: this.startDate,
      endDate: this.endDate,
      forceSync: this.forceSync,
    };
  }
}

// מחלקה לקונפליקטים קלנדריים
export class CalendarConflict {
  bookingId: ID;
  googleEventId: string;
  conflictType: 'TIME_OVERLAP' | 'ROOM_CONFLICT' | 'PERMISSION_ERROR';
  description: string;
  suggestedResolution: string;

  constructor(params: {
    bookingId: ID;
    googleEventId: string;
    conflictType: 'TIME_OVERLAP' | 'ROOM_CONFLICT' | 'PERMISSION_ERROR';
    description: string;
    suggestedResolution: string;
  }) {
    this.bookingId = params.bookingId;
    this.googleEventId = params.googleEventId;
    this.conflictType = params.conflictType;
    this.description = params.description;
    this.suggestedResolution = params.suggestedResolution;
  }

  toDatabaseFormat() {
    return {
      bookingId: this.bookingId,
      googleEventId: this.googleEventId,
      conflictType: this.conflictType,
      description: this.description,
      suggestedResolution: this.suggestedResolution,
    };
  }
}
