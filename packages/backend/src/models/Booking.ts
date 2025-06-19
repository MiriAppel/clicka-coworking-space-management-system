import { ID, DateISO,  } from'../../../../types/core';
import{BookingStatus} from '../../../../types/booking'

export class MapCoordinates {
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

  constructor(params: {
    id: ID;
    roomId: ID;
    roomName: string;
    startTime: DateISO;
    endTime: DateISO;
    status: BookingStatus;
    totalHours?: number;
    chargeableHours?: number;
    totalCharge?: number;
    isPaid?: boolean;
    customerId?: ID;
    customerName?: string;
    externalUserName?: string;
    externalUserEmail?: string;
    externalUserPhone?: string;
    notes?: string;
    googleCalendarEventId?: string;
    approvedBy?: ID;
    approvedAt?: DateISO;
    createdAt?: DateISO;
    updatedAt?: DateISO;
  }) {
    this.id = params.id;
    this.roomId = params.roomId;
    this.roomName = params.roomName;
    this.customerId = params.customerId;
    this.customerName = params.customerName;
    this.externalUserName = params.externalUserName;
    this.externalUserEmail = params.externalUserEmail;
    this.externalUserPhone = params.externalUserPhone;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.status = params.status;
    this.notes = params.notes;
    this.googleCalendarEventId = params.googleCalendarEventId;
    this.totalHours = params.totalHours ?? 0;
    this.chargeableHours = params.chargeableHours ?? 0;
    this.totalCharge = params.totalCharge ?? 0;
    this.isPaid = params.isPaid ?? false;
    this.approvedBy = params.approvedBy;
    this.approvedAt = params.approvedAt;
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.updatedAt = params.updatedAt ?? new Date().toISOString();
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      roomId: this.roomId,
      roomName: this.roomName,
      customerId: this.customerId,
      customerName: this.customerName,
      externalUserName: this.externalUserName,
      externalUserEmail: this.externalUserEmail,
      externalUserPhone: this.externalUserPhone,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      notes: this.notes,
}}
}