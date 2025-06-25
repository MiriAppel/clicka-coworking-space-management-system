import type { ID, DateISO, SpaceStatus, WorkspaceType } from "shared-types";

export class SpaceModel {
  id?: ID;
  name: string;
  description?: string;
  type: WorkspaceType;
  status: SpaceStatus;
  room?: string;
  currentCustomerId?: ID;
  currentCustomerName?: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: ID,
    name: string,
    description: string,
    type: WorkspaceType,
    status: SpaceStatus,
    room: string | undefined,
    currentCustomerId: ID | undefined,
    currentCustomerName: string | undefined,
    positionX: number,
    positionY: number,
    width: number,
    height: number,
    createdAt: DateISO,
    updatedAt: DateISO
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.status = status;
    this.room = room;
    this.currentCustomerId = currentCustomerId;
    this.currentCustomerName = currentCustomerName;
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.height = height;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat() {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      status: this.status,
      room: this.room,
      currentCustomerId: this.currentCustomerId,
      currentCustomerName: this.currentCustomerName,
      positionX: this.positionX,
      positionY: this.positionY,
      width: this.width,
      height: this.height,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
