import React, {useEffect,useState,useImperativeHandle,forwardRef} from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { Button } from "../../../Common/Components/BaseComponents/Button";
import { SelectField } from "../../../Common/Components/BaseComponents/Select";
import { useBookingStore } from "../../../Stores/Workspace/bookingStore";
import {useCustomerStore} from "../../../Stores/LeadAndCustomer/customerStore"
import { v4 as uuidv4 } from "uuid";
import "../Css/roomReservations.css";

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
};

export type FormFields = {
  customerStatus: "valid" | "customer";
  phoneOrEmail?: string;
  customerId?: string;
  name?: string;
  phone?: string;
  email?: string;
  selectedRoomId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export type RoomReservationsRef = {
  fillFormWithExternalData: (data: Partial<FormFields>) => void;
};

export type RoomReservationsProps = {
  initialData?: Partial<FormFields>;
    onSubmit?: () => void; // הוסיפי שורה זו
};

export const RoomReservations = forwardRef<RoomReservationsRef, RoomReservationsProps>(
  ({ initialData , onSubmit}, ref) => {
    const methods = useForm<FormFields>({
      defaultValues: {
        customerStatus: "valid",
        ...initialData,
      },
      mode: "onSubmit",
    });

    const { createBooking, getCustomerByPhoneOrEmail, getAllRooms } = useBookingStore();
    const [roomOptions, setRoomOptions] = useState<{ label: string; value: string }[]>([]);

    const status = useWatch({ control: methods.control, name: "customerStatus" });
    const phoneOrEmail = useWatch({ control: methods.control, name: "phoneOrEmail" });

    useImperativeHandle(ref, () => ({
      fillFormWithExternalData: (data: Partial<FormFields>) => {
        Object.entries(data).forEach(([key, value]) => {
          methods.setValue(key as keyof FormFields, value as any);
        });
      },
    }));

    useEffect(() => {
      const fetchRooms = async () => {
        const rooms: Room[] = await getAllRooms();
        setRoomOptions(
          rooms.map((room) => ({
            label: room.name,
            value: room.id,
          }))
        );
      };
      fetchRooms();
    }, []);

    useEffect(() => {
      const fetchCustomer = async () => {
        if (status === "customer" && phoneOrEmail) {
          try {
            const customer = await getCustomerByPhoneOrEmail(phoneOrEmail);
            if (customer) {
              methods.setValue("customerId", customer.id);
              methods.setValue("name", customer.name);
              methods.setValue("email", customer.email);
              methods.setValue("phone", customer.phone);
            }
          } catch (err) {
            console.error("שגיאה בשליפת לקוח:", err);
          }
        }
      };
      fetchCustomer();
    }, [status, phoneOrEmail, methods]);

    const convertFormToBooking = (data: FormFields) => {
      const startTime = `${data.startDate}T${data.startTime}:00.000Z`;
      const endTime = `${data.endDate}T${data.endTime}:00.000Z`;

      const selectedRoom = roomOptions.find((room) => room.value === data.selectedRoomId);
      const roomName = selectedRoom?.label ?? "Unknown";

      const base = {
        id: uuidv4(),
        roomId: data.selectedRoomId,
        roomName,
        startTime,
        endTime,
        status: BookingStatus.PENDING,
        totalHours: 0,
        chargeableHours: 0,
        totalCharge: 0,
        isPaid: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (data.customerStatus === "customer") {
        return {
          ...base,
          customerId: data.customerId ?? "",
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
            const customer = await getCustomerByPhoneOrEmail(data.phoneOrEmail ?? "");
            if (!customer) {
              alert("לא נמצא לקוח עם הטלפון או המייל שסופקו");
              return;
            }
            data.customerId = customer.id;
          }
        } else {
          if (!data.name || !data.phone || !data.email) {
            alert("נא למלא את כל השדות ללקוח חדש");
            return;
          }
        }

        const bookingPayload = convertFormToBooking(data);
        const result = await createBooking(bookingPayload);

        if (result) {
          alert("ההזמנה נוצרה בהצלחה");
          methods.reset();
                    if (onSubmit) onSubmit(); 
        }
      } catch (error) {
        console.error("שגיאה ביצירת ההזמנה:", error);
        alert("אירעה שגיאה ביצירת ההזמנה");
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
                  <InputField type="radio" name="customerStatus" value="valid" label="מתעניין" />
                </label>
                <label>
                  <InputField type="radio" name="customerStatus" value="customer" label="לקוח קיים" />
                </label>
              </fieldset>

              {status === "customer" && (
                <div className="form-field">
                  <InputField name="phoneOrEmail" label="טלפון או מייל לזיהוי" type="text" required />
                </div>
              )}

              {status === "valid" && (
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

              <div className="form-field">
                <InputField name="startDate" label="תאריך התחלה" type="date" required />
              </div>
              <div className="form-field">
                <InputField name="startTime" label="שעת התחלה" type="time" required />
              </div>
              <div className="form-field">
                <InputField name="endDate" label="תאריך סיום" type="date" required />
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