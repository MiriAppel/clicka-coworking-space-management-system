import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAssignmentStore } from "../../../Stores/Workspace/assigmentStore";

interface AssignmentFormProps {
  initialValues?: any;
  customers?: { id: string; name: string }[];
  onSubmit?: (data: any) => Promise<void>;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  initialValues = {},
  customers = [],
  onSubmit,
}) => {
  const {
    spaces,
    loading,
    error,
    getAllSpaces,
    createAssignment,
    clearError,
  } = useAssignmentStore();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      ...initialValues,
      assignedDate: initialValues.assignedDate
        ? initialValues.assignedDate.slice(0, 10)
        : "",
      unassignedDate: initialValues.unassignedDate
        ? initialValues.unassignedDate.slice(0, 10)
        : "",
    },
  });

  useEffect(() => {
    getAllSpaces();
    return () => clearError();
  }, [getAllSpaces, clearError]);

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
    return <div className="p-4 text-center">טוען...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="p-4 bg-white rounded shadow max-w-md mx-auto"
    >
      <h2 className="text-lg font-bold mb-4">הקצאת חלל עבודה</h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          שגיאה: {error}
        </div>
      )}

      <label className="block mb-2">
        חלל עבודה:
        <select
          {...register("workspaceId", { required: true })}
          className="block w-full mt-1 border rounded"
          disabled={!!initialValues.workspaceId || loading}
        >
          <option value="">בחר חלל</option>
          {spaces.map((w: any) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-2">
        לקוח:
        <select
          {...register("customerId", { required: true })}
          className="block w-full mt-1 border rounded"
        >
          <option value="">בחר לקוח</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-2">
        תאריך הקצאה:
        <input
          type="date"
          {...register("assignedDate", { required: true })}
          className="block w-full mt-1 border rounded"
        />
      </label>

      <label className="block mb-2">
        תאריך סיום (לא חובה):
        <input
          type="date"
          {...register("unassignedDate")}
          className="block w-full mt-1 border rounded"
        />
      </label>

      <label className="block mb-2">
        הערות:
        <textarea
          {...register("notes")}
          className="block w-full mt-1 border rounded"
        />
      </label>

      <label className="block mb-2">
        מוקצה ע"י:
        <input
          type="text"
          {...register("assignedBy", { required: true })}
          className="block w-full mt-1 border rounded"
        />
      </label>

      <label className="block mb-2">
        סטטוס:
        <select
          {...register("status", { required: true })}
          className="block w-full mt-1 border rounded"
        >
          <option value="ACTIVE">פעיל</option>
          <option value="INACTIVE">לא פעיל</option>
          <option value="ENDED">הסתיים</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
      >
        {loading ? "שומר..." : "שמור"}
      </button>
    </form>
  );
};