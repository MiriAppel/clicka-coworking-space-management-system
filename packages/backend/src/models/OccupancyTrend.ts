import {TimePeriod} from "../types/report"
import { Room } from "./Room";
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
  