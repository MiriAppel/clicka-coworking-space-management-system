import { WorkspaceMap } from 'shared-types/workspaceMap';
import {MapLayout} from 'shared-types/mapLayout'
import { RoomModel } from './room.model';
import type{ DateISO, ID, SpaceStatus, WorkspaceType } from "shared-types";
import{SpaceModel}from './Workspace '

export class WorkspaceMapModel implements WorkspaceMap {
  id?: ID;
  name: string;
  layout: MapLayout;
  workspaces: SpaceModel[];
  rooms:RoomModel[];
  lastUpdated: DateISO;

  constructor(id: ID,name: string, layout: MapLayout, workspaces: SpaceModel[], lastUpdated: DateISO) {
    this.id = id;
    this.name = name;
    this.layout = layout;
    this.workspaces = workspaces;
    this.rooms = [];
    this.lastUpdated = lastUpdated;
  }

  toDatabaseFormat() {
    return {
      name: this.name,
       layout: this.layout,
      workspaces: this.workspaces.map(w => w.toDatabaseFormat()),
      rooms: this.rooms.map(r => r.toDatabaseFormat()),
      last_updated: this.lastUpdated,
    };
  }

}
