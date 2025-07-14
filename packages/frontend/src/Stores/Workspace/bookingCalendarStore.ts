import { create } from "zustand";
import axios from "axios";
import type { Booking } from "./../../../../shared-types";
import type { ApiResponse } from "./../../../../shared-types";

interface BookingCalendarState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
    fetchBookings: (params?: { roomId?: string }) => Promise<void>;
    createBooking: (booking: Partial<Booking>) => Promise<void>;
    updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;
    fetchBookingsByRoomId: (roomId: string) => Promise<void>;
}

const mockBookings: Booking[] = [
    {
        id: "1",
        roomId: "101",
        customerName: "דני",
        startTime: "2024-06-20T10:00:00",
        endTime: "2024-06-20T11:00:00",
        status: "APPROVED"
    } as Booking
];

export const useBookingCalendarStore = create<BookingCalendarState>((set) => ({
    bookings: mockBookings,
    loading: false,
    error: null,

    /**
     * טוען את כל ההזמנות מהחנות (או מסנן לפי roomId אם נשלח).
     * כרגע עובד על נתוני דמה בלבד.
     * @param params אובייקט אופציונלי עם roomId לסינון
     */
    fetchBookings: async (params) => {
        set({ loading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
            bookings: params?.roomId
                ? state.bookings.filter(b => b.roomId === params.roomId)
                : state.bookings,
            loading: false
        }));
    },

    /**
     * מוסיף הזמנה חדשה לחנות.
     * כרגע מוסיף לנתוני הדמה בלבד.
     * @param booking אובייקט הזמנה חדשה (חלקי)
     */
    createBooking: async (booking) => {
        set({ loading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 200));
        set((state) => ({
            bookings: [
                ...state.bookings,
                {
                    ...booking,
                    id: Date.now().toString(),
                    roomId: booking.roomId || "101",
                    customerName: booking.customerName || "לקוח חדש",
                    startTime: booking.startTime || new Date().toISOString(),
                    endTime: booking.endTime || new Date().toISOString(),
                    status: booking.status || "APPROVED"
                } as Booking
            ],
            loading: false
        }));
    },

    /**
     * מעדכן הזמנה קיימת לפי מזהה.
     * כרגע מעדכן בנתוני הדמה בלבד.
     * @param id מזהה ההזמנה לעדכון
     * @param booking אובייקט עם שדות לעדכון
     */
    updateBooking: async (id, booking) => {
        set({ loading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 200));
        set((state) => ({
            bookings: state.bookings.map(b =>
                b.id === id ? { ...b, ...booking } as Booking : b
            ),
            loading: false
        }));
    },

    /**
     * מוחק הזמנה לפי מזהה.
     * כרגע מוחק מנתוני הדמה בלבד.
     * @param id מזהה ההזמנה למחיקה
     */
    deleteBooking: async (id) => {
        set({ loading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 200));
        set((state) => ({
            bookings: state.bookings.filter(b => b.id !== id),
            loading: false
        }));
    },

    /**
     * טוען את כל ההזמנות של חדר מסוים לפי roomId.
     * כרגע מחזיר נתוני דמה בלבד.
     * @param roomId מזהה החדר
     */
    fetchBookingsByRoomId: async (roomId: string) => {
        set({ loading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 300));
        set(() => ({
            bookings: mockBookings.filter(b => b.roomId === roomId),
            loading: false
        }));
    }
}));