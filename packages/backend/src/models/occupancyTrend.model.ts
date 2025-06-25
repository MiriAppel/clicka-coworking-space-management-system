// import { TimePeriod,  StatusOccupancy, WorkSpaceType } from 'frontend/occupancy';
import { ID, DateISO } from 'shared-types/core';
import { OccupancyTrend, OccupancyAlert, TimePeriod, StatusOccupancy, WorkSpaceType }from 'shared-types/occupancy'

export class OccupancyTrendModel implements OccupancyTrend {
  id?: ID;
  peroid?: TimePeriod;
  roomId: string;
  customerId: string;
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
  } ;
  
 

  constructor(
     id: ID,
    period: TimePeriod,
    roomId: string,
    customerId: string,
    data: {
      date: string;
      occupancyRate: number;
      totalSpace: number;
      occupiedSpaces: number;
    }[],
    summary: {
      averageOccupancy: number;
      peakOccupancy: number;
      lowOccupancy: number;
      growthRate: number;
    },
   
  ) {
    this.id = id||undefined;
    this.period = period;
    this.roomId = roomId;
    this.customerId = customerId;
    this.data = data;
   
  }
  period: TimePeriod;

  toDatabaseFormat() {
    return {
      period: this.period,
      room_id: this.roomId,
      customer_id: this.customerId,
      data: this.data,
      summary: this.summary,
      
    };
  }
}










