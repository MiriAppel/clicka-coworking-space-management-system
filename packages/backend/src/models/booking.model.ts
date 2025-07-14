import type{  DateISO, ID } from "shared-types/core";
import {Booking,BookingStatus} from 'shared-types/booking'

export class BookingModel implements Booking {
  id?: ID;
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
    this.id = params.id || undefined;
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
      room_id: this.roomId,
      room_name: this.roomName,
      customer_id: this.customerId,
      customer_name: this.customerName,
      external_user_name: this.externalUserName,
      external_user_email: this.externalUserEmail,
      external_user_phone: this.externalUserPhone,
      start_time: this.startTime,
      end_time: this.endTime,
      status: this.status,
      notes: this.notes,
      is_paid:this.isPaid,
}}
     static fromDatabaseFormat(dbData: any): BookingModel {
        return new BookingModel({
            id: dbData.id,
            roomId: dbData.room_id,
            roomName: dbData.room_name,
            customerId: dbData.customer_id,
            customerName: dbData.customer_name,
            externalUserName: dbData.external_user_name,
            externalUserEmail: dbData.external_user_email,
            externalUserPhone: dbData.external_user_phone,
            startTime: dbData.start_time,
            endTime: dbData.end_time,
            status: dbData.status,
            notes: dbData.notes,
            googleCalendarEventId: dbData.google_calendar_event_id,
            isPaid: dbData.is_paid,
            totalHours: dbData.total_hours,
        });
    }
    static fromDatabaseFormatArray(dbDataArray: any[] ): BookingModel[] {
        return dbDataArray.map(dbData => BookingModel.fromDatabaseFormat(dbData));
    }
}