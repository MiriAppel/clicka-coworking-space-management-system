import { create } from 'zustand';
import { Booking } from 'shared-types/booking';
import axiosInstance from '../../Service/Axios';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;

  // CRUD actions
  getAllBookings: () => Promise<void>;
  getBookingById: (id: string) => Promise<Booking | null>;
  createBooking: (booking: Booking) => Promise<Booking | null>;
  createBookingInCalendar: (booking: Booking,calendarId:string) => Promise<Booking | null>;
  updateBooking: (id: string, updated: Booking) => Promise<Booking | null>;
  deleteBooking: (id: string) => Promise<boolean>;
  setCurrentBooking: (booking: Booking | null) => void;
  clearError: () => void;
  getCustomerByPhoneOrEmail: (value: string) => Promise<any>;
  getAllRooms: () => Promise<{ id: string; name: string }[]>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  getAllBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get<Booking[]>('/api/bookings/getAllBooking');
      set({ bookings: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      set({ error: 'שגיאה בשליפת כל ההזמנות', loading: false });
    }
  },

  getBookingById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get<Booking>(`/api/bookings/getBookingById/${id}`);
      set({ currentBooking: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      set({ error: 'שגיאה בשליפת ההזמנה לפי מזהה', loading: false });
      return null;
    }
  },

  createBooking: async (booking: Booking) => {
    set({ loading: true, error: null });
    try {
      // מוודאים שה־payload נכון
      const response = await axiosInstance.post("/book", booking);
      const created = response.data;

      set(state => ({
        bookings: [...state.bookings, created],
        loading: false,
      }));

      return created;
    } catch (error) {
      console.error('Error creating booking:', error);
      set({ error: 'שגיאה ביצירת הזמנה', loading: false });
      return null;
    }
  },
  createBookingInCalendar: async (booking: Booking,calendarId:string) => {
    set({ loading: true, error: null });
    try {
      // מוודאים שה־payload נכון
      // const response = await axiosInstance.post(`/calendar-sync/add/${calendarId}`, booking);
      const response = await axiosInstance.post(`/calendar-sync/calendars/${calendarId}/events`, booking);
      const created = response.data;

      set(state => ({
        bookings: [...state.bookings, created],
        loading: false,
      }));

      return created;
    } catch (error) {
      console.error('Error creating booking:', error);
      set({ error: 'בcalenar שגיאה ביצירת הזמנה', loading: false });
      return null;
    }
  },

  updateBooking: async (id: string, updated: Booking) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/api/bookings/updateBooking/${id}`, updated);
      const updatedBooking = response.data;

      set(state => ({
        bookings: state.bookings.map(b => (b.id === id ? updatedBooking : b)),
        currentBooking: state.currentBooking?.id === id ? updatedBooking : state.currentBooking,
        loading: false,
      }));

      return updatedBooking;
    } catch (error) {
      console.error('Error updating booking:', error);
      set({ error: 'שגיאה בעדכון ההזמנה', loading: false });
      return null;
    }
  },

  deleteBooking: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/api/bookings/deleteBooking/${id}`);
      set(state => ({
        bookings: state.bookings.filter(b => b.id !== id),
        currentBooking: state.currentBooking?.id === id ? null : state.currentBooking,
        loading: false,
      }));
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      set({ error: 'שגיאה במחיקת ההזמנה', loading: false });
      return false;
    }
  },

  setCurrentBooking: (booking: Booking | null) => {
    set({ currentBooking: booking });
  },

  clearError: () => {
    set({ error: null });
  },
  getCustomerByPhoneOrEmail: async (value: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/customers/getByPhoneOrEmail`, {
        params: { value },
      });
      return response.data; // הלקוח עצמו (או null)
    } catch (error) {
      console.error('שגיאה בשליפת לקוח לפי טלפון או מייל:', error);
      set({ error: 'שגיאה בשליפת לקוח לפי טלפון או מייל', loading: false });
      return null;
    }
  },
  getAllRooms: async (): Promise<{ id: string; name: string }[]> => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/rooms/getAllRooms');
      console.log("🎯 rooms from server:", response.data); // חשוב!
      return response.data;
    } catch (error) {
      console.error('שגיאה בשליפת רשימת חדרים:', error);
      set({ error: 'שגיאה בשליפת רשימת חדרים', loading: false });
      return [];
    }
  },
}));