export class MapLayout {
  width: number;
  height: number;
  backgroundImage?: string;
  scale: number;
  viewBox: string;


  constructor(width: number, height: number, backgroundImage?: string, scale: number = 1, viewBox: string = `0 0 ${width} ${height}`) {
   this.width = width;
   this.height = height;   
   this.backgroundImage = backgroundImage;
   this.scale = scale;
   this.viewBox = viewBox;
  }
  toDatabaseFormat() {
    return {
    width: this.width,
    height: this.height,    
    backgroundImage: this.backgroundImage,
    scale: this.scale,  
    viewBox: this.viewBox
    };
  }
}