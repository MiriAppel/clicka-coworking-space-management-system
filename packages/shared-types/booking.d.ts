import { ID, DateISO } from './core';
export declare enum RoomType {
    MEETING_ROOM = "MEETING_ROOM",
    LOUNGE = "LOUNGE"
}
export interface RoomFeature {
    description?: string;
    IsIncluded: boolean;
    additionalCost: number;
}
export declare enum RoomStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    MAINTENANCE = "MAINTENANCE",
    INACTIVE = "INACTIVE"
}
export declare enum BookingStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED",
    COMPLETED = "COMPLETED"
}
export interface RoomFeature {
    id: ID;
    description?: string;
    IsIncluded: boolean;
    additionalCost: number;
}
export interface Room {
    id?: ID;
    name: string;
    description?: string;
    type: RoomType;
    status: RoomStatus;
    capacity: number;
    hourlyRate: number;
    discountedHourlyRate: number;
    googleCalendarId?: string;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface BookingRules {
    MinimumBookingMinutes: number;
    MaximumBookingMinutes: number;
    AdvanceBookingDays: number;
    RequiredApproval: boolean;
    FreeHoursForKlikcaCard: number;
}
export interface Booking {
    id: ID;
    roomId: ID;
    roomName: string;
    customerId?: ID;
    customerName?: string;
    externalUserName?: string;
    externalUserEmail?: string;
    externalUserPhone?: string;
    startTime: DateISO;
    endTime: DateISO;
    status: BookingStatus;
    notes?: string;
    googleCalendarEventId?: string;
    totalHours: number;
    chargeableHours: number;
    totalCharge: number;
    isPaid: boolean;
    approvedBy?: ID;
    approvedAt?: DateISO;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface CreateRoomRequest {
    name: string;
    description?: string;
    type: RoomType;
    capacity: number;
    hourlyRate: number;
    discountedHourlyRate: number;
    googleCalendarId?: string;
}
export interface UpdateRoomRequest {
    name?: string;
    description?: string;
    status?: RoomStatus;
    capacity?: number;
    hourlyRate?: number;
    discountedHourlyRate?: number;
    googleCalendarId?: string;
}
export interface GetRoomsRequest {
    type?: RoomType[];
    status?: RoomStatus[];
    page?: number;
    limit?: number;
}
export interface CreateBookingRequest {
    roomId: ID;
    customerId?: ID;
    externalUserName?: string;
    externalUserEmail?: string;
    externalUserPhone?: string;
    startTime: DateISO;
    endTime: DateISO;
    notes?: string;
}
export interface UpdateBookingRequest {
    startTime?: DateISO;
    endTime?: DateISO;
    notes?: string;
}
export interface GetBookingsRequest {
    roomId?: ID;
    customerId?: ID;
    status?: BookingStatus[];
    startDateFrom?: DateISO;
    startDateTo?: DateISO;
    page?: number;
    limit?: number;
}
export interface ApproveBookingRequest {
    notes?: string;
}
export interface RejectBookingRequest {
    reason: string;
}
export interface CancelBookingRequest {
    reason: string;
}
export interface CheckRoomAvailabilityRequest {
    roomId: ID;
    startTime: DateISO;
    endTime: DateISO;
}
export interface CheckRoomAvailabilityResponse {
    isAvailable: boolean;
    conflictingBookings?: Booking[];
}
export interface SyncBookingsWithGoogleRequest {
    roomId?: ID;
    startDate?: DateISO;
    endDate?: DateISO;
}
export interface SyncBookingsWithGoogleResponse {
    addedBookings: number;
    updatedBookings: number;
    removedBookings: number;
    failedSyncs: Array<{
        bookingId?: ID;
        googleEventId?: string;
        error: string;
    }>;
}
