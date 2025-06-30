import { MapLayout } from './mapLayout';
import { ID, DateISO } from './core';
import { Room } from './booking';
export interface WorkspaceMap {
    id?: ID;
    name: string;
    layout: MapLayout;
    rooms: Room[];
    lastUpdated: DateISO;
}
