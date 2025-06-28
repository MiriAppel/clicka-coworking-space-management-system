  import {MapLayout} from './mapLayout'
  // import {SpaceModel} from '../../backend/src/models/workspace.model';
  import {ID,DateISO} from './core'
import { Room } from './booking';
  export interface WorkspaceMap {
  id?: ID;
  name: string;
  layout: MapLayout;
  // workspaces: SpaceModel[];
  rooms:Room[];
  lastUpdated: DateISO;
  }