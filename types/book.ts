import { ID, DateISO } from './core';
export interface Booking {
 id: ID;
  roomId: ID;
  roomName: string;
  customerId?: ID;
  customerName?: string;
  externalUserName?: string;
  externalUserEmail?: string;
  externalUserPhone?: string;
  startTime: DateISO;
  endTime: DateISO;
  status: BookingStatus;
  notes?: string;
  googleCalendarEventId?: string;
  totalHours: number;
  chargeableHours: number;
  totalCharge: number;
  isPaid: boolean;
  approvedBy?: ID;
  approvedAt?: DateISO;
  createdAt: DateISO;
  updatedAt: DateISO;
 }