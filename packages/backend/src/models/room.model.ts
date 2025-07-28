import { RoomFeature, RoomType, RoomStatus, Room } from "shared-types/booking";
import { ID, DateISO } from "shared-types/core";

export class RoomModel implements Room {
  id?: ID;
  name: string;
  description?: string;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  features: ID[];
  hourlyRate: number;
  discountedHourlyRate: number;
  googleCalendarId?: string;
  location: string;
  equipment: string[];
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  MinimumBookingMinutes: number;
  MaximumBookingMinutes: number;
  RequiredApproval: boolean;
  FreeHoursForKlikcaCard: number;
  nextMaintenanceDate?: DateISO;
  workspaceMapId: string;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(params: any) {
    this.id = params.id ?? crypto.randomUUID();
    this.name = params.name ?? '';
    this.description = params.description ?? params.description_text ?? '';
    this.type = params.type ?? params.room_type;
    this.status = params.status ?? params.room_status;
    this.capacity = params.capacity ?? params.room_capacity ?? 1;
    this.features = params.features ?? [];
    this.hourlyRate = params.hourlyRate ?? params.hourly_rate ?? 0;
    this.discountedHourlyRate = params.discountedHourlyRate ?? params.discounted_hourly_rate ?? 0;
    this.googleCalendarId = params.googleCalendarId ?? params.google_calendar_id;
    this.location = params.location ?? '';
    this.equipment = params.equipment ?? [];
    this.MinimumBookingMinutes = params.MinimumBookingMinutes ?? params.minimum_booking_minutes ?? 30;
    this.MaximumBookingMinutes = params.MaximumBookingMinutes ?? params.maximum_booking_minutes ?? 120;
    this.RequiredApproval = params.RequiredApproval ?? params.required_approval ?? false;
    this.FreeHoursForKlikcaCard = params.FreeHoursForKlikcaCard ?? params.free_hours_for_klikca_card ?? 0;
    this.nextMaintenanceDate = params.nextMaintenanceDate ?? params.next_maintenance_date;
    this.workspaceMapId = params.workspaceMapId ?? params.workspace_map_id;
    this.positionX = params.positionX ?? params.position_x ?? 0;
    this.positionY = params.positionY ?? params.position_y ?? 0;
    this.width = params.width ?? 1;
    this.height = params.height ?? 1;
    this.createdAt = params.createdAt ?? params.createdat ?? new Date().toISOString();
    this.updatedAt = params.updatedAt ?? params.updatedat ?? new Date().toISOString();
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
      minimum_booking_minutes: this.MinimumBookingMinutes,
      maximum_booking_minutes: this.MaximumBookingMinutes,
      required_approval: this.RequiredApproval,
      free_hours_for_klikca_card: this.FreeHoursForKlikcaCard,
      next_maintenance_date: this.nextMaintenanceDate,
      workspace_map_id: this.workspaceMapId,
      createdat: this.createdAt,
      updatedat: this.updatedAt,
      position_x: this.positionX,
      position_y: this.positionY,
      width: this.width,
      height: this.height,
    };
  }

  static fromDatabaseFormat(dbData: any): RoomModel {
    return new RoomModel(dbData);
  }

  static fromDatabaseFormatArray(dbDataArray: any[]): RoomModel[] {
    return dbDataArray.map((dbData) => RoomModel.fromDatabaseFormat(dbData));
  }
}
