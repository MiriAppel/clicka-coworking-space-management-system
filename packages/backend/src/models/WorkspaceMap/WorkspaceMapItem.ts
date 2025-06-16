import { ID, DateISO } from '../core';

import{MapCoordinates} from './MapCoordinates';
import { SpaceStatus,WorkspaceType } from '../core'
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
    coordinates: this.coordinates.toDatabaseFormat(), 
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
    

