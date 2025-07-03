import React from "react";
import { useForm } from "react-hook-form";

export const AssignmentForm = ({
  initialValues = {},
  customers,
  workspaces,
  onSubmit,
}) => {
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

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}
      className="p-4 bg-white rounded shadow max-w-md mx-auto"
    >
      <h2 className="text-lg font-bold mb-4">הקצאת חלל עבודה</h2>

      <label className="block mb-2">
        חלל עבודה:
        <select
          {...register("workspaceId", { required: true })}
          className="block w-full mt-1 border rounded"
          disabled={!!initialValues.workspaceId}
        >
          <option value="">בחר חלל</option>
          {workspaces.map((w) => (
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
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        שמור
      </button>
    </form>
  );
};