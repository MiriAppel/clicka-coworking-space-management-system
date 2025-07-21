import { create } from "zustand";
import axios from "axios";
import type { Booking } from "./../../../../shared-types";
import type { ApiResponse } from "./../../../../shared-types";

interface BookingCalendarState {
    bookings: BookingWithGoogleFlag[];
    loading: boolean;
    error: string | null;
    fetchBookings: (params?: { roomId?: string }) => Promise<void>;
    createBooking: (booking: Partial<Booking>) => Promise<void>;
    updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;
    fetchBookingsByRoomId: (roomId: string) => Promise<void>;
    // הוספת פונקציות Google Calendar
    syncWithGoogleCalendar: (calendarId: string, booking: Booking) => Promise<void>;
    fetchGoogleCalendarEvents: (calendarId: string) => Promise<void>;
}
interface BookingWithGoogleFlag extends Booking {
    isGoogleEvent?: boolean;
}


export const useBookingCalendarStore = create<BookingCalendarState>((set, get) => ({
    bookings: [],
    loading: false,
    error: null,

    /**
     * טוען הזמנות מהשרת הקיים
     */
    fetchBookings: async (params) => {
        set({ loading: true, error: null });
        try {
            // משתמש ב-API הקיים
            const response = await axios.get('/api/book/getAllBooking', );
            let bookings = response.data;
            if (params?.roomId) {
                bookings = bookings.filter((booking: any) => booking.roomId === params.roomId);
            }
                
            
            set({ 
                bookings: response.data,
                loading: false 
            });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'שגיאה בטעינת הזמנות',
                loading: false 
            });
        }
    },

    /**
     * יוצר הזמנה חדשה ומסנכרן עם Google Calendar
     */
    createBooking: async (booking) => {
        set({ loading: true, error: null });
        try {
            // 1. יצירת הזמנה בשרת הקיים
            const response = await axios.post('/api/book', booking);
            const newBooking = response.data;

            // 2. ניסיון לסנכרן עם Google Calendar (אם זה עובד)
            try {
                if (booking.roomId) {
                    await get().syncWithGoogleCalendar(booking.roomId, newBooking);
                }
            } catch (syncError) {
                console.warn('Google Calendar sync failed, but booking created:', syncError);
                // לא עוצר את התהליך אם הסינכרון נכשל
            }

            // 3. עדכון State
             await get().fetchBookings({ roomId: booking.roomId });
            set({ loading: false });

        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'שגיאה ביצירת הזמנה',
                loading: false 
            });
        }
    },

    /**
     * מעדכן הזמנה קיימת
     */
    updateBooking: async (id, booking) => {
        set({ loading: true, error: null });
        try {
            // משתמש ב-API הקיים
            const response = await axios.put(`/api/book/updateBooking/${id}`, booking);
            const updatedBooking = response.data;

            // ניסיון לסנכרן עם Google Calendar
            try {
                if (updatedBooking.roomId) {
                    await get().syncWithGoogleCalendar(updatedBooking.roomId, updatedBooking);
                }
            } catch (syncError) {
                console.warn('Google Calendar sync failed:', syncError);
            }

           await get().fetchBookings({ roomId: updatedBooking.roomId });
            set({ loading: false });

        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'שגיאה בעדכון הזמנה',
                loading: false 
            });
        }
    },

    /**
     * מוחק הזמנה
     */
    deleteBooking: async (id) => {
        set({ loading: true, error: null });
        try {
            const booking = get().bookings.find(b => b.id === id);
            
            // מחיקה מהשרת הקיים
            await axios.delete(`/api/book/deleteBooking/${id}`);

            // ניסיון למחוק מ-Google Calendar
            try {
                if (booking?.googleCalendarEventId) {
                    await axios.delete(`/api/calendar-sync/delete/${booking.googleCalendarEventId}`);
                }
            } catch (syncError) {
                console.warn('Google Calendar delete failed:', syncError);
            }

           if (booking?.roomId) {
                await get().fetchBookings({ roomId: booking.roomId });
            }
            set({ loading: false });


        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'שגיאה במחיקת הזמנה',
                loading: false 
            });
        }
    },

    /**
     * טוען הזמנות לפי חדר - משתמש בפילטר קליינט-סייד
     */
    fetchBookingsByRoomId: async (roomId: string) => {
        set({ loading: true, error: null });
        try {
            // טוען את כל ההזמנות ומסנן בצד הקליינט
            const response = await axios.get('/api/book');
            const allBookings = response.data;
            
            // סינון לפי roomId
            const roomBookings = allBookings.filter((booking: Booking) => 
                booking.roomId === roomId
            );
            
            set({ 
                bookings: roomBookings,
                loading: false 
            });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'שגיאה בטעינת הזמנות החדר',
                loading: false 
            });
        }
    },

    /**
     * מסנכרן הזמנה עם Google Calendar
     */
    syncWithGoogleCalendar: async (calendarId: string, booking: Booking) => {
    try {
        const token = localStorage.getItem('googleAccessToken') || 
                     sessionStorage.getItem('googleAccessToken');
        
        if (!token) {
            console.warn('No Google access token found');
            return;
        }

        // ✅ תיקון: headers בפרמטר השלישי, data בפרמטר השני
        await axios.post(
            `/api/calendar-sync/add/${calendarId}`, 
            { booking: booking }, // data
            { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } // config
        );

        console.log('Successfully synced with Google Calendar');

    } catch (error: any) {
        console.error('Google Calendar sync failed:', error);
        throw error; // זרוק שגיאה כדי שהקריאה תדע שהסינכרון נכשל
    }
},


    /**
     * טוען אירועים מ-Google Calendar
     */
    fetchGoogleCalendarEvents: async (calendarId: string) => {
        try {
            const token = localStorage.getItem('googleAccessToken') || 
                         sessionStorage.getItem('googleAccessToken');
            
            if (!token) {
                console.warn('No Google access token found');
                return;
            }

            // משתמש ב-API הקיים
            const response = await axios.get(`/api/calendar-sync/all/${calendarId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Google Calendar events loaded:', response.data);
            
              const googleEvents = response.data;
            if (googleEvents && googleEvents.length > 0) {
                const convertedEvents = googleEvents.map((event: any) => ({
                    id: `google-${event.id}`,
                    roomId: calendarId,
                    customerName: event.summary || 'אירוע Google',
                    externalUserEmail: event.attendees?.[0]?.email || '',
                    startTime: event.start.dateTime,
                    endTime: event.end.dateTime,
                    notes: event.description || '',
                    status: 'APPROVED',
                    googleCalendarEventId: event.id,
                    isGoogleEvent: true
                }));

                set((state) => ({
                    bookings: [
                        ...state.bookings.filter(b => !b.isGoogleEvent), 
                        ...convertedEvents
                    ]
                }));
            }

        } catch (error: any) {
            console.error('Failed to fetch Google Calendar events:', error);
        }
    }
}));
