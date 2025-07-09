import React, { useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { Button } from "../../../Common/Components/BaseComponents/Button";
import { Form } from "../../../Common/Components/BaseComponents/Form";
import { SelectField } from "../../../Common/Components/BaseComponents/Select";
import { useBookingStore } from "../../../Stores/Workspace/bookingStore";
import { v4 as uuidv4 } from "uuid";
import { BookingStatus } from "../../../../../shared-types/booking";


export enum MeetingRoomManagement {
  MEETING_ROOM = "MEETING_ROOM",
  LUENGE = "LUENGE",
}

const roomOptions = Object.entries(MeetingRoomManagement).map(([key, value]) => ({
  label: key.replace("_", " ").toUpperCase(),
  value,
}));

type FormFields = {
  customerStatus: "valid" | "customer";
  phoneOrEmail?: string;
  customerId?: string;
  name?: string;
  phone?: string;
  email?: string;
  selectedRoom: MeetingRoomManagement;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export function RoomReservations() {
  const methods = useForm<FormFields>({
    defaultValues: {
      customerStatus: "valid",
      selectedRoom: MeetingRoomManagement.MEETING_ROOM,
    },
    mode: "onSubmit",
  });

  const { createBooking ,getCustomerByPhoneOrEmail} = useBookingStore();
  const status = useWatch({ control: methods.control, name: "customerStatus" });
  const phoneOrEmail = useWatch({ control: methods.control, name: "phoneOrEmail" });

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

    const base = {
      id: uuidv4(),
      roomId: data.selectedRoom,
      roomName: data.selectedRoom,
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
          if (customer) {
            data.customerId = customer.id;
            data.name = customer.name;
            data.phone = customer.phone;
            data.email = customer.email;
          } else {
            alert("לא נמצא לקוח עם הטלפון או המייל שסופקו");
            return;
          }
        }
      } else {
        // ולידציה לליד חדש
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
      }
    } catch (error) {
      console.error("שגיאה ביצירת ההזמנה:", error);
      alert("אירעה שגיאה ביצירת ההזמנה");
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <legend>סטטוס לקוח</legend>
          <label>
            <InputField type="radio" name="customerStatus" value="valid" label="וליד חדש" />
          </label>
          <label>
            <InputField type="radio" name="customerStatus" value="customer" label="לקוח קיים" />
          </label>
        </fieldset>

        {status === "customer" && (
          <InputField type="text" name="phoneOrEmail" label="טלפון או מייל לזיהוי" required
          />
        )}

        {status === "valid" && (
          <>
            <InputField name="name" label="שם" type="text" required />
            <InputField name="phone" label="טלפון" type="tel" required />
            <InputField name="email" label="מייל" type="email" required />
        </>)}

        <SelectField  name="selectedRoom" label="בחירת חדר" options={roomOptions}/>
        <InputField name="startDate" label="תאריך התחלה" type="date" required />
        <InputField name="startTime" label="שעת התחלה" type="time" required />
        <InputField name="endDate" label="תאריך סיום" type="date" required />
        <InputField name="endTime" label="שעת סיום" type="time" required />

        <Button type="submit">שלח</Button>
      </Form>
    </FormProvider>
  );
}
