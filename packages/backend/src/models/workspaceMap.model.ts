import { ID, DateISO } from '../../../../types/core';
import {MapLayout} from '../../../../types/mapLayout'
import { Room } from './room.model';

export class WorkspaceMapModel {
  id: ID;
  name: string;
  layout: MapLayout;
  workspaces: WorkspaceModel[];
  rooms:Room[];
  lastUpdated: DateISO;

  constructor(id: ID,name: string, layout: MapLayout, workspaces: WorkspaceModel[], lastUpdated: DateISO) {
    this.id = id;
    this.name = name;
    this.layout = layout;
    this.workspaces = workspaces;
    this.rooms = [];
    this.lastUpdated = lastUpdated;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      name: this.name,
       layout: this.layout,
      workspaces: this.workspaces.map(w => w.toDatabaseFormat()),
      rooms: this.rooms.map(r => r.toDatabaseFormat()),
      lastUpdated: this.lastUpdated,
    };
  }
}
