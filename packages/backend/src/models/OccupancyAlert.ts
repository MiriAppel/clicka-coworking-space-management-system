import { ID, DateISO ,} from "../../../../types/core";
import { WorkspaceType } from "../../../../types/customer";
import { Room } from "./Room";
export class OccupancyAlert{
    id:ID;
    roomid!:string;
    customerid:string | undefined;
    type:statusOccupancy;
    threshold:number;
    currentValue:number;
    workspaceType:WorkspaceType;
    isActive:boolean;
    triggeredAT:DateISO;
      // קשר: התראה שייכת לחדר אחד
  room?: Room;
constructor(id:ID,
    roomid:string,
    customerid:string,
    type:statusOccupancy,
    threshold:number,
    currentValue:number,
    workspaceType:WorkspaceType,
    isActive:boolean,
    triggeredAT:DateISO){
        this.id=id;
        this.roomid=roomid;
        this.customerid=customerid;
        this.type=type;
        this.threshold=threshold;
        this.currentValue=currentValue;
        this.workspaceType=workspaceType;
        this.isActive=isActive;
        this.triggeredAT=triggeredAT;
}
toDatabaseFormat() {
    return {
        id: this.id,
        roomid:this.roomid,
        customerid:this.customerid,
        type:this.type,
        threshold:this.threshold,
        currentValue:this.currentValue,
        workspaceType:this.workspaceType,
        isActive:this.isActive,
        triggeredAT:this.triggeredAT
    };
  }
}