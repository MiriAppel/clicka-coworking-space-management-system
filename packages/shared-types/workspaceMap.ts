<<<<<<< HEAD

  import {ID,DateISO} from './core';
  export interface WorkspaceMap {
  id?: ID;
  name: string;
=======
  import {MapLayout} from './mapLayout';
  // import {SpaceModel} from '../../backend/src/models/workspace.model';
  import {ID,DateISO} from './core'
import { Room } from './booking';
  export interface WorkspaceMap {
  id?: ID;
  name: string;
  layout: MapLayout;
  // workspaces: SpaceModel[];
  rooms:Room[];
>>>>>>> ff367ee9a065d3e84a1c2b37e7f87defb917cb8d
  lastUpdated: DateISO;
  }