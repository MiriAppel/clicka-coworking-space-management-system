import { Table, TableColumn } from "../../../Common/Components/BaseComponents/Table"
import {  useEffect, useState } from "react"
import { showAlert } from "../../../Common/Components/BaseComponents/ShowAlert"
import { useNavigate } from "react-router-dom"
import { Button } from "../../../Common/Components/BaseComponents/Button"

import { useAssignmentStore } from "../../../Stores/Workspace/assigmentStore"
import { SpaceAssign } from "shared-types/spaceAssignment"
import Swal from "sweetalert2"
// import { useAuthStore } from "../../../Stores/CoreAndIntegration/useAuthStore"
// const { user } = useAuthStore()
// const userRole = user?.role;
export const AssigmentTable = () => {
  const { assignments , deleteAssignment,getAssignments } = useAssignmentStore();
   const [isLoading, setIsLoading] = useState(false);
const allAssignmentFields: (keyof SpaceAssign)[] = [
  'workspaceId', 'customerId', 'assignedDate', 'unassignedDate', 'status', 'assignedBy'
];
const navigate = useNavigate();
// תרגום לתצוגה בלבד
const fieldLabels: Partial<Record<keyof SpaceAssign, string>> = {
  workspaceId: 'מרחב עבודה',
  customerId: 'לקוח',
  assignedDate: 'תאריך התחלה',
  unassignedDate: 'תאריך סיום',
  // notes: 'הערות',
  assignedBy: 'שובץ ע"י',
  status: 'סטטוס',
};
// const getFieldLabel = (field: keyof SpaceAssign): string => {
//   return fieldLabels[field] || field;
// };
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
}, [setIsLoading,getAssignments,assignments.length]);
//מחיקת הקצאה 
  const handleDelete = async (ass: SpaceAssign) => {
    const result = await Swal.fire({
      text: `מחק את ההקצאה של: ${ass.customerId}`,
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
        await deleteAssignment(ass.id!);
        showAlert('נמחק בהצלחה!','ההקצאה נמחקה מהמערכת','success');
        getAssignments();
      } 
      catch (error) {
        console.error('Error deleting booking:', error);
        showAlert('שגיאה!','אירעה שגיאה במחיקת הקצאה', 'error');
      }
    }
  };

//עדכון הקצאה
   const handleUpdate = (assignment: SpaceAssign) => {
    navigate(`/updateAssignment`, { state: { assignment} });
    console.log('updateAssignment:', assignment);
  };

  
   return <div>
    <h1  className="text-3xl font-bold text-center text-blue-600 my-4">הקצאות</h1>
    {isLoading && <h1>טוען...</h1>}
   
   {!isLoading && <>
<Button onClick={()=>navigate('/assignmentForm')}>להוספת הקצאה חדשה</Button>
    <Table<SpaceAssign>
        columns={columns}
        data={assignments}
         onUpdate={handleUpdate}
         onDelete={handleDelete}
        className="shadow-lg"   
      /></>}
    </div>
}