import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAssignmentStore } from "../../../Stores/Workspace/assigmentStore";

interface AssignmentFormProps {
  onSubmit?: (data: any) => Promise<void>;
  title?: string;
  // Props פשוטים וישירים
  workspaceId?: string | number;
  workspaceName?: string;
  customerId?: string | number;
  customerName?: string;
  assignedDate?: string;
  unassignedDate?: string;
  notes?: string;
  assignedBy?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ENDED';
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  onSubmit,
  title = "הקצאת חלל עבודה",
  workspaceId,
  workspaceName,
  customerId,
  customerName,
  assignedDate,
  unassignedDate,
  notes,
  assignedBy,
  status = 'ACTIVE',
}) => {
  const {
    spaces,
    customers,
    loading,
    error,
    getAllSpaces,
    getAllCustomers,
    createAssignment,
    clearError,
  } = useAssignmentStore();

  const { register, handleSubmit, reset } = useForm({
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

 useEffect(() => { 
  const loadData = async () => {
    try {
      console.log('Loading data...'); // debug
      await getAllSpaces();
      await getAllCustomers();
      console.log('Data loaded successfully'); // debug
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  loadData();
  
  // cleanup
  return () => {
    clearError();
  };
}, []); // ← רק פעם אחת בטעינה

// הוספת useEffect נפרד לdebug
useEffect(() => {
  console.log('Customers updated:', customers);
  console.log('Spaces updated:', spaces);
  console.log('Loading:', loading);
  console.log('Error:', error);
}, [customers, spaces, loading, error]);

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
console.log('Render - customers:', customers.length);
console.log('Render - spaces:', spaces.length);
console.log('Render - loading:', loading);
console.log('Render - error:', error);

if (loading) {
  return (
    <div className="p-4 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2">טוען נתונים...</p>
      <p className="text-xs text-gray-500">Customers: {customers.length}, Spaces: {spaces.length}</p>
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">בחר חלל עבודה</option>
            {spaces.length > 0 && spaces.map((space) => (
              <option key={space.id} value={space.id}>
                {space.name} {space.capacity && `(${space.capacity} מקומות)`}
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
            ✅ {customerName || `לקוח ${customerId}`}
            <input
              type="hidden"
              {...register("customerId", { required: "חובה לבחור לקוח" })}
            />
          </div>
        ) : (
          <select
            {...register("customerId", { required: "חובה לבחור לקוח" })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* הערות */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          הערות:
        </label>
        <textarea
          {...register("notes")}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* סטטוס */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          סטטוס: <span className="text-red-500">*</span>
        </label>
        <select
          {...register("status", { required: "חובה לבחור סטטוס" })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ACTIVE">פעיל</option>
          <option value="INACTIVE">לא פעיל</option>
          <option value="ENDED">הסתיים</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "שומר..." : "שמור הקצאה"}
      </button>
    </form>
  );
};