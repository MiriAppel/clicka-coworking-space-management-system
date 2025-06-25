
import { ID, DateISO } from '../../../shared-types/core';
import {Room,RoomFeature,RoomType,RoomStatus}from '../../../shared-types/booking'

export class RoomModel implements Room {
  id?: ID;
  name: string;
  description?: string;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  features: RoomFeature[];
  hourlyRate: number;
  discountedHourlyRate: number;
  googleCalendarId?: string;
  location: string;
  equipment: string[];

  // BookingRules fields INLINED:
  MinimumBookingMinutes: number;
  MaximumBookingMinutes: number;
  AdvanceBookingDays: number;
  RequiredApproval: boolean;
  FreeHoursForKlikcaCard: number;

  nextMaintenanceDate?: DateISO;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: ID,
    name: string,
    type: RoomType,
    status: RoomStatus,
    capacity: number,
    features: RoomFeature[],
    hourlyRate: number,
    discountedHourlyRate: number,
    location: string,
    equipment: string[],
    MinimumBookingMinutes: number,
    MaximumBookingMinutes: number,
    AdvanceBookingDays: number,
    RequiredApproval: boolean,
    FreeHoursForKlikcaCard: number,
    createdAt: DateISO,
    updatedAt: DateISO,
    description?: string,
    googleCalendarId?: string,
    nextMaintenanceDate?: DateISO
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.status = status;
    this.capacity = capacity;
    this.features = features;
    this.hourlyRate = hourlyRate;
    this.discountedHourlyRate = discountedHourlyRate;
    this.googleCalendarId = googleCalendarId;
    this.location = location;
    this.equipment = equipment;

    // BookingRules fields:
    this.MinimumBookingMinutes = MinimumBookingMinutes;
    this.MaximumBookingMinutes = MaximumBookingMinutes;
    this.AdvanceBookingDays = AdvanceBookingDays;
    this.RequiredApproval = RequiredApproval;
    this.FreeHoursForKlikcaCard = FreeHoursForKlikcaCard;

    this.nextMaintenanceDate = nextMaintenanceDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }


  toDatabaseFormat() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      status: this.status,
      capacity: this.capacity,
      features: this.features,
      hourlyRate: this.hourlyRate,
      discountedHourlyRate: this.discountedHourlyRate,
      googleCalendarId: this.googleCalendarId,
      location: this.location,
      equipment: this.equipment,

      // BookingRules fields:
      MinimumBookingMinutes: this.MinimumBookingMinutes,
      MaximumBookingMinutes: this.MaximumBookingMinutes,
      AdvanceBookingDays: this.AdvanceBookingDays,
      RequiredApproval: this.RequiredApproval,
      FreeHoursForKlikcaCard: this.FreeHoursForKlikcaCard,

      nextMaintenanceDate: this.nextMaintenanceDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}