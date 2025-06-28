// import { TimePeriod,  StatusOccupancy, WorkSpaceType } from 'frontend/occupancy';
import { ID, DateISO } from 'shared-types/core';
import { OccupancyTrend, OccupancyAlert, TimePeriod, StatusOccupancy, WorkSpaceType }from 'shared-types/src/occupancy'

export class OccupancyTrendModel implements OccupancyTrend, OccupancyAlert {
  // ---- OccupancyTrend ----
  period: TimePeriod;
  roomId: string;
  customerId: string;
  date: string;
  occupancyRate: number;
  totalSpace: number;
  occupiedSpaces: number;
  averageOccupancy: number;
  peakOccupancy: number;
  lowOccupancy: number;
  growthRate: number;
  // ---- OccupancyAlert ----
  id: ID;
  type: StatusOccupancy;
  threshold: number;
  currentValue: number;
  workspaceType: WorkSpaceType;
  isActive: boolean;
  triggeredAt: DateISO;
  constructor(
    period: TimePeriod,
    roomId: string,
    customerId: string,
    date: string,
    occupancyRate: number,
    totalSpace: number,
    occupiedSpaces: number,
    averageOccupancy: number,
    peakOccupancy: number,
    lowOccupancy: number,
    growthRate: number,
    id: ID,
    type: StatusOccupancy,
    threshold: number,
    currentValue: number,
    workspaceType: WorkSpaceType,
    isActive: boolean,
    triggeredAt: DateISO
  ) {
    // Trend
    this.period = period;
    this.roomId = roomId;
    this.customerId = customerId;
    this.date = date;
    this.occupancyRate = occupancyRate;
    this.totalSpace = totalSpace;
    this.occupiedSpaces = occupiedSpaces;
    this.averageOccupancy = averageOccupancy;
    this.peakOccupancy = peakOccupancy;
    this.lowOccupancy = lowOccupancy;
    this.growthRate = growthRate;
    // Alert
    this.id = id;
    this.type = type;
    this.threshold = threshold;
    this.currentValue = currentValue;
    this.workspaceType = workspaceType;
    this.isActive = isActive;
    this.triggeredAt = triggeredAt;
  }
  toDatabaseFormat() {
    return {
      period: this.period,
      roomId: this.roomId,
      customerId: this.customerId,
      date: this.date,
      occupancyRate: this.occupancyRate,
      totalSpace: this.totalSpace,
      occupiedSpaces: this.occupiedSpaces,
      averageOccupancy: this.averageOccupancy,
      peakOccupancy: this.peakOccupancy,
      lowOccupancy: this.lowOccupancy,
      growthRate: this.growthRate,
      id: this.id,
      type: this.type,
      threshold: this.threshold,
      currentValue: this.currentValue,
      workspaceType: this.workspaceType,
      isActive: this.isActive,
      triggeredAt: this.triggeredAt,
    };
  }
}