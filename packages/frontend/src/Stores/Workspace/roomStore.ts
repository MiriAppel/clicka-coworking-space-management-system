import {create} from "zustand";
import axiosInstance from "../../Service/Axios";
import {Room} from "shared-types";


interface RoomState {
  rooms: Room[];
  getAllRooms: () => Promise<void>;
  loading: boolean;
  error: string | null;
  createRoom: (room: Partial<Room>) => Promise<void>;
   updateRoom: (id: string, room: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set, get) => ({

rooms:[],
loading: false,
error: null,
    //get all rooms
    getAllRooms: async () => {
        try {
            const response = await axiosInstance.get('rooms/getAllRooms');
            set({ rooms: response.data });
        } catch (error){
             console.error('Error fetching rooms:', error);
        }
    },
  createRoom: async (room) => {
        try {
            // const response = await axios.post('api/workspace/createWorkspace',workspace);
            const response = await axiosInstance.post('/rooms/createRoom',room);
            set((state) => ({
                rooms: [...state.rooms, response.data]
            }));
        } catch (error) {
            console.error('Error fetching work spaces:', error);
        }
    },

 updateRoom: async (id,room) => {
        try {
            const response = await axiosInstance.put(`rooms/updateRoom/${id}`, room);
            set((state) => ({
                rooms: state.rooms.map((r) =>
                   r.id === id ? response.data : r
                )
            }));
        } catch (error) {
            console.error('Error updating workspace:', error);
        }
    },
deleteRoom: async (id) => {
        try {
            await axiosInstance.delete(`rooms/deleteRoom/${id}`);
            set((state) => ({
                rooms: state.rooms.filter((r) => r.id !== id)
            }));
        } catch (error) {
            console.error('Error deleting workspace:', error);
        }
    },
}));

