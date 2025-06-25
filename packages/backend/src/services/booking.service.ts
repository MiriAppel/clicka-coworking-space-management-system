import { BookingModel } from "../models/booking.model";
import type { CreateBookingRequest, ID, DateISO, BookingStatus } from "shared-types";

// נניח שיש לנו שכבת גישה ל־DB
// import { db } from "../db";
// import { sendNotification } from "../utils/notification";
// import { getRoomNameById } from "../utils/rooms";
// import { generateId } from "../utils/id";

export class BookingService {
  /**
   * יצירת הזמנה חדשה ללקוח או משתמש חיצוני
   */
  async createBooking(request: CreateBookingRequest): Promise<BookingModel> {
    const hasConflict = await this.detectConflicts(request.startTime, request.endTime, request.roomId);
    if (hasConflict) throw new Error("Room is already booked for the selected time");

    const booking = new BookingModel({
      id: generateId(),
      roomId: request.roomId,
      roomName: await getRoomNameById(request.roomId),
      customerId: request.customerId,
      externalUserName: request.externalUserName,
      externalUserEmail: request.externalUserEmail,
      externalUserPhone: request.externalUserPhone,
      startTime: request.startTime,
      endTime: request.endTime,
      status: "PENDING",
      notes: request.notes,
    });

    await db.bookings.insert(booking.toDatabaseFormat());

    // שליחת התראה
    await sendNotification({
      to: "admin@yourdomain.com",
      subject: "New Booking Pending Approval",
      body: `New booking request for room ${booking.roomName} from ${booking.startTime} to ${booking.endTime}`
    });

    return booking;
  }

  /**
   * קבלת הזמנה לפי מזהה
   */
  async getBookingById(id: ID): Promise<BookingModel | null> {
    const raw = await db.bookings.findById(id);
    return raw ? new BookingModel(raw) : null;
  }

  /**
   * קבלת כל ההזמנות
   */
  async getAllBookings(): Promise<BookingModel[]> {
    const rawList = await db.bookings.findAll();
    return rawList.map(data => new BookingModel(data));
  }

  /**
   * עדכון הזמנה
   */
  async updateBooking(id: ID, updates: Partial<CreateBookingRequest>): Promise<BookingModel> {
    const booking = await this.getBookingById(id);
    if (!booking) throw new Error("Booking not found");

    if (updates.startTime || updates.endTime || updates.roomId) {
      const conflict = await this.detectConflicts(
        updates.startTime ?? booking.startTime,
        updates.endTime ?? booking.endTime,
        updates.roomId ?? booking.roomId,
        id // exclude self
      );
      if (conflict) throw new Error("Updated booking conflicts with existing one");
    }

    Object.assign(booking, updates, {
      updatedAt: new Date().toISOString()
    });

    await db.bookings.update(id, booking.toDatabaseFormat());
    return booking;
  }

  /**
   * ביטול הזמנה
   */
  async cancelBooking(id: ID): Promise<void> {
    const booking = await this.getBookingById(id);
    if (!booking) throw new Error("Booking not found");

    booking.status = "CANCELED";
    booking.updatedAt = new Date().toISOString();

    await db.bookings.update(id, booking.toDatabaseFormat());
  }

  /**
   * אישור הזמנה
   */
  async approveBooking(id: ID, approvedBy: ID): Promise<BookingModel> {
    const booking = await this.getBookingById(id);
    if (!booking) throw new Error("Booking not found");

    if (booking.status !== "PENDING") throw new Error("Only pending bookings can be approved");

    booking.status = "APPROVED";
    booking.approvedBy = approvedBy;
    booking.approvedAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    await db.bookings.update(id, booking.toDatabaseFormat());

    // שליחת אישור
    const recipient = booking.externalUserEmail ?? booking.customerEmail;
    if (recipient) {
      await sendNotification({
        to: recipient,
        subject: "Booking Approved",
        body: `Your booking for room ${booking.roomName} has been approved.`
      });
    }

    return booking;
  }

  /**
   * דחיית הזמנה
   */
  async rejectBooking(id: ID, rejectedBy: ID): Promise<BookingModel> {
    const booking = await this.getBookingById(id);
    if (!booking) throw new Error("Booking not found");

    booking.status = "REJECTED";
    booking.approvedBy = rejectedBy;
    booking.approvedAt = new Date().toISOString();
    booking.updatedAt = new Date().toISOString();

    await db.bookings.update(id, booking.toDatabaseFormat());
    return booking;
  }

  /**
   * מחיקת הזמנה
   */
  async deleteBooking(id: ID): Promise<void> {
    await db.bookings.delete(id);
  }

  /**
   * בדיקת התנגשויות עם הזמנות קיימות
   */
  async detectConflicts(start: DateISO, end: DateISO, roomId: ID, excludeId?: ID): Promise<boolean> {
    const existing = await db.bookings.find({
      roomId,
      status: { $in: ["APPROVED", "PENDING"] },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    const conflicts = excludeId
      ? existing.filter(b => b.id !== excludeId)
      : existing;

    return conflicts.length > 0;
  }
}
