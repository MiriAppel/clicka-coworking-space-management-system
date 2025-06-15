import { DateISO, ID } from "../../types/core";

// מחלקה לבקשה לסינכרון הזמנות עם גוגל
export class SyncBookingsWithGoogleRequest {
  roomId?: ID;
  startDate?: DateISO;
  endDate?: DateISO;
  forceSync?: boolean;
// אם יש צורך בכפיית סינכרון
  constructor(params: {
    roomId?: ID;
    startDate?: DateISO;
    endDate?: DateISO;
    forceSync?: boolean;
  }) {
    this.roomId = params.roomId;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.forceSync = params.forceSync;
  }

  toDatabaseFormat() {
    return {
      roomId: this.roomId,
      startDate: this.startDate,
      endDate: this.endDate,
      forceSync: this.forceSync,
    };
  }
}
