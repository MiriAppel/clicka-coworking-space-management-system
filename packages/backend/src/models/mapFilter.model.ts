import  {WorkspaceType}  from "../../../../types/customer";
import {SpaceStatus} from "../../../../types/workspace";
import {MapFilter} from "../../../../types/mapFilter";
export class MapFilterModel implements MapFilter {
  workspaceTypes: WorkspaceType[];
  statuses: SpaceStatus[];
  showOccupantNames: boolean;
  showAvailableOnly: boolean;
    constructor(params: {
        workspaceTypes: WorkspaceType[];
        statuses: SpaceStatus[];
        showOccupantNames: boolean;
        showAvailableOnly: boolean;
    }) {
        this.workspaceTypes = params.workspaceTypes;
        this.statuses = params.statuses;
        this.showOccupantNames = params.showOccupantNames;
        this.showAvailableOnly = params.showAvailableOnly;
    }
}