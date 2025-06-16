import { ID, DateISO } from '../core';

export class CreateBookingRequest {
  roomId: ID;
  customerId?: ID;
  externalUserName?: string;
  externalUserEmail?: string;
  externalUserPhone?: string;
  startTime: DateISO;
  endTime: DateISO;
  notes?: string;

  constructor(params: {
    roomId: ID;
    customerId?: ID;
    externalUserName?: string;
    externalUserEmail?: string;
    externalUserPhone?: string;
    startTime: DateISO;
    endTime: DateISO;
    notes?: string;
  }) {
    this.roomId = params.roomId;
    this.customerId = params.customerId;
    this.externalUserName = params.externalUserName;
    this.externalUserEmail = params.externalUserEmail;
    this.externalUserPhone = params.externalUserPhone;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.notes = params.notes;
  }

  toDatabaseFormat() {
    return {
      roomId: this.roomId,
      customerId: this.customerId,
      externalUserName: this.externalUserName,
      externalUserEmail: this.externalUserEmail,
      externalUserPhone: this.externalUserPhone,
      startTime: this.startTime,
      endTime: this.endTime,
      notes: this.notes,
    };
  }
}
