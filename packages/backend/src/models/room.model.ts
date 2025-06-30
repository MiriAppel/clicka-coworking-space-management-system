import {RoomFeature,RoomType,RoomStatus,Room, BookingRules} from 'shared-types/booking';
import { ID, DateISO } from 'shared-types/core';

export class RoomModel implements Room, BookingRules{
  id: ID;
  name: string;
  description?: string;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  features?: RoomFeature[];
  hourlyRate: number;
  discountedHourlyRate: number;
  googleCalendarId?: string;
  location: string;
  equipment?: string[];

  // BookingRules fields INLINED:
  MinimumBookingMinutes: number;
  MaximumBookingMinutes: number;
  RequiredApproval: boolean;
  FreeHoursForKlikcaCard: number;

  nextMaintenanceDate?: DateISO;
  workspaceMapId: ID; // Assuming this is a reference to a WorkspaceMap
  createdAt: DateISO;
  updatedAt: DateISO;

   constructor(params: {
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

     // BookingRules fields:
     MinimumBookingMinutes: number;
     MaximumBookingMinutes: number;
     RequiredApproval: boolean;
     FreeHoursForKlikcaCard: number;

     nextMaintenanceDate?: DateISO;
     workspaceMapId: ID; // Reference to a WorkspaceMap
     createdAt?: DateISO;
     updatedAt?: DateISO;
   }) {
    this.id = params.id;
    this.name = params.name;  
    this.description = params.description;
    this.type = params.type;
    this.status = params.status;
    this.capacity = params.capacity;
    this.features = params.features;
    this.hourlyRate = params.hourlyRate;  
    this.discountedHourlyRate = params.discountedHourlyRate;
    this.googleCalendarId = params.googleCalendarId;
    this.location = params.location;
    this.equipment = params.equipment;
    this.MinimumBookingMinutes = params.MinimumBookingMinutes;
    this.MaximumBookingMinutes = params.MaximumBookingMinutes;
    this.RequiredApproval = params.RequiredApproval;
    this.FreeHoursForKlikcaCard = params.FreeHoursForKlikcaCard;
    this.nextMaintenanceDate = params.nextMaintenanceDate;
    this.workspaceMapId = params.workspaceMapId; // Reference to a WorkspaceMap
    this.createdAt = params.createdAt ?? new Date().toISOString(); 
    this.updatedAt = params.updatedAt ?? new Date().toISOString(); 
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
      hourly_rate: this.hourlyRate,
      discounted_hourly_rate: this.discountedHourlyRate,
      google_calendar_id: this.googleCalendarId,
      location: this.location,
      equipment: this.equipment,

      // BookingRules fields:
      minimum_booking_minutes: this.MinimumBookingMinutes,
      maximum_booking_minutes: this.MaximumBookingMinutes,
      required_approval: this.RequiredApproval,
      free_hours_for_klikca_card: this.FreeHoursForKlikcaCard,

      next_maintenance_date: this.nextMaintenanceDate,
      workspace_map_id:this.workspaceMapId, // Reference to a WorkspaceMap
       createdat: this.createdAt,
       updatedat: this.updatedAt
    };
  }
}