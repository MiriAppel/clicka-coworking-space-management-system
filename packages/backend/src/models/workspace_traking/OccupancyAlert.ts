import { ID, DateISO ,statusOccupancy,WorkSpaceType} from "../core";
export class OccupancyAlert{
    id:ID;
    type:statusOccupancy;
    threshold:number;
    currentValue:number;
    workspaceType:WorkSpaceType;
    isActive:boolean;
    triggeredAT:DateISO;
constructor(id:ID,
    type:statusOccupancy,
    threshold:number,
    currentValue:number,
    workspaceType:WorkSpaceType,
    isActive:boolean,
    triggeredAT:DateISO){
        this.id=id;
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
        type:this.type,
        threshold:this.threshold,
        currentValue:this.currentValue,
        workspaceType:this.workspaceType,
        isActive:this.isActive,
        triggeredAT:this.triggeredAT
    };
  }
}