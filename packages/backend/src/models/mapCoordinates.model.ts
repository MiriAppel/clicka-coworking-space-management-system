import { MapCoordinates } from 'shared-types/src/mapCoordinates';

export class MapCoordinatesModel implements MapCoordinates {
  id?: string;
  workspaceMapid:string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  constructor(params: {
    id?: string;
    workspaceMapid:string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  }) {
    this.id = params.id;
    this.workspaceMapid = params.workspaceMapid;
    this.x = params.x;
    this.y = params.y;
    this.width = params.width;
    this.height = params.height;
    this.rotation = params.rotation;
  }
    toDatabaseFormat() {
    return {
      workspace_map: this.workspaceMapid,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: this.rotation
}}
}