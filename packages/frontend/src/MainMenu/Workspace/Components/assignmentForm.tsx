// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useAssignmentStore } from "../../../Stores/Workspace/assigmentStore";
// import { WorkspaceType } from "shared-types"; 
// import { useLocation } from "react-router-dom";

// const location = useLocation();
// const { customerId, customerName, workspaceType } = location.state || {};

// interface AssignmentFormProps {
//   onSubmit?: (data: any) => Promise<void>;
//   title?: string;
//   // Props פשוטים וישירים
//   workspaceId?: string | number;
//   workspaceName?: string;
//   workspaceType?: WorkspaceType;
//   customerId?: string | number;
//   customerName?: string;
//   assignedDate?: string;
//   unassignedDate?: string;
//   notes?: string;
//   assignedBy?: string;
//   status?: 'ACTIVE' | 'SUSPENDED' | 'ENDED';
// }

// export const AssignmentForm: React.FC<AssignmentFormProps> = ({
//   onSubmit,
//   title = "הקצאת חלל עבודה",
//   workspaceId,
//   workspaceName,
//   workspaceType,
//   customerId,
//   customerName,
//   assignedDate,
//   unassignedDate,
//   notes,
//   assignedBy,
//   status = 'ACTIVE',
// }) => {
//   const {
//     spaces,
//     customers,
//     loading,
//     error,
//     conflictCheck, 
//     getAllSpaces,
//     getAllCustomers,
//     createAssignment,
//     checkConflicts,
//     clearError,
//   } = useAssignmentStore();

//   const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

//   const { register, handleSubmit, reset, watch } = useForm({
//     defaultValues: {
//       workspaceId: workspaceId || "",
//       customerId: customerId || "",
//       assignedDate: assignedDate || "",
//       unassignedDate: unassignedDate || "",
//       notes: notes || "",
//       assignedBy: assignedBy || "",
//       status: status,
//     },
//   });

//   // מעקב אחר שינויים בשדות
//   const watchedWorkspaceId = watch("workspaceId");
//   const watchedAssignedDate = watch("assignedDate");
//   const watchedUnassignedDate = watch("unassignedDate");

//  useEffect(() => { 
//   const loadData = async () => {
//     try {
//       console.log('Loading data...'); // debug
//       await getAllSpaces();
//       await getAllCustomers();
//       console.log('Data loaded successfully'); // debug
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };

//   loadData();

//   // cleanup
//   return () => {
//     clearError();
//   };
// }, []); // ← רק פעם אחת בטעינה

//   // בדיקת קונפליקטים בזמן אמת
//   useEffect(() => {
//     const checkForConflicts = async () => {
//       if (watchedWorkspaceId && watchedAssignedDate) {
//         setIsCheckingConflicts(true);
//         try {
//           await checkConflicts(
//             watchedWorkspaceId,
//             watchedAssignedDate,
//             watchedUnassignedDate || undefined
//           );
//         } catch (error) {
//           console.error('Error checking conflicts:', error);
//         } finally {
//           setIsCheckingConflicts(false);
//         }
//       }
//     };

//     const timeoutId = setTimeout(checkForConflicts, 500);
//     return () => clearTimeout(timeoutId);
//   }, [watchedWorkspaceId, watchedAssignedDate, watchedUnassignedDate, checkConflicts]);

// const filteredSpaces = React.useMemo(() => {
//     if (!workspaceType) {
//       return spaces;
//     }

//     console.log('Filtering spaces by type:', workspaceType);
//     console.log('Available spaces:', spaces.map(s => ({ id: s.id, name: s.name, type: s.type })));

//     const filtered = spaces.filter(space => {
//       // נקה את הערך מגרשיים מיותרים אם יש
//       const spaceType = typeof space.type === 'string' 
//         ? space.type.replace(/^"(.*)"$/, '$1') 
//         : space.type;

//       return spaceType === workspaceType;
//     });

//     console.log('Filtered spaces:', filtered);
//     return filtered;
//   }, [spaces, workspaceType]);

// // הוספת useEffect נפרד לdebug
// useEffect(() => {
//   console.log('Customers updated:', customers);
//   console.log('Spaces updated:', spaces);
//   console.log('Loading:', loading);
//   console.log('Error:', error);
// }, [customers, spaces, loading, error]);

//   const handleFormSubmit = async (data: any) => {
//     try {
//       if (onSubmit) {
//         await onSubmit(data);
//       } else {
//         await createAssignment(data);
//       }
//       reset();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-4 text-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="mt-2">טוען נתונים...</p>
//       </div>
//     );
//   }
// console.log('Render - customers:', customers.length);
// console.log('Render - spaces:', spaces.length);
// console.log('Render - loading:', loading);
// console.log('Render - error:', error);

// if (loading) {
//   return (
//     <div className="p-4 text-center">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//       <p className="mt-2">טוען נתונים...</p>
//       <p className="text-xs text-gray-500">Customers: {customers.length}, Spaces: {spaces.length}</p>
//     </div>
//   );
// }
//   return (
//     <form
//       onSubmit={handleSubmit(handleFormSubmit)}
//       className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto"
//     >
//       <h2 className="text-xl font-bold mb-6 text-gray-800">{title}</h2>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           <strong>שגיאה:</strong> {error}
//         </div>
//       )}


//       {/* הצגת תוצאות בדיקת קונפליקטים */}
//       {isCheckingConflicts && (
//         <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
//           <div className="flex items-center">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
//             <span className="text-sm text-yellow-800">בודק קונפליקטים...</span>
//           </div>
//         </div>
//       )}

//       {conflictCheck && !isCheckingConflicts && (
//         <div className={`mb-4 p-3 rounded-md ${
//           conflictCheck.hasConflicts 
//             ? 'bg-red-50 border border-red-200' 
//             : 'bg-green-50 border border-green-200'
//         }`}>
//           <div className={`text-sm font-medium ${
//             conflictCheck.hasConflicts ? 'text-red-800' : 'text-green-800'
//           }`}>
//             {conflictCheck.message}
//           </div>

//           {conflictCheck.hasConflicts && conflictCheck.conflicts.length > 0 && (
//             <div className="mt-2 text-xs text-red-600">
//               <strong>קונפליקטים:</strong>
//               <ul className="mt-1 list-disc list-inside">
//                 {conflictCheck.conflicts.map((conflict, index) => (
//                   <li key={index}>
//                     {conflict.assignedDate} - {conflict.unassignedDate || 'ללא תאריך סיום'}
//                     {conflict.notes && ` (${conflict.notes})`}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}

//       {/* חלל עבודה */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           חלל עבודה: <span className="text-red-500">*</span>
//         </label>
//         {workspaceId ? (
//           <div className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
//             ✅ {workspaceName || `חלל ${workspaceId}`}
//             <input
//               type="hidden"
//               {...register("workspaceId", { required: "חובה לבחור חלל עבודה" })}
//             />
//           </div>
//         ) : (
//           <select
//             {...register("workspaceId", { required: "חובה לבחור חלל עבודה" })}
//             className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">בחר חלל עבודה</option>
//             {spaces.length > 0 && spaces.map((space) => (
//               <option key={space.id} value={space.id}>
//                 {space.name}  
//               </option>
//             ))}
//           </select>
//         )}
//       </div>

//       {/* לקוח */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           לקוח: <span className="text-red-500">*</span>
//         </label>
//         {customerId ? (
//           <div className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
//             ✅ {customerName || `לקוח ${customerId}`}
//             <input
//               type="hidden"
//               {...register("customerId", { required: "חובה לבחור לקוח" })}
//             />
//           </div>
//         ) : (
//           <select
//             {...register("customerId", { required: "חובה לבחור לקוח" })}
//             className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">בחר לקוח</option>
//             {customers.map((customer) => (
//               <option key={customer.id} value={customer.id}>
//                 {customer.name} {customer.email && `(${customer.email})`}
//               </option>
//             ))}
//           </select>
//         )}
//       </div>
//       {/* תאריך הקצאה */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           תאריך הקצאה: <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="date"
//           {...register("assignedDate", { required: "חובה להזין תאריך הקצאה" })}
//           className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* תאריך סיום */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           תאריך סיום (לא חובה):
//         </label>
//         <input
//           type="date"
//           {...register("unassignedDate")}
//           className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* הערות */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           הערות:
//         </label>
//         <textarea
//           {...register("notes")}
//           className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           rows={3}
//         />
//       </div>

