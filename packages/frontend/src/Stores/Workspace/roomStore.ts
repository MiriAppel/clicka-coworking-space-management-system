import {create} from "zustand";
import axiosInstance from "../../Service/Axios";
import {Room} from "shared-types";


interface RoomState {
  rooms: Room[];
  getAllRooms: () => Promise<void>;
}

export const useRoomStore = create<RoomState>((set, get) => ({

rooms:[],

    //get all rooms
    getAllRooms: async () => {
        try {
            const response = await axiosInstance.get('rooms/getAllRooms');
            set({ rooms: response.data });
        } catch (error){
             console.error('Error fetching rooms:', error);
        }
    },

}));