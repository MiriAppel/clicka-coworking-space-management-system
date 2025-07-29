import {forwardRef } from "react";
import { useForm} from "react-hook-form";

import "../Css/roomReservations.css";
//יבוא מהספריה של ZOD ולולידציה
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


export enum BookingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}

export type FormFields = {
  customerStatus: "external" | "customer";
  phoneOrEmail?: string;
  customerId?: string;
  name?: string;
  phone?: string;
  email?: string;
  selectedRoomId: string;
  startDate: string;
  startTime: string;
  endTime: string;
};
export type RoomReservationsRef = {
  fillFormWithExternalData: (data: Partial<FormFields>) => void;
};

export type RoomReservationsProps = {
  initialData?: Partial<FormFields>;
  onSubmit?: () => void;
};
// בדיקת זמן בפורמט רבע שעה
const isQuarter = (time: string) => {
  const minutes = parseInt(time.split(":")[1], 10);
  return minutes % 15 === 0;
};
//בדיקה האם התאריך שנבחר הוא מהעבר
const isPastDate = (dateStr: string) => {
  const selectedDate = new Date(dateStr);
  const today = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};
//בדיקה האם השעה שנבחרה היא כבר עברה
const isTodayAndStartTimeInPast = (startDate: string, startTime: string) => {
  const todayStr = new Date().toISOString().split("T")[0];
  if (startDate !== todayStr) return false;
  const now = new Date();
  const [hours, minutes] = startTime.split(":").map(Number);
  const selectedTime = new Date();
  selectedTime.setHours(hours, minutes, 0, 0);
  return selectedTime < now;
};
//ולידציה שיהיה אפשר לקחת את החדר רק לכמות שעות עגולות לא רבעים ולא חצאים
const isFullHourDifference = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start = new Date();
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  const diffInMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
  return diffInMinutes >= 60 && diffInMinutes % 60 === 0;
};
//הולידציות
//הולידציות
const bookingSchema = z.object({
  customerStatus: z.enum(["external", "customer"]),
  customerId: z.string().optional(),
  name: z.string().min(1, "שם נדרש").optional(),
  phone: z.string().min(7, "טלפון נדרש").optional(),
  email: z.string().email("אימייל לא תקין").optional(),
  selectedRoomId: z.string().min(1, "חובה לבחור חדר"),
  startDate: z.string()
    .min(1, "חובה לבחור תאריך")
    .refine(isPastDate, { message: "אי אפשר לבחור תאריך מהעבר" }),
  startTime: z.string()
    .min(1, "שעת התחלה נדרשת")
    .refine(isQuarter, {
      message: "בחר רבע שעה: 00, 15, 30, 45",
    }),
  endTime: z.string()
    .min(1, "שעת סיום נדרשת")
    .refine(isQuarter, { message: "בחר רבע שעה: 00, 15, 30, 45", }),
})
  .refine(
    (data) => data.startTime < data.endTime,
    {
      message: "שעת התחלה חייבת להיות לפני שעת סיום",
      path: ["endTime"],
    }
  )
  .refine((data) => {
    return !isTodayAndStartTimeInPast(data.startDate, data.startTime);
  },
    {
      message: "שעת התחלה עבור היום לא יכולה להיות לפני השעה הנוכחית",
      path: ["startTime"],
    }
  )
  .refine(
    (data) => isFullHourDifference(data.startTime, data.endTime),
    {
      message: "יש לבחור משך זמן של שעה שלמה לפחות (למשל: 1:00, 2:00 וכו')",
      path: ["endTime"],
    }
  )
  .refine((data) => {
    if (data.customerStatus === "customer") {
      return !!data.customerId;
    } else {
      return !!(data.name?.trim() && data.phone?.trim() && data.email?.trim());
    }
  }, {
    message: "יש למלא את כל פרטי הלקוח לפי הסוג",
    path: ["customerId"],
  });


export const RoomReservations = forwardRef<RoomReservationsRef, RoomReservationsProps>(
  ({ initialData, onSubmit }, ref) => {
    const methods = useForm<FormFields>({
      defaultValues: {
        customerStatus: "customer",
        ...initialData,
      },
      mode: "onSubmit",
      resolver: zodResolver(bookingSchema),
    });
    // todo remove this 
    methods.clearErrors();

    return (
      <div className="form-page">
       
      </div>
    );
  }
);

RoomReservations.displayName = "RoomReservations";