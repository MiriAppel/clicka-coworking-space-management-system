import {TimePeriod,ID,DateISO,WorkSpaceType,statusOccupancy} from "../controllers/occupancyTrend.controllers"
import { Room } from "./room.model";
export interface OccupancySnapshot{
  id: ID;
  customerId:string;
  roomId:string;
  date: DateISO;
  totalSpace: number;
  OccupiendSpaces: number;
  availableSpaces: number;
  OccupancyRate: number;
  BreakDown: {
    [key in WorkSpaceType]: {
      total: number;
      occupied: number;
      occupancyRate: number;
    };
  };
  createdAt: DateISO;
}
export interface OccupancyAlert{
  id:ID;
  roomId:string;
  customerId:string ;
  type:statusOccupancy;
  threshold:number;
  currentValue:number;
  workspaceType:WorkSpaceType;
  isActive:boolean;
  triggeredAT:DateISO;
}
export class OccupancyTrend {
    period: TimePeriod;
    customerId!:string;
    data: {
      date: string;
      occupancyRate: number;
      totalSpace: number;
      occupiedSpaces: number;
    }[];
    summary: {
      averageOccupancy: number;
      peakOccupancy: number;
      lowOccupancy: number;
      growthRate: number;
    };
    // קשר: אופציונלי אם את רוצה לקשר למזהה חדר
    room?: Room;
    constructor(
      period: TimePeriod,
      customerId:string,
      data: {
        date: string;
        occupancyRate: number;
        totalSpace: number;
        occupiedSpaces: number;
      }[],
      averageOccupancy: number,
      peakOccupancy: number,
      lowOccupancy: number,
      growthRate: number
    ) {
      this.period = period;
      this.customerId=customerId;
      this.data = data;
      this.summary = {
        averageOccupancy,
        peakOccupancy,
        lowOccupancy,
        growthRate,
      };
    }
  
    toDatabaseFormat() {
      return {
        period: this.period,
        customerId:this.customerId,
        data: this.data,
        summary: this.summary,
      };
    }
  }
  