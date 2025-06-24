import  {WorkspaceType}  from "./customer";
import {SpaceStatus} from "./workspace";
 export interface MapFilter {
 workspaceTypes: WorkspaceType[];
  statuses: SpaceStatus[];
  showOccupantNames: boolean;
  showAvailableOnly: boolean;
 }