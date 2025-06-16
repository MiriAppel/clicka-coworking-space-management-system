import { ID, DateISO,WorkSpaceType } from "../core";
import { Room } from "../workspace_room/Room";
export class OccupancySnapshot {
  id: ID;
  customerId:string | undefined;
  roomid!:string;
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
  // קשר: snapshot שייך לחדר אחד
  room?: Room;
  constructor(
    id: ID,
    customerId:string,
    roomid:string,
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
    this.customerId=customerId;
    this.roomid=roomid;
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
      customerId:this.customerId,
      roomid:this.roomid,
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

  