import { TimePeriod, OccupancyTrend, OccupancyAlert, StatusOccupancy, WorkSpaceType } from '../../../../types/occupancy';
import { ID, DateISO } from '../../../../types/core';

export class OccupancyTrendModel implements OccupancyTrend, OccupancyAlert {
  period: TimePeriod;
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
  };
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
    id: ID,
    type: StatusOccupancy,
    threshold: number,
    currentValue: number,
    workspaceType: WorkSpaceType,
    isActive: boolean,
    triggeredAt: DateISO
  ) {
    this.period = period;
    this.roomId = roomId;
    this.customerId = customerId;
    this.data = data;
    this.summary = summary;

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
      data: this.data,
      summary: this.summary,
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