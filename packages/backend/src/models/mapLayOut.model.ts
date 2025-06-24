import { MapLayout } from "../../../../types/mapLayout";

export class MapLayoutModel implements MapLayout {
  width: number;
  height: number;
  backgroundImage?: string;
  scale: number;
  viewBox: string;
  	constructor(params: {
	 width: number;
    height: number;
    backgroundImage: string;
    scale: number;
    viewBox: string;
    syncErrors?: string[];
	}) {
	this.width = params.width;
    this.height = params.height;
    this.backgroundImage = params.backgroundImage;
    this.scale = params.scale;
    this.viewBox = params.viewBox;
    
  }
 

  toDatabaseFormat() {
	  return {
	  width: this.width,
      height: this.height,
      backgroundImage: this.backgroundImage,
      scale: this.scale,
      viewBox: this.viewBox,
      
    };
  }
}
