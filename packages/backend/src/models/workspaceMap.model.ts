import type{ DateISO, ID, SpaceStatus, WorkspaceType } from "shared-types";
import { WorkspaceMapItem } from "./workspaceMapItem.model";

export interface MapLayout {
  width: number;
  height: number;
  backgroundImage?: string;
  scale: number;
  viewBox: string;
}
export interface MapCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}
export interface MapFilters {

workspaceTypes: WorkspaceType[];
  statuses: SpaceStatus[];
  showOccupantNames: boolean;
  showAvailableOnly: boolean;
}
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
       layout: this.layout,
      workspaces: this.workspaces.map(w => w.toDatabaseFormat()),
      lastUpdated: this.lastUpdated,
    };
  }
}
