import { useState } from "react";

export enum MeetingRoomManagement {
    MEETING_ROOM = 'MEETING_ROOM',
    LUENGE = 'LUENGE'
  }
  

export default function BookingForm() {
  const [status, setStatus] = useState("valid");
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(MeetingRoomManagement.MEETING_ROOM);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e:any) => {
    e.preventDefault();

    if (status === "customer") {
      // כאן תכתבי לוגיקה לחפש פרטי לקוח לפי מזהה
      console.log("חיפוש פרטי לקוח עבור מזהה:", customerId);
    } else {
      // כאן שליחה של פרטי וליד חדש
      console.log("פרטי וליד חדש:", { name, phone, email, selectedRoom,
        startDate,startTime,endDate,endTime });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>סטטוס</legend>
        <label>
          <input
            type="radio"
            name="customer"
            value="valid"
            checked={status === "valid"}
            onChange={() => setStatus("valid")}
          />
          וליד חדש
        </label>
        <label>
          <input
            type="radio"
            name="customer"
            value="customer"
            checked={status === "customer"}
            onChange={() => setStatus("customer")}
          />
          לקוח קיים
        </label>
      </fieldset>

      {status === "customer" && (
        <div>
          <label>
            מזהה לקוח:
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            />
          </label>
          {/* כאן אפשר להוסיף הצגת פרטי הלקוח אחרי שמוצאים */}
          <p>כאן תוצג טבלת פרטי הלקוח לפי המזהה</p>
        </div>
      )}

      {status === "valid" && (
        <div>
          <label>
            שם:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            טלפון:
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <label>
            מייל:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
      )}
<label>
        בחירת חדר:
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value as MeetingRoomManagement)}
        >
          <option value={MeetingRoomManagement.MEETING_ROOM}>Meeting Room</option>
          <option value={MeetingRoomManagement.LUENGE}>Lounge</option>
        </select>
      </label>

      <label>
        תאריך התחלה:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </label>

      <label>
        שעת התחלה:
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </label>

      <label>
        תאריך סיום:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </label>

      <label>
        שעת סיום:
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </label>
      <button type="submit">שלח</button>
    </form>
  );
}
