import { ID } from "shared-types";
import { WorkspaceType } from "shared-types";
import { Space, SpaceStatus } from "shared-types/workspace";


export class WorkspaceModel implements Space {
  id?: ID;
  workspaceMapId?: ID; // אם יש צורך בשדה ייחודי נוסף
  name: string;
  description?: string;
  type: WorkspaceType;
  status: SpaceStatus;
  // room?: string;
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
    workspaceMapId?: ID; // אם יש צורך בשדה ייחודי נוסף
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
    this.workspaceMapId = params.workspaceMapId || undefined; // אם יש צורך בשדה ייחודי נוסף
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
    // this.room = params.room;
    this.currentCustomerId = params.currentCustomerId;
    this.currentCustomerName = params.currentCustomerName;
  }

  toDatabaseFormat() {
    return {
      workspace_map_id: this.workspaceMapId,
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
      // room: this.room,
      current_customer_id: this.currentCustomerId,
      current_customer_name: this.currentCustomerName,
    };
  }
       static fromDatabaseFormat(dbData: any): WorkspaceModel { {
        return new WorkspaceModel({
            id: dbData.id,
            name: dbData.name,
            type: dbData.type,
            status: dbData.status,
            positionX: dbData.position_x,
            positionY: dbData.position_y,
            width: dbData.width,
            height: dbData.height,
            createdAt: dbData.created_at,
            updatedAt: dbData.updated_at,
            description: dbData.description || undefined,
            // room: dbData.room || undefined,
            currentCustomerId: dbData.current_customer_id || undefined,
            currentCustomerName: dbData.current_customer_name || undefined
        });
    }
    }
    static fromDatabaseFormatArray(dbDataArray: any[] ): WorkspaceModel[] {
        return dbDataArray.map(dbData => WorkspaceModel.fromDatabaseFormat(dbData));
    }
}
