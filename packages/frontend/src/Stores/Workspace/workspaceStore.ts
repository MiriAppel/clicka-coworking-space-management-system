import {create} from "zustand";
import axios from "axios";
import {Space} from "shared-types"

interface WorkSpaceState {
    workSpaces: Space[];
    getAllSpaces: () => Promise<void>;
    updateSpace: (workspace:Space) => Promise<void>;
    addSpace: (workspace:Space) => Promise<void>;
    deleteSpace: (workspace:Space) => Promise<void>;
    getMapByOcoupancy: (date: Date) => Promise<void>;
}

export const useWorkSpaceStore = create<WorkSpaceState>((set) => ({
    workSpaces: [],
    getAllSpaces: async () => {
        try {
            const response = await axios.get('api/workspace/getAllWorkspace');
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    updateSpace: async (workspace) => {
        try {
            const response = await axios.put('http://localhost:3001/api/workspace/update/updateSpace');
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    addSpace: async (workspace) => {
        try {
            const response = await axios.post('http://localhost:3001/api/workspace/update/updateSpace');
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    deleteSpace: async (workspace) => {
        try {
            const response = await axios.delete('http://localhost:3001/api/workspace/delete/deleteSpace');
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
    getMapByOcoupancy: async (workspace) => {
        try {
            const response = await axios.delete('http://localhost:3001/api/workspace/delete/deleteSpace');
            set({ workSpaces: response.data });
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },
}));


