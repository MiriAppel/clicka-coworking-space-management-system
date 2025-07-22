import { create } from "zustand";
import axios from "axios";
import { ID, Room, Space, SpaceStatus } from "shared-types";
import { get } from "lodash";
//הצהרות
interface WorkspaceState {
    rooms: Room[];
    workspaces: Space[];
    getAllWorkspace: () => Promise<Space[]>;
    updateWorkspace: (workspace: Space) => Promise<void>;
    createWorkspace: (workspace: Space) => Promise<void>;
    deleteWorkspace: (workspace: Space) => Promise<void>;
    getAllRooms: () => Promise<void>;
    getHistory: (date: Date) => Promise<void>;
}
//מימוש הפונקציות
export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    workspaces: [],
    rooms: [],
    getAllWorkspace: async (): Promise<Space[]> => {

        console.log("📡 ***************************************************Fetching workspaces from API...");



        try {
            const response = await axios.get('http://localhost:3001/api/workspace/getAllWorkspace');
            set({ workspaces: response.data });
            return response.data;
        } catch (error) {
            console.error('Error fetching workspaces:', error);
            return [];
        }
    },

    updateWorkspace: async (workspace: Space) => {
        try {
            const response = await axios.put(`http://localhost:3001/api/workspace/updateWorkspace/${workspace.id}`, workspace);
            set((state) => ({
                workspaces: state.workspaces.map((w) => (w.id === workspace.id ? response.data : w)),
            }));
        } catch (error) {
            console.error('Error updating workspace:', error);
        }
    },


    createWorkspace: async (workspace: Space) => {
        try {
            console.log("📡 Adding new workspace to API:", workspace);
            const response = await axios.post('http://localhost:3001/api/workspace/createWorkspace', workspace);
            set((state) => ({
                workspaces: [...state.workspaces, response.data],
            }));
            console.log("Workspace added successfully:", response.data);
        } catch (error) {
            console.error("Error adding workspace:", error);
        }
    },



    deleteWorkspace: async (workspace: Space) => {
        try {
            await axios.delete(`http://localhost:3001/api/workspace/deleteWorkspace/${workspace.id}`);
            set((state) => ({
                workspaces: state.workspaces.filter((w) => w.id !== workspace.id),
            }));
        } catch (error) {
            console.error('Error deleting workspace:', error);
        }
    },

    //get all rooms
    getAllRooms: async () => {
        try {
            const response = await axios.get('api/rooms/getAllRooms');
            set({ rooms: response.data });
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    },

    getHistory: async (date: Date) => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            console.log('Sending date to API:', formattedDate);

            const response = await axios.get(`api/occupancy/getHistory/${formattedDate}`);
            set({ workspaces: response.data || [] });

        } catch (error) {
            console.error('Error fetching work spaces:', error);
            set({ workspaces: [] });
        }
    },
}));