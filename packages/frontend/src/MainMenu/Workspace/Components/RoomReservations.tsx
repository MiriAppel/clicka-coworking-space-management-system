import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { Button } from "../../../Common/Components/BaseComponents/Button";
import { SelectField } from "../../../Common/Components/BaseComponents/Select";
import { useBookingStore } from "../../../Stores/Workspace/bookingStore";
import { useCustomerStore } from "../../../Stores/LeadAndCustomer/customerStore";
import { useFeatureStore } from "../../../Stores/Workspace/featureStore";
import { v4 as uuidv4 } from "uuid";
import "../Css/roomReservations.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


export enum BookingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}

type Room = {
  id: string;
  name: string;
  features?: string[];
};

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

    const { createBookingInCalendar, getCustomerByPhoneOrEmail, getAllRooms } = useBookingStore();
    const customers = useCustomerStore((s) => s.customers);
    const fetchCustomers = useCustomerStore((s) => s.fetchCustomers);
    const [roomOptions, setRoomOptions] = useState<{ label: string; value: string }[]>([]);
    const status = useWatch({ control: methods.control, name: "customerStatus" });
    const phoneOrEmail = useWatch({ control: methods.control, name: "phoneOrEmail" });
    // const [selectedRoomFeatures, setSelectedRoomFeatures] = useState<string[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    // const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    // const [allFeatures] = useState<{ id: string; name: string }[]>([]);
    const { features, getAllFeatures } = useFeatureStore();

    const calculateDurationInMinutes = (startISO: string, endISO: string): number => {
      const start = new Date(startISO);
      const end = new Date(endISO);
      const diffInMs = end.getTime() - start.getTime();
      return (Math.floor(diffInMs / (1000 * 60))) / 60;
    };



    useImperativeHandle(ref, () => ({
      fillFormWithExternalData: (data: Partial<FormFields>) => {
        Object.entries(data).forEach(([key, value]) => {
          methods.setValue(key as keyof FormFields, value as any);
        });
      },
    }));
    useEffect(() => {
      getAllRooms().then((data) => {
        setRooms(data);
      });
    }, [getAllRooms]);
    useEffect(() => {
      fetchCustomers();

      getAllRooms().then((rooms: Room[]) => {
        setRoomOptions(
          rooms.map((room) => ({
            label: room.name,
            value: room.id,
          }))
        );
      });
    }, [fetchCustomers,getAllRooms]);
    useEffect(() => {
      if (status === "customer" && methods.getValues("customerId")) {
        const customer = customers.find((c) => c.id === methods.getValues("customerId"));
        console.log("נמצא לקוח?", customer);
        if (customer) {
          methods.setValue("name", customer.name);
          console.log("שם מתוך useEffect:", customer.name);
        }
      }
    }, [status, customers,methods]);
    // , [status, customers, methods.watch("customerId")]);

    // useEffect(() => {
    //   const fetchFeatures = async () => {
    //     const { data, error } = await supabase.from("feature").select("*");
    //     if (error) {
    //       console.error("שגיאה בשליפת תכונות:", error);
    //       return;
    //     }
    //     setAllFeatures(data || []);
    //   };

    //   fetchFeatures();
    // }, []);


    useEffect(() => {
      const fetch = async () => {
        if (status === "customer" && phoneOrEmail) {
          const customer = await getCustomerByPhoneOrEmail(phoneOrEmail);
          if (customer) {
            methods.setValue("customerId", customer.id);
            methods.setValue("name", customer.name);
            // console.log("שם הלקוח:", customer.name);
            methods.setValue("email", customer.email);
            methods.setValue("phone", customer.phone);
          }
        }
      };
      fetch();
    }, [status, phoneOrEmail,methods,getCustomerByPhoneOrEmail]);
    //אפשרי לקבל את הבחירת חדר מבחוץ
    useEffect(() => {
      if (initialData?.selectedRoomId) {
        methods.setValue("selectedRoomId", initialData.selectedRoomId);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomOptions,methods]);

    const selectedRoomId = useWatch({ control: methods.control, name: "selectedRoomId" });
    //תכונות החדר
    useEffect(() => {
      const room = roomOptions.find((r) => r.value === selectedRoomId);
      if (room) {
        // צריך להיות לך מאגר החדרים המלא עם תכונות, לא רק label/value
        getAllRooms().then((rooms: Room[]) => {
          const selectedFullRoom = rooms.find((r) => r.id === selectedRoomId);
          // setSelectedRoomFeatures(selectedFullRoom?.features ?? []);
          console.log("room", selectedFullRoom);
        });
      } else {
        // setSelectedRoomFeatures([]);
      }
      console.log("✅ selectedRoomId:", selectedRoomId);
    }, [selectedRoomId,roomOptions,getAllRooms]);
    useEffect(() => {
      getAllFeatures().then(() => {
        console.log("התכונות אחרי getAllFeatures:", features);
      });
    }, [getAllFeatures,features]);
    
    // useEffect(() => {
    //   getAllFeatures();
    // }, []);
    // const roomsWithFeatures = rooms.map(room => {
    //   console.log("התכונות",features.length);
    //   const featureIds = room.features || [];
    //   const fullFeatures = allFeatures.filter(f => featureIds.includes(f.id));
    //   return {
    //     ...room,
    //     features: fullFeatures,
    //   };
    // });




    useEffect(() => {
      if (selectedRoomId && rooms.length > 0) {
        // const room = rooms.find((r) => r.id === selectedRoomId);
        // setSelectedRoomFeatures(room?.features || []);
      } else {
        // setSelectedRoomFeatures([]);
      }
    }, [selectedRoomId, rooms]);


    const convertFormToBooking = (data: FormFields) => {
      const name = data.name?.trim() || "";
      const startTime = `${data.startDate}T${data.startTime}`;
      const endTime = `${data.startDate}T${data.endTime}`;
      const selectedRoom = roomOptions.find((room) => room.value === data.selectedRoomId);
      const roomName = selectedRoom?.label ?? "Unknown";

      const totalMinutes = calculateDurationInMinutes(startTime, endTime);
      const base = {
        id: uuidv4(),
        roomId: data.selectedRoomId,
        roomName,
        customerId: null,
        customerName: null,
        externalUserName: null,
        externalUserEmail: null,
        externalUserPhone: null,
        startTime,
        endTime,
        status: BookingStatus.PENDING,
        notes: "",
        googleCalendarEventId: null,
        totalHours: totalMinutes,
        chargeableHours: 0,
        totalCharge: 0,
        isPaid: false,
        approvedBy: "",
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (data.customerStatus === "customer") {
        console.log("customerId", data.customerId);
        console.log("customerName", data.name);
        console.log("customerPhone", data.phone);
        return {
          ...base,
          customerId: data.customerId ?? "",
          customerName: name,

        };
      }

      return {
        ...base,
        externalUserName: data.name ?? "",
        externalUserEmail: data.email ?? "",
        externalUserPhone: data.phone ?? "",
      };
    };
    useEffect(() => {
      console.log("שגיאות בטופס:", methods.formState.errors);
    }, [methods.formState.errors]);

    const handleSubmit = async (data: FormFields) => {

      try {
        if (data.customerStatus === "customer") {
          if (!data.customerId) {
            alert("יש לבחור לקוח מהרשימה או לפי מייל/טלפון");
            return;
          }
        } else {
          if (!data.name || !data.phone || !data.email) {
            alert("נא למלא את כל פרטי הלקוח החיצוני");
            return;
          }
        }


        const bookingPayload = convertFormToBooking(data);
        console.log(bookingPayload, "Booking payload before masad");
        // const result = await createBooking(bookingPayload);
        console.log("Booking payload: before calendar", bookingPayload);

        const resultCalendar = await createBookingInCalendar(bookingPayload, "primary");
        console.log(resultCalendar, "Booking created:");

        if (resultCalendar) {
          alert("ההזמנה נוצרה בהצלחה");
          methods.reset();
          onSubmit?.();
        }
      } catch (err) {
        console.error("שגיאה ביצירת ההזמנה:", err);
        alert("שגיאה ביצירת ההזמנה");
      }
    };

    return (
      <div className="form-page">
        <div className="form-wrapper">
          <h1 className="form-title">הזמנות חדרים</h1>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <fieldset>
                <legend>סטטוס לקוח</legend>
                <label>
                  <input
                    type="radio"
                    value="customer"
                    {...methods.register("customerStatus")}
                    defaultChecked
                  />
                  לקוח קיים
                </label>
                <br></br>
                <label>
                  <input
                    type="radio"
                    value="external"
                    {...methods.register("customerStatus")}
                  />
                  לקוח חיצוני
                </label>
              </fieldset>


              {status === "customer" ? (
                <>
                  <div className="form-field">
                    <SelectField
                      name="customerId"
                      label="בחר לקוח מהרשימה"
                      options={customers.map((c) => ({
                        label: `${c.name} - ${c.phone}`,
                        value: c.id || "",
                      }))}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-field">
                    <InputField name="name" label="שם" type="text" required />
                  </div>
                  <div className="form-field">
                    <InputField name="phone" label="טלפון" type="tel" required />
                  </div>
                  <div className="form-field">
                    <InputField name="email" label="מייל" type="email" required />
                  </div>
                </>
              )}

              <div className="form-field">
                <SelectField name="selectedRoomId" label="בחירת חדר" options={roomOptions} required />
              </div>
              {/* {selectedRoomFeatures.length > 0 && (
                <div className="form-field">
                  <label>תכונות החדר:</label>
                  <ul>
                    {selectedRoomFeatures.map((featureId, index) => {
                      const feature = allFeatures.find(f => f.id === featureId);
                      return (
                        <li key={index}>
                          {feature?.name || "לא ידוע"}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )} */}
              {(
                <div className="form-field">
                  <label>כל התכונות הקיימות:</label>
                  <ul>
                    {features.map((feature) => (
                      <li key={feature.id}>
                        {feature.description || "תכונה ללא תיאור"} - תוספת: {feature.additionalCost}₪
                      </li>
                    ))}
                  </ul>
                </div>
              )}



              <div className="form-field">
                <InputField name="startDate" label="תאריך התחלה" type="date" required />
              </div>
              <div className="form-field">
                <InputField name="startTime" label="שעת התחלה" type="time" required />
              </div>
              <div className="form-field">
                <InputField name="endTime" label="שעת סיום" type="time" required />
              </div>

              <div className="form-actions">
                <Button type="submit">שלח</Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    );
  }
);

RoomReservations.displayName = "RoomReservations";