//       {/* מוקצה ע"י */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           מוקצה ע"י: <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="text"
//           {...register("assignedBy", { required: "חובה להזין מי מקצה" })}
//           className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* סטטוס */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           סטטוס: <span className="text-red-500">*</span>
//         </label>
//         <select
//           {...register("status", { required: "חובה לבחור סטטוס" })}
//           className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="ACTIVE">פעיל</option>
//           <option value="SUSPENDED">מושעה</option>
//           <option value="ENDED">הסתיים</option>
//         </select>
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
//       >
//  {loading ? "שומר..." : conflictCheck?.hasConflicts ? "שמור למרות קונפליקטים" : "שמור הקצאה"}      </button>
//     </form>
//   );
// };


import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAssignmentStore } from "../../../Stores/Workspace/assigmentStore";
import { WorkspaceType } from "shared-types"; 
import { useLocation } from "react-router-dom"; // ✅ הוספתי לצורך קבלת נתונים מניווט

// ✅ מעכשיו כל הקריאות ל-location יהיו בתוך הקומפוננטה

interface AssignmentFormProps {
  onSubmit?: (data: any) => Promise<void>;
  title?: string;
  workspaceId?: string | number;
  workspaceName?: string;
  workspaceType?: WorkspaceType;
  customerId?: string | number;
  customerName?: string;
  assignedDate?: string;
  unassignedDate?: string;
  notes?: string;
  assignedBy?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'ENDED';
}

export const AssignmentForm: React.FC<AssignmentFormProps> = (props) => {
  const location = useLocation(); // ✅ שימוש תקין בתוך הקומפוננטה

  // ✅ שליפת נתונים שהועברו דרך ניווט
  const {
    customerId: customerIdFromState,
    customerName: customerNameFromState,
    workspaceType: workspaceTypeFromState,
  } = location.state || {};

  // ✅ שילוב בין props ובין location.state
  const customerId = props.customerId || customerIdFromState;
  const customerName = props.customerName || customerNameFromState;
  const workspaceType = props.workspaceType || workspaceTypeFromState;
  const workspaceId = props.workspaceId;
  const workspaceName = props.workspaceName;
  const assignedDate = props.assignedDate;
  const unassignedDate = props.unassignedDate;
  const notes = props.notes;
  const assignedBy = props.assignedBy;
  const status = props.status || 'ACTIVE';
  const onSubmit = props.onSubmit;
  const title = props.title || "הקצאת חלל עבודה";

  const {
    spaces,
    customers,
    loading,
    error,
    conflictCheck, 
    getAllSpaces,
    getAllCustomers,
    createAssignment,
    checkConflicts,
    clearError,
  } = useAssignmentStore();
  
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      workspaceId: workspaceId || "",
      customerId: customerId || "",
      assignedDate: assignedDate || "",
      unassignedDate: unassignedDate || "",
      notes: notes || "",
      assignedBy: assignedBy || "",
      status: status,
    },
  });

  const watchedWorkspaceId = watch("workspaceId");
  const watchedAssignedDate = watch("assignedDate");
  const watchedUnassignedDate = watch("unassignedDate");

  useEffect(() => {
    const loadData = async () => {
      try {
        await getAllSpaces();
        await getAllCustomers();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
    return () => {
      clearError();
    };
  }, []);

  useEffect(() => {
    const checkForConflicts = async () => {
      if (watchedWorkspaceId && watchedAssignedDate) {
        setIsCheckingConflicts(true);
        try {
          await checkConflicts(
            watchedWorkspaceId,
            watchedAssignedDate,
            watchedUnassignedDate || undefined
          );
        } catch (error) {
          console.error('Error checking conflicts:', error);
        } finally {
          setIsCheckingConflicts(false);
        }
      }
    };
    const timeoutId = setTimeout(checkForConflicts, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedWorkspaceId, watchedAssignedDate, watchedUnassignedDate, checkConflicts]);

  const filteredSpaces = React.useMemo(() => {
    if (!workspaceType) return spaces;
    return spaces.filter(space => {
      const spaceType = typeof space.type === 'string' 
        ? space.type.replace(/^"(.*)"$/, '$1') 
        : space.type;
      return spaceType === workspaceType;
    });
  }, [spaces, workspaceType]);

  const handleFormSubmit = async (data: any) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await createAssignment(data);
      }
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2">טוען נתונים...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-800">{title}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>שגיאה:</strong> {error}
        </div>
      )}

      {isCheckingConflicts && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            <span className="text-sm text-yellow-800">בודק קונפליקטים...</span>
          </div>
        </div>
      )}

      {conflictCheck && !isCheckingConflicts && (
        <div className={`mb-4 p-3 rounded-md ${
          conflictCheck.hasConflicts 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className={`text-sm font-medium ${
            conflictCheck.hasConflicts ? 'text-red-800' : 'text-green-800'
          }`}>
            {conflictCheck.message}
          </div>
          {conflictCheck.hasConflicts && conflictCheck.conflicts.length > 0 && (
            <div className="mt-2 text-xs text-red-600">
              <strong>קונפליקטים:</strong>
              <ul className="mt-1 list-disc list-inside">
                {conflictCheck.conflicts.map((conflict, index) => (
                  <li key={index}>
                    {conflict.assignedDate} - {conflict.unassignedDate || 'ללא תאריך סיום'}
                    {conflict.notes && ` (${conflict.notes})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* חלל עבודה */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          חלל עבודה: <span className="text-red-500">*</span>
        </label>
        {workspaceId ? (
          <div className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
            ✅ {workspaceName || `חלל ${workspaceId}`}
            <input
              type="hidden"
              {...register("workspaceId", { required: "חובה לבחור חלל עבודה" })}
            />
          </div>
        ) : (
          <select
            {...register("workspaceId", { required: "חובה לבחור חלל עבודה" })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">בחר חלל עבודה</option>
            {filteredSpaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* לקוח */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          לקוח: <span className="text-red-500">*</span>
        </label>
        {customerId ? (
          <div className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
            {customerName || `לקוח ${customerId}`}
            <input
              type="hidden"
              {...register("customerId", { required: "חובה לבחור לקוח" })}
            />
          </div>
        ) : (
          <select
            {...register("customerId", { required: "חובה לבחור לקוח" })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">בחר לקוח</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} {customer.email && `(${customer.email})`}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* תאריך הקצאה */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תאריך הקצאה: <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...register("assignedDate", { required: "חובה להזין תאריך הקצאה" })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* תאריך סיום */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תאריך סיום (לא חובה):
        </label>
        <input
          type="date"
          {...register("unassignedDate")}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* הערות */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">הערות:</label>
        <textarea
          {...register("notes")}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
        />
      </div>

      {/* מוקצה ע"י */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          מוקצה ע"י: <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("assignedBy", { required: "חובה להזין מי מקצה" })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* סטטוס */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          סטטוס: <span className="text-red-500">*</span>
        </label>
        <select
          {...register("status", { required: "חובה לבחור סטטוס" })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="ACTIVE">פעיל</option>
          <option value="SUSPENDED">מושעה</option>
          <option value="ENDED">הסתיים</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "שומר..." : conflictCheck?.hasConflicts ? "שמור למרות קונפליקטים" : "שמור הקצאה"}
      </button>
    </form>
  );
};
