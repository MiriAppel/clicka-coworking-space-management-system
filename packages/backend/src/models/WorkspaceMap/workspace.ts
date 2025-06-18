

import { MapLayout } from './MapLayout ';
import { ID, DateISO } from '../../types/core';

import{WorkspaceMapItem} from './WorkspaceMapItem';

export class WorkspaceMapModel {
  id: ID;
  name: string;
 layout: MapLayout;
  workspaces: WorkspaceMapItem[];
  lastUpdated: DateISO;


  constructor(id: ID,name: string, layout: MapLayout, workspaces: WorkspaceMapItem[], lastUpdated: DateISO) {
    this.id = id;
    this.name = name;
    this.layout = layout;
    this.workspaces = workspaces;
    this.lastUpdated = lastUpdated;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      name: this.name,
       layout: this.layout.toDatabaseFormat(),
      workspaces: this.workspaces.map(w => w.toDatabaseFormat()),
      lastUpdated: this.lastUpdated,
    };
  }
}
