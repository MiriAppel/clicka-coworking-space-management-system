import { MapCoordinates } from '../../../../types/mapCoordinates';

export class MapCoordinatesModel implements MapCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  constructor(params: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  }) {
    this.x = params.x;
    this.y = params.y;
    this.width = params.width;
    this.height = params.height;
    this.rotation = params.rotation;
  }
}