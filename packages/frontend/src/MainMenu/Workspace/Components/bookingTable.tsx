import { Booking } from "shared-types"
import { Table, TableColumn } from "../../../Common/Components/BaseComponents/Table"
import { useBookingStore } from "../../../Stores/Workspace/bookingStore"
import {  useEffect, useState } from "react"
import { showAlert } from "../../../Common/Components/BaseComponents/ShowAlert"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { Button } from "../../../Common/Components/BaseComponents/Button"
import { WithPermission } from "../../../Common/Components/WithPermission";
//import { useAuthStore } from "../../../Stores/CoreAndIntegration/useAuthStore"

// const { user } = useAuthStore()
// const userRole = user?.role;
export const BookingTable = () => {
   const {bookings,getAllBookings,deleteBooking,bookingApproval} = useBookingStore()
   const [isLoading, setIsLoading] = useState(false);
const allBookingFields: (keyof Booking)[] = [
  'roomName', 'customerName', 'externalUserName', 'externalUserEmail', 'externalUserPhone',
  'startTime', 'endTime', 'status', 'totalHours',
];
const navigate = useNavigate();
// תרגום לתצוגה בלבד
const fieldLabels: Partial<Record<keyof Booking, string>> = {
  roomName: 'שם חדר',
  customerName: 'שם לקוח',
  externalUserName: 'שם משתמש חיצוני',
  externalUserEmail: 'אימייל משתמש חיצוני',
  externalUserPhone: 'טלפון משתמש חיצוני',
  startTime: 'שעת התחלה',
  endTime: 'שעת סיום',
  status: 'סטטוס',
  totalHours: 'סך שעות',
  approvedBy: 'מאושר על ידי',
  id: 'מזהה'
};
const getFieldLabel = (field: keyof Booking): string => {
  return fieldLabels[field] || field;
};
const columns: TableColumn<Booking>[] = [
  ...allBookingFields.map(field => ({
    header: getFieldLabel(field), // תצוגה בעברית
    accessor: field,           // הנתונים באנגלית
  })),
  {
    header: getFieldLabel('approvedBy'),
    accessor: 'approvedBy' as keyof Booking,
    render: (value: any, row: Booking) => (
      <>
        {row.status !== 'APPROVED' && (
         < WithPermission userRole="ADMIN" allowedRoles={["ADMIN"]}>
        <Button
            className="text-blue-500"
            onClick={() => handleApproval(row)}
          >
            לאישור
          </Button>
        </WithPermission>
        
        )}
        {(row.status === 'APPROVED' && row.approvedBy) ? row.approvedBy : ''}
      </>
    )
  }
];
useEffect(() => {
  const fetchData = async () => {
    if (bookings.length === 0) {
      console.log("📢 calling getAllBookings");
      setIsLoading(true);  
      await getAllBookings(); 
      setIsLoading(false);
    }
  };
  fetchData();
}, [getAllBookings,setIsLoading,bookings.length]);
// const validBookings = bookings.filter(booking => 
//   booking && 
//   booking.id && 
//   (booking.roomName || booking.customerName || booking.externalUserName)
// );
const validBookings = bookings.filter(booking => 
  booking?.id &&
  (booking.roomName?.trim() || booking.customerName?.trim() || booking.externalUserName?.trim())
);
//מחיקת הזמנה 
  const handleDelete = async (booking: Booking) => {
    const result = await Swal.fire({
      text: `האם ברצונך למחוק את ההזמנה של ${booking.customerName || booking.externalUserName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'מחק',
      cancelButtonText: 'ביטול',
      reverseButtons: false 
    });
    if (result.isConfirmed) {
      try {
        await deleteBooking(booking.id!);
        showAlert('נמחק בהצלחה!','ההזמנה נמחקה מהמערכת','success');
        getAllBookings();
      } 
      catch (error) {
        console.error('Error deleting booking:', error);
        showAlert('שגיאה!','אירעה שגיאה במחיקת ההזמנה', 'error');
      }
    }
  };
  //אישור הזמנה
  const handleApproval = async (booking: Booking) => {
     const result = await Swal.fire({
       title: 'אישור הזמנה',
       text: `האם ברצונך לאשר את ההזמנה של ${booking.customerName || booking.externalUserName}?`,
       icon: 'question',
       showCancelButton: true,
       confirmButtonColor: '#28a745',
       cancelButtonColor: '#6c757d',
       confirmButtonText: 'אשר',
       cancelButtonText: 'ביטול'
     });

     if (result.isConfirmed) {
       try {
         const approvedBooking = await bookingApproval(booking.id!);
         console.log('תשובה מהפונקציה:', JSON.stringify(approvedBooking, null, 2));
         await getAllBookings();
         if (approvedBooking) {
           showAlert('אושר בהצלחה!',
          `ההזמנה של ${booking.customerName || booking.externalUserName} אושרה`,'success'   );
         }
       } catch (error) {
         showAlert('שגיאה!', 'אירעה שגיאה באישור ההזמנה', 'error');
}
     }
   };
//עדכון הזמנה
   const handleUpdate = (booking: Booking) => {
    navigate(`/updateBooking`, { state: { booking } });
    console.log('Update booking:', booking);
  };
console.log("bookings length:", bookings.length);
console.log("validBookings length:", validBookings.length);
  
   return <div>{/* //טבלת הזמנות */}
{/* {(!bookings || bookings.length === 0) && <h1 className="text-center text-gray-500">אין הזמנות זמינות</h1>} */}
    <h1  className="text-3xl font-bold text-center text-blue-600 my-4">הזמנות</h1>
    {isLoading && <h1>טוען...</h1>}
   
   {!isLoading && <>
<Button onClick={()=>navigate('/meetingRooms')}>להוספת הזמנה חדשה</Button>
    <Table<Booking>
        columns={columns}
        data={validBookings}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        className="shadow-lg"   
      /></>}
    </div>
}