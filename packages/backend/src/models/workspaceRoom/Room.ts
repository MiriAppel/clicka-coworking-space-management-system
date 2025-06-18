import {ID,DateISO} from "../core";
import{RoomStatus,MeetingRoomManagement,RoomFeature} from "../core"
import { BookingRules } from "./BookingRules";
import { OccupancyAlert } from "../workspaceTraking/OccupancyAlert";
import { OccupancySnapshot } from "../workspaceTraking/OccupancySnapshot";
import { RoomFaeature } from "./RoomFaeature";
export class Room {
    id: ID;
    name: string;
    description?: string;
    type: MeetingRoomManagement;
    status: RoomStatus;
    capacity: number;
    features: RoomFeature[];
    hourlyRate: number;
    discountedHourlyRate: number;
    googleCalendarId?: string;
    location: string;
    equipment: string[];
    bookingRules: RoomStatus;
    nextMaintenanceDate?: DateISO;
    createdAt: DateISO;
    updatedAt: DateISO;
  // קשר: חדר אחד -> כלל הזמנה אחד (לפי roomId)
  rules?: BookingRules;

  // קשר: חדר אחד -> כמה התראות תפוסה
  occupancyAlerts?: OccupancyAlert[];

  // קשר: חדר אחד -> כמה תמונות/פיצ'רים (RoomFaeature)
  roomFeatures?: RoomFaeature[];

  // קשר: חדר אחד -> כמה snapshots
  occupancySnapshots?: OccupancySnapshot[];
    constructor(
      id: ID,
      name: string,
      type: MeetingRoomManagement,
      status: RoomStatus,
      capacity: number,
      features: RoomFeature[],
      hourlyRate: number,
      discountedHourlyRate: number,
      location: string,
      equipment: string[],
      bookingRules: RoomStatus,
      nextMaintenanceDate: DateISO,
      createdAt: DateISO,
      updatedAt: DateISO,
      description?: string,
      googleCalendarId?: string
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
      this.bookingRules = bookingRules;
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
        bookingRules: this.bookingRules,
        nextMaintenanceDate:this.nextMaintenanceDate,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
    
  }
  