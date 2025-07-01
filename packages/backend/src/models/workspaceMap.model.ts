import { WorkspaceMap} from 'shared-types/workspaceMap';
import {MapLayout} from 'shared-types/mapLayout'
import { RoomModel } from './room.model';
import type{ DateISO, ID } from "shared-types/core";
// import{SpaceModel}from '../../../shared-types/src/workspaceMap'

export class WorkspaceMapModel implements WorkspaceMap {
  id?: ID;
  name: string;
  lastUpdated: DateISO;
  // workspaces: SpaceModel[],
  constructor(id: ID,name: string, layout: MapLayout,  lastUpdated: DateISO) {
    this.id = id;
    this.name = name;
    this.lastUpdated = lastUpdated;
  }

  toDatabaseFormat() {
    return {
      name: this.name,
      last_updated: this.lastUpdated,
    };
  }

}
