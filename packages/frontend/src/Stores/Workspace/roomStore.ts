import {create} from "zustand";
import axios from "axios";
import {ID, Room} from "shared-types";
import axiosInstance from "../../Service/Axios";

interface RoomState {
    rooms: Room[];
    currentBooking: Room | null;
    loading: boolean;
    error: string | null;
    getAllRooms: () => Promise<{ id: string; name: string }[]>;
}

export const useRoomStore = create<RoomState>((set, get) => ({
rooms:[],
currentBooking: null,
loading: false,
error: null,
    //get all rooms
    getAllRooms: async (): Promise<{ id: string; name: string }[]> => {
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.get('/rooms/getAllRooms');
          set({ rooms: response.data, loading: false });
          return response.data;
        } catch (error) {
          set({ error: 'שגיאה בשליפת רשימת חדרים', loading: false });
          return [];
        }
      },
}));
// import {create} from "zustand";
// import axios from "axios";
// import {ID, Room} from "shared-types";


// interface RoomState {
//   rooms: Room[];
//     getAllRooms: () => Promise<void>;
// }

// export const useRoomStore = create<RoomState>((set, get) => ({

// rooms:[],

//     //get all rooms
//     getAllRooms: async () => {
//         try {
//             // const response = await axios.get('api/rooms/getAllRooms');
//             const response = await axios.get('rooms/getAllRooms');
//             set({ rooms: response.data });
//         } catch (error){
//              console.error('Error fetching rooms:', error);
//         }
//     },

// }));