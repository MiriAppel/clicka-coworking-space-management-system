import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { Button } from "../../../Common/Components/BaseComponents/Button";
import { SelectField } from "../../../Common/Components/BaseComponents/Select";
import { useBookingStore } from "../../../Stores/Workspace/bookingStore";
import { useCustomerStore } from "../../../Stores/LeadAndCustomer/customerStore";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../../Service/supabaseClient";
import "../Css/roomReservations.css";
import { log } from "console";

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

export const RoomReservations = forwardRef<RoomReservationsRef, RoomReservationsProps>(
  ({ initialData, onSubmit }, ref) => {
    const methods = useForm<FormFields>({
      defaultValues: {
        customerStatus: "customer",
        ...initialData,
      },
      mode: "onSubmit",
    });

    const { createBookingInCalendar, createBooking, getCustomerByPhoneOrEmail, getAllRooms } = useBookingStore();
    const customers = useCustomerStore((s) => s.customers);
    const fetchCustomers = useCustomerStore((s) => s.fetchCustomers);
    const [roomOptions, setRoomOptions] = useState<{ label: string; value: string }[]>([]);
    const status = useWatch({ control: methods.control, name: "customerStatus" });
    const phoneOrEmail = useWatch({ control: methods.control, name: "phoneOrEmail" });
    const [selectedRoomFeatures, setSelectedRoomFeatures] = useState<string[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [allFeatures, setAllFeatures] = useState<{ id: string; name: string }[]>([]);

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
    }, []);
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
    }, []);
    useEffect(() => {
      if (status === "customer" && methods.getValues("customerId")) {
        const customer = customers.find((c) => c.id === methods.getValues("customerId"));
        console.log("נמצא לקוח?", customer);
        if (customer) {
          methods.setValue("name", customer.name);
          console.log("שם מתוך useEffect:", customer.name);
        }
      }
    }, [status, customers, methods.watch("customerId")]);

    useEffect(() => {
      const fetchFeatures = async () => {
        const { data, error } = await supabase.from("feature").select("*");
        if (error) {
          console.error("שגיאה בשליפת תכונות:", error);
          return;
        }
        setAllFeatures(data || []);
      };
    
      fetchFeatures();
    }, []);
    

    useEffect(() => {
      const fetch = async () => {
        if (status === "customer" && phoneOrEmail) {
          const customer = await getCustomerByPhoneOrEmail(phoneOrEmail);
          if (customer) {
            methods.setValue("customerId", customer.id);
            methods.setValue("name", customer.name);
            console.log("שם הלקוח:", customer.name);
            methods.setValue("email", customer.email);
            methods.setValue("phone", customer.phone);
          }
        }
      };
      fetch();
    }, [status, phoneOrEmail]);
    //אפשרי לקבל את הבחירת חדר מבחוץ
    useEffect(() => {
      if (initialData?.selectedRoomId) {
        methods.setValue("selectedRoomId", initialData.selectedRoomId);
      }
    }, [roomOptions]);
    
    const selectedRoomId = useWatch({ control: methods.control, name: "selectedRoomId" });
    //תכונות החדר
    useEffect(() => {
      const room = roomOptions.find((r) => r.value === selectedRoomId);
      if (room) {
        // צריך להיות לך מאגר החדרים המלא עם תכונות, לא רק label/value
        getAllRooms().then((rooms: Room[]) => {
          const selectedFullRoom = rooms.find((r) => r.id === selectedRoomId);
          setSelectedRoomFeatures(selectedFullRoom?.features ?? []);
          console.log("room", selectedFullRoom);
        });
      } else {
        setSelectedRoomFeatures([]);
      }
    }, [selectedRoomId]);

    const roomsWithFeatures = rooms.map(room => {
      const featureIds = room.features || [];
      const fullFeatures = allFeatures.filter(f => featureIds.includes(f.id));
      return {
        ...room,
        features: fullFeatures,
      };
    });
    
    
   
    
    useEffect(() => {
      if (selectedRoomId && rooms.length > 0) {
        const room = rooms.find((r) => r.id === selectedRoomId);
        setSelectedRoomFeatures(room?.features || []);
      } else {
        setSelectedRoomFeatures([]);
      }
    }, [selectedRoomId, rooms]);
    

    const convertFormToBooking = (data: FormFields) => {
      const name = data.name?.trim() || "";
      // const startTime = `${data.startDate}T${data.startTime}:00.000Z`;
      // const endTime = `${data.startDate}T${data.endTime}:00.000Z`;
      const startTime =`${data.startDate}T${data.startTime}`;
      const endTime = `${data.startDate}T${data.endTime}`;
      const selectedRoom = roomOptions.find((room) => room.value === data.selectedRoomId);
      const roomName = selectedRoom?.label ?? "Unknown";

      const base = {
        id: uuidv4(),
        name,
        roomId: data.selectedRoomId,
        roomName,
        startTime,
        endTime: endTime,
        status: BookingStatus.PENDING,
        totalHours: 0,
        chargeableHours: 0,
        totalCharge: 0,
        googleCalendarEventId: data.selectedRoomId,
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
        const result = await createBooking(bookingPayload);
        const resultCalendar = await createBookingInCalendar(bookingPayload, "primary");
        if (result) {
          methods.reset();
          onSubmit?.();
        }
        if (resultCalendar) {
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
              {selectedRoomFeatures.length > 0 && (
                <div className="form-field">
                  <label>תכונות החדר:</label>
                  <ul>
                    {selectedRoomFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
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
