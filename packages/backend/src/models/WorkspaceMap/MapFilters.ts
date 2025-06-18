
import { SpaceStatus} from "../../types/workspace";
import { WorkspaceType } from "../../types/customer";
export class MapFilters {

workspaceTypes: WorkspaceType[];
  statuses: SpaceStatus[];
  showOccupantNames: boolean;
  showAvailableOnly: boolean;
    constructor(workspaceTypes: WorkspaceType[] = [], statuses: SpaceStatus[] = [], showOccupantNames: boolean = false, showAvailableOnly: boolean = false) {
      this.workspaceTypes = workspaceTypes;
     this.statuses = statuses;
      this.showOccupantNames = showOccupantNames;
        this.showAvailableOnly = showAvailableOnly;
    }
  
    toDatabaseFormat() {
      return {
        workspaceTypes: this.workspaceTypes,
        statuses: this.statuses,
        showOccupantNames: this.showOccupantNames,
        showAvailableOnly: this.showAvailableOnly,
        
      };
}

}