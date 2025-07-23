import {create} from "zustand";
import axios from "axios";
import {ID, Room, Space, SpaceStatus} from "shared-types";
import { get } from "lodash";

//הצהרות
interface WorkSpaceState {
    workSpaces: Space[];
    rooms: Room[];
    getAllWorkspace: () => Promise<void>;
    getAllRooms: () => Promise<void>;
    getWorkspaceById: (id:ID) => Promise<void>;
    updateWorkspace: (workspace:Space,id:ID) => Promise<void>;
    createWorkspace: (workspace:Space) => Promise<void>;
    deleteWorkspace: (id:ID) => Promise<void>;
    getWorkspaceHistory: (date: Date) => Promise<void>;
}

//מימוש הפונקציות
export const useWorkSpaceStore = create<WorkSpaceState>((set,get) => ({
    workSpaces: [],
    rooms: [],
    //get all spaces
    getAllWorkspace: async () => {
        try {
            const response = await axios.get('api/workspace/getAllWorkspace');
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    //get all rooms
    getAllRooms: async () => {
        try {
            const response = await axios.get('api/rooms/getAllRooms');
            set({ rooms: response.data });
        } catch (error){
             console.error('Error fetching rooms:', error);
        }
    },
    //get by id
     getWorkspaceById: async (id) => {
        try {
            const response = await axios.get(`api/workspace/getWorkspaceById/${id}`);
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    //update space
    updateWorkspace: async (workspace,id) => {
        try {
            const response = await axios.put(`api/workspace/updateWorkspace/${id}`,workspace);
            const all = await axios.get('api/workspace/getAllWorkspace');
            set({ workSpaces: all.data });
            //  set({ workSpaces: Array.isArray(response.data) ? response.data : [response.data] });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    //add space
    createWorkspace: async (workspace) => {
        try {
            const response = await axios.post('api/workspace/createWorkspace',workspace);
            const all = await axios.get('api/workspace/getAllWorkspace');
            set({ workSpaces: all.data });
            // set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    //delete space
    deleteWorkspace: async (id) => {
        try {
            const response = await axios.delete(`api/workspace/deleteWorkspace/${id}`);
            const all = await axios.get('api/workspace/getAllWorkspace');
            set({ workSpaces: all.data });
            // set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
getWorkspaceHistory: async (date: Date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    console.log('Sending date to API:', formattedDate);

    const response = await axios.get<Space[]>(`api/space/getHistory/${formattedDate}`);
    const serverData = response.data;

    const { workSpaces: localData } = get();

    const mergedData: Space[] = [...serverData];

    localData.forEach(localItem => {
      const exists = serverData.some(serverItem => serverItem.id === localItem.id);
      if (!exists) {
        const { currentCustomerId, currentCustomerName, ...rest } = localItem;
        mergedData.push({
          ...rest,
          currentCustomerId: '',
          currentCustomerName: '',
          status: rest.type === 'BASE' ? SpaceStatus.NONE : SpaceStatus.AVAILABLE,
        });
      }
    });

    set({ workSpaces: mergedData });
  } catch (error) {
    console.error('Error fetching work spaces:', error);
    set({ workSpaces: [] });
  }
}



}));


