<<<<<<< HEAD
import { ID, DateISO } from '../../../../types/core';
import {MapLayout} from '../../../../types/mapLayout'
import { Room } from './room.model';
=======
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
>>>>>>> c87559f51ec16ab5ae4f8105ad6ad1b70185d243

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
