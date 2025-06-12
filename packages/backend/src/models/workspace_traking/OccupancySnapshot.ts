import { ID, DateISO,WorkSpaceType } from "../core";

export class OccupancySnapshot {
  id: ID;
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

  constructor(
    id: ID,
    date: DateISO,
    totalSpace: number,
    OccupiendSpaces: number,
    availableSpaces: number,
    OccupancyRate: number,
    BreakDown: {
      [key in WorkSpaceType]: {
        total: number;
        occupied: number;
        occupancyRate: number;
      };
    },
    createdAt: DateISO
  ) {
    this.id = id;
    this.date = date;
    this.totalSpace = totalSpace;
    this.OccupiendSpaces = OccupiendSpaces;
    this.availableSpaces = availableSpaces;
    this.OccupancyRate = OccupancyRate;
    this.BreakDown = BreakDown;
    this.createdAt = createdAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      date: this.date,
      totalSpace: this.totalSpace,
      OccupiendSpaces: this.OccupiendSpaces,
      availableSpaces: this.availableSpaces,
      OccupancyRate: this.OccupancyRate,
      BreakDown: this.BreakDown,
      createdAt: this.createdAt,
    };
  }
}

  