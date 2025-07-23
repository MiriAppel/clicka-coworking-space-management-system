import {create} from "zustand";
import axios from "axios";
import {ID, Space} from "shared-types"

//הצהרות
interface WorkSpaceState {
    workSpaces: Space[];
    getAllWorkspace: () => Promise<void>;
     getWorkspaceById: (id:ID) => Promise<void>;
    updateWorkspace: (workspace:Space,id:ID) => Promise<void>;
    createWorkspace: (workspace:Space) => Promise<void>;
    deleteWorkspace: (id:ID) => Promise<void>;
    getHistory: (date: Date) => Promise<void>;
}

//מימוש הפונקציות
export const useWorkSpaceStore = create<WorkSpaceState>((set) => ({
    workSpaces: [],
    //get all spaces
    getAllWorkspace: async () => {
        try {
            const response = await axios.get('api/workspace/getAllWorkspace');
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
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
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    //add space
    createWorkspace: async (workspace) => {
        try {
            const response = await axios.post('api/workspace/createWorkspace',workspace);
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    //delete space
    deleteWorkspace: async (id) => {
        try {
            const response = await axios.delete(`api/workspace/deleteWorkspace/${id}`);
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    //get map by occupancy
    getHistory: async (date: Date) => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            console.log('Sending date to API:', formattedDate);
            
            const response = await axios.get(`api/occupancy/getHistory/${formattedDate}`); 
            set({ workSpaces: response.data || []});
            
        } catch (error) {
            console.error('Error fetching work spaces:', error);
            set({workSpaces: []});
        }
    },
}));


