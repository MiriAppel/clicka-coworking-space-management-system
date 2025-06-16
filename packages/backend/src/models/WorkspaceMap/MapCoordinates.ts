export class MapCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;


  constructor(x: number, y: number, width: number, height: number, rotation?: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
   
  }
   toDatabaseFormat() {
    return {
   x: this.x,
   y: this.y,
    width: this.width,  
    height: this.height,
    rotation: this.rotation
    };
}

}