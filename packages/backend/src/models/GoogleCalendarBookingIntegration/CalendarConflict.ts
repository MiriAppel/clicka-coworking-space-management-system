import { ID } from "../../types/core";

// מחלקה לקונפליקטים קלנדריים
export class CalendarConflict {
  bookingId: ID;
  googleEventId: string;
  conflictType: 'TIME_OVERLAP' | 'ROOM_CONFLICT' | 'PERMISSION_ERROR';
      //             חפיפה_של_זמן/ קונפליקט_חדר/ שגיאת_הרשאה
  description: string;
  suggestedResolution: string;
    //          פתרון מוצע  

  constructor(params: {
    bookingId: ID;
    googleEventId: string;
    conflictType: 'TIME_OVERLAP' | 'ROOM_CONFLICT' | 'PERMISSION_ERROR';
    description: string;
    suggestedResolution: string;
  
  }) {
    this.bookingId = params.bookingId;
    this.googleEventId = params.googleEventId;
    this.conflictType = params.conflictType;
    this.description = params.description;
    this.suggestedResolution = params.suggestedResolution;
  }

  toDatabaseFormat() {
    return {
      bookingId: this.bookingId,
      googleEventId: this.googleEventId,
      conflictType: this.conflictType,
      description: this.description,
      suggestedResolution: this.suggestedResolution,
    };
  }
}
