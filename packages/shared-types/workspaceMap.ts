  import {MapLayout} from '../shared-types/'
  import {SpaceModel} from '../backend/src/models/Workspace'
  import {ID,DateISO} from 'core'
  export interface WorkspaceMap {
  id?: ID;
  name: string;
  layout: MapLayout;
  workspaces: SpaceModel[];
  rooms:Room[];
  lastUpdated: DateISO;
  }