// import { useState } from "react";

// import { Button } from "../../../Common/Components/BaseComponents/Button";
// import { InputField } from "../../../Common/Components/BaseComponents/Input";

// import { FormProvider } from "react-hook-form";
// export enum MeetingRoomManagement {
//     MEETING_ROOM = 'MEETING_ROOM',
//     LUENGE = 'LUENGE'
//   }

// export default function BookingForm() {
//   const [status, setStatus] = useState("valid");
//   const [customerId, setCustomerId] = useState("");
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [selectedRoom, setSelectedRoom] = useState(MeetingRoomManagement.MEETING_ROOM);
//   const [startDate, setStartDate] = useState('');
//   const [startTime, setStartTime] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [endTime, setEndTime] = useState('');

//   const handleSubmit = (e:any) => {
//     e.preventDefault();

//     if (status === "customer") {
//       // כאן תכתבי לוגיקה לחפש פרטי לקוח לפי מזהה
//       console.log("חיפוש פרטי לקוח עבור מזהה:", customerId);
//     } else {
//       // כאן שליחה של פרטי וליד חדש
//       console.log("פרטי וליד חדש:", { name, phone, email, selectedRoom,
//         startDate,startTime,endDate,endTime });
//     }
//   };

//   return (
//     <FormProvider {...methods}>
//     <form onSubmit={handleSubmit}>
//       <fieldset>
//         <legend>סטטוס</legend>
//         <label>
//           <InputField
//             type="radio"
//             name="customer"
//             value="valid"
//             checked={status === "valid"}
//             onChange={() => setStatus("valid")}
//           />
//           וליד חדש
//         </label>
//         <label>
//           <InputField
//             type="radio"
//             name="customer"
//             value="customer"
//             checked={status === "customer"}
//             onChange={() => setStatus("customer")}
//           />
//           לקוח קיים
//         </label>
//       </fieldset>

//       {status === "customer" && (
//         <div>
//           <label>
//             מזהה לקוח:
//             <InputField
//               type="text"
//               value={customerId}
//               onChange={(e:any) => setCustomerId(e.target.value)}
//               required
//             />
//           </label>
//           {/* כאן אפשר להוסיף הצגת פרטי הלקוח אחרי שמוצאים */}
//           <p>כאן תוצג טבלת פרטי הלקוח לפי המזהה</p>
//         </div>
//       )}

//       {status === "valid" && (
//         <div>
//           <label>
//             שם:
//             <InputField
//               type="text"
//               value={name}
//               onChange={(e:any) => setName(e.target.value)}
//               required
//             />
//           </label>

//           <label>
//             טלפון:
//             <InputField
//               type="tel"
//               value={phone}
//               onChange={(e:any) => setPhone(e.target.value)}
//               required
//             />
//           </label>

//           <label>
//             מייל:
//             <InputField
//               type="email"
//               value={email}
//               onChange={(e:any) => setEmail(e.target.value)}
//               required
//             />
//           </label>
//         </div>
//       )}
//   <label>
//         בחירת חדר:
//         <select
//           value={selectedRoom}
//           onChange={(e) => setSelectedRoom(e.target.value as MeetingRoomManagement)}
//         >
//           <option value={MeetingRoomManagement.MEETING_ROOM}>Meeting Room</option>
//           <option value={MeetingRoomManagement.LUENGE}>Lounge</option>
//         </select>
//       </label>

//       <label>
//         תאריך התחלה:
//         <InputField
//           type="date"
//           value={startDate}
//           onChange={(e:any) => setStartDate(e.target.value)}
//           required
//         />
//       </label>

//       <label>
//         שעת התחלה:
//         <InputField
//           type="time"
//           value={startTime}
//           onChange={(e:any) => setStartTime(e.target.value)}
//           required
//         />
//       </label>

//       <label>
//         תאריך סיום:
//         <InputField
//           type="date"
//           value={endDate}
//           onChange={(e:any) => setEndDate(e.target.value)}
//           required
//         />
//       </label>

//       <label>
//         שעת סיום:
//         <InputField
//           type="time"
//           value={endTime}
//           onChange={(e:any) => setEndTime(e.target.value)}
//           required
//         />
//       </label>
//       <Button type="submit">שלח</Button>
//     </form>
//    </FormProvider>
//   );
// }
import React from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { Button } from "../../../Common/Components/BaseComponents/Button";
import { Form } from "../../../Common/Components/BaseComponents/Form";
import { SelectField } from "../../../Common/Components/BaseComponents/Select";

export enum MeetingRoomManagement {
  MEETING_ROOM = "MEETING_ROOM",
  LUENGE = "LUENGE",
}
const roomOptions = Object.entries(MeetingRoomManagement).map(([key, value]) => ({
    label: key.replace('_', ' ').toUpperCase(), // או תרגום אחר
    value,
  }));
  
type FormFields = {
  customerStatus: "valid" | "customer";
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

export default function BookingForm() {
  const methods = useForm<FormFields>({
    defaultValues: {
      customerStatus: "valid",
      selectedRoom: MeetingRoomManagement.MEETING_ROOM,
    },
    mode: "onSubmit",
  });

  const status = useWatch({
    control: methods.control,
    name: "customerStatus",
  });

  const handleSubmit = (data: FormFields) => {
    if (data.customerStatus === "customer") {
      console.log("חיפוש פרטי לקוח עבור מזהה:", data.customerId);
    } else {
      console.log("פרטי וליד חדש:", {
        name: data.name,
        phone: data.phone,
        email: data.email,
        selectedRoom: data.selectedRoom,
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <legend>סטטוס</legend>
          <label>
            <InputField
              type="radio"
              name="customerStatus"
              value="valid"
              label="וליד חדש"
            />
          </label>
          <label>
            <InputField
              type="radio"
              name="customerStatus"
              value="customer"
              label="לקוח קיים"
            />
          </label>
        </fieldset>

        {status === "customer" && (
          <InputField
            type="text"
            name="customerId"
            label="מזהה לקוח"
            required
          />
        )}

        {status === "valid" && (
          <>
            <InputField name="name" label="שם" type="text" required />
            <InputField name="phone" label="טלפון" type="tel" required />
            <InputField name="email" label="מייל" type="email" required />
          </>
        )}

        <label>
          בחירת חדר:
          <SelectField
                name="selectedRoom"
                label="בחירת חדר"
                options={roomOptions}/>

        </label>

        <InputField name="startDate" label="תאריך התחלה" type="date" required />
        <InputField name="startTime" label="שעת התחלה" type="time" required />
        <InputField name="endDate" label="תאריך סיום" type="date" required />
        <InputField name="endTime" label="שעת סיום" type="time" required />

        <Button type="submit">שלח</Button>
      </Form>
    </FormProvider>
  );
}
