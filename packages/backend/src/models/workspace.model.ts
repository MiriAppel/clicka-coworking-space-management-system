import { ID } from "shared-types";
import { WorkspaceType } from "shared-types";
import { Space, SpaceStatus } from "shared-types";


export class WorkspaceModel implements Space {
  id?: ID;
  name: string;
  description?: string;
  type: WorkspaceType;
  status: SpaceStatus;
  room?: string;
  // מידע על שוכר נוכחי (אם קיים)
  currentCustomerId?: ID;
  currentCustomerName?: string;
  // מיקום סביבת העבודה במפה
  positionX: number;
  positionY: number;
  // ממדי סביבת העבודה
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;

  constructor(params: {
    id: string;
    name: string;
    type: WorkspaceType;
    status: SpaceStatus;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
    description?: string;
    room?: string;
    currentCustomerId?: string;
    currentCustomerName?: string;
  }) {
    this.id = params.id|| undefined;
    this.name = params.name;
    this.type = params.type;
    this.status = params.status;
    this.positionX = params.positionX;
    this.positionY = params.positionY;
    this.width = params.width;
    this.height = params.height;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.description = params.description;
    this.room = params.room;
    this.currentCustomerId = params.currentCustomerId;
    this.currentCustomerName = params.currentCustomerName;
  }

  toDatabaseFormat() {
    return {
      name: this.name,
      type: this.type,
      status: this.status,
      position_x: this.positionX,
      position_y: this.positionY,
      width: this.width,
      height: this.height,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      description: this.description,
      room: this.room,
      current_customer_id: this.currentCustomerId,
      current_customer_name: this.currentCustomerName,
    };
  }
}