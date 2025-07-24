import { Table, TableColumn } from "../../../Common/Components/BaseComponents/Table"
import { useBookingStore } from "../../../Stores/Workspace/bookingStore"
import {  useEffect, useState } from "react"
import { showAlert } from "../../../Common/Components/BaseComponents/ShowAlert"
import { useNavigate } from "react-router-dom"
import { Button } from "../../../Common/Components/BaseComponents/Button"
// import { useAuthStore } from "../../../Stores/CoreAndIntegration/useAuthStore"
import { useAssignmentStore } from "../../../Stores/Workspace/assigmentStore"
import { SpaceAssign } from "shared-types/spaceAssignment"
import Swal from "sweetalert2"


// const { user } = useAuthStore()
// const userRole = user?.role;
export const AssigmentTable = () => {
  const { assignments , deleteAssignment,getAssignments } = useAssignmentStore();
   const {bookings,getAllBookings,deleteBooking,bookingApproval} = useBookingStore()
   const [isLoading, setIsLoading] = useState(false);
const allAssignmentFields: (keyof SpaceAssign)[] = [
  'workspaceId', 'customerId', 'assignedDate', 'unassignedDate', 'status', 'assignedBy', 'notes'
];
const navigate = useNavigate();
// תרגום לתצוגה בלבד
const fieldLabels: Partial<Record<keyof SpaceAssign, string>> = {
  workspaceId: 'מרחב עבודה',
  customerId: 'לקוח',
  assignedDate: 'תאריך שיבוץ',
  unassignedDate: 'תאריך ביטול שיבוץ',
  notes: 'הערות',
  assignedBy: 'שובץ ע"י',
  status: 'סטטוס',
};
const getFieldLabel = (field: keyof SpaceAssign): string => {
  return fieldLabels[field] || field;
};
const columns: TableColumn<SpaceAssign>[] = [
  ...allAssignmentFields.map(field => ({
     header: fieldLabels[field] || field,
    accessor: field          
  })),
];

useEffect(() => {
  if (assignments.length === 0) {
    setIsLoading(true);
    getAssignments()
    setIsLoading(false);
  }
}, []);
//מחיקת הזמנה 
  const handleDelete = async (booking: SpaceAssign) => {
    const result = await Swal.fire({
      text: ``,
      icon: 'question',
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

//עדכון הזמנה
   const handleUpdate = (booking: SpaceAssign) => {
    navigate(`/updateBooking`, { state: { booking } });
    console.log('Update booking:', booking);
  };

  
   return <div>{/* //טבלת הזמנות */}
{/* {(!bookings || bookings.length === 0) && <h1 className="text-center text-gray-500">אין הזמנות זמינות</h1>} */}
    <h1  className="text-3xl font-bold text-center text-blue-600 my-4">הזמנות</h1>
    {isLoading && <h1>טוען...</h1>}
   
   {!isLoading && <>
<Button onClick={()=>navigate('/createBooking')}>להוספת הזמנה חדשה</Button>
    <Table<SpaceAssign>
        columns={columns}
        data={assignments}
         onUpdate={handleUpdate}
         onDelete={handleDelete}
        className="shadow-lg"   
      /></>}
    </div>
}