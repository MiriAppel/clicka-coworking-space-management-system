import type{ DateISO, ID, SpaceStatus, WorkspaceType } from 'shared-types';
import { MapCoordinates } from './workspaceMap.model';
export class WorkspaceMapItem {
  workspaceMapId: ID;
  workspaceId: ID;
  coordinates: MapCoordinates;
  status: SpaceStatus;
  type: WorkspaceType;
  occupant?: {
    name: string;
    since: DateISO;
}

  constructor(workspaceMapId: ID,workspaceId: ID, coordinates: MapCoordinates, status: SpaceStatus, type: WorkspaceType, occupant?: { name: string; since: DateISO }) {
    this.workspaceId = workspaceId;
    this.workspaceMapId=workspaceMapId;
    this.coordinates = coordinates;
    this.status = status;
    this.type = type;
    this.occupant = occupant;
  }

toDatabaseFormat() {
  return {
    workspaceMapId: this.workspaceMapId,
    workspaceId: this.workspaceId,
    coordinates: this.coordinates, 
    status: this.status,
    type: this.type,
    occupant: this.occupant
      ? {
          name: this.occupant.name,
          since: this.occupant.since
        }
      : undefined
  };
}

  }
    

