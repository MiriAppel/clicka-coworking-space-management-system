import { MapLayout } from "shared-types/src/mapLayout";

export class MapLayoutModel implements MapLayout {
  id?: string;
  workspaceMapid: string;
  width: number;
  height: number;
  backgroundImage?: string;
  scale: number;
  viewBox: string;
  	constructor(params: {
       id?: string;
  workspaceMapid: string;
	 width: number;
    height: number;
    backgroundImage: string;
    scale: number;
    viewBox: string;
    syncErrors?: string[];
	}) {
    this.id = params.id;
    this.workspaceMapid = params.workspaceMapid;
	this.width = params.width;
    this.height = params.height;
    this.backgroundImage = params.backgroundImage;
    this.scale = params.scale;
    this.viewBox = params.viewBox;
    
  }
 

  toDatabaseFormat() {
	  return {
     workspace_mapid:this.workspaceMapid,
	  width: this.width,
      height: this.height,
      background_image: this.backgroundImage,
      scale: this.scale,
      viewBox: this.viewBox,
      
    };
  }
}
