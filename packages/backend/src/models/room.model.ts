import {RoomFeature,RoomType,RoomStatus,Room, BookingRules} from 'shared-types/booking';
import { ID, DateISO } from 'shared-types/core';

export class RoomModel implements Room, BookingRules{
  id: ID;
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

  constructor(data:{
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
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.status = data.status;
    this.capacity = data.capacity;
    this.features = data.features;
    this.hourlyRate = data.hourlyRate;
    this.discountedHourlyRate = data.discountedHourlyRate;
    this.googleCalendarId = data.googleCalendarId;
    this.location = data.location;
    this.equipment = data.equipment;

    // BookingRules fields:
    this.MinimumBookingMinutes = data.MinimumBookingMinutes;
    this.MaximumBookingMinutes = data.MaximumBookingMinutes;
    this.AdvanceBookingDays = data.AdvanceBookingDays;
    this.RequiredApproval = data.RequiredApproval;
    this.FreeHoursForKlikcaCard = data.FreeHoursForKlikcaCard;

    this.nextMaintenanceDate = data.nextMaintenanceDate;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
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
      MinimumBookingMiniuts: this.MinimumBookingMinutes,
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