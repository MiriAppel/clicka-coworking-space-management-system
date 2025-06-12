import {TimePeriod} from "../core"
export class OccupancyTrend {
    period: TimePeriod;
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
  
    constructor(
      period: TimePeriod,
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
        data: this.data,
        summary: this.summary,
      };
    }
  }
  