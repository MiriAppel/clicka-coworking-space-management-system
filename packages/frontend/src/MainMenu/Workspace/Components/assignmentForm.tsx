
import React, { useEffect, useState } from "react";
import { useAssignmentStore } from "../../../Stores/Workspace/assigmentStore";
import { useCustomerStore } from "../../../Stores/LeadAndCustomer/customerStore";
import { useWorkSpaceStore } from "../../../Stores/Workspace/workspaceStore";
import { useForm } from "react-hook-form";
import { Form } from "../../../Common/Components/BaseComponents/Form"
import { InputField } from "../../../Common/Components/BaseComponents/Input";
import { SelectField } from "../../../Common/Components/BaseComponents/Select";
import { Button } from "../../../Common/Components/BaseComponents/Button";
import { WorkspaceType } from "shared-types";
import { useLocation } from "react-router-dom";


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
  const location = useLocation(); // :white_check_mark: שימוש תקין בתוך הקומפוננטה
  // :white_check_mark: שליפת נתונים שהועברו דרך ניווט
  const {
    customerId: customerIdFromState,
    // customerName: customerNameFromState,
    // workspaceType: workspaceTypeFromState,
  } = location.state || {};
  // :white_check_mark: שילוב בין props ובין location.state
  const customerId = props.customerId || customerIdFromState;
  // const customerName = props.customerName || customerNameFromState;
  //const workspaceType = props.workspaceType || workspaceTypeFromState;
  const workspaceId = props.workspaceId;
  // const workspaceName = props.workspaceName;
  const assignedDate = props.assignedDate;
  const unassignedDate = props.unassignedDate;
  const notes = props.notes;
  const assignedBy = props.assignedBy;
  const status = props.status || 'ACTIVE';
  const onSubmit = props.onSubmit;
  const title = props.title || "הקצאת חלל עבודה";
  const {
    spaces,
    loading,
    error,
    conflictCheck,
    createAssignment,
    checkConflicts,
    clearError,
  } = useAssignmentStore();
  const { getAllWorkspace } = useWorkSpaceStore();
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

  const methods = useForm({
    defaultValues: {
      isForCustomer: true,
      workspaceId: workspaceId || "",
      customerId: customerId || "",
      assignedDate: assignedDate || "",
      unassignedDate: unassignedDate || "",
      daysOfWeek: [],
      notes: notes || "",
      assignedBy: assignedBy || "",
      status: status,
    },
  });
  const customers = useCustomerStore((s) => s.customers);
  const fetchCustomers = useCustomerStore((s) => s.fetchCustomers);

  const watch = methods.watch;
  const reset = methods.reset;
  const watchedWorkspaceId = watch("workspaceId");
  const watchedAssignedDate = watch("assignedDate");
  const watchedUnassignedDate = watch("unassignedDate");
  const watchedDaysOfWeek = watch("daysOfWeek");
  const isForCustomer = String(watch("isForCustomer")) === "true";

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data...'); // debug
        await getAllWorkspace();
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
  }, [getAllWorkspace,clearError]); // ← רק פעם אחת בטעינה
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers]);

  // בדיקת קונפליקטים בזמן אמת
  useEffect(() => {
    const checkForConflicts = async () => {
      const daysOfWeekForConflicts = (
        Array.isArray(watchedDaysOfWeek)
          ? watchedDaysOfWeek
          : watchedDaysOfWeek
            ? [watchedDaysOfWeek]
            : []
      ).map(Number).filter(n => !isNaN(n));

      if (watchedWorkspaceId && watchedAssignedDate) {
        setIsCheckingConflicts(true);
        try {
          await checkConflicts(
            watchedWorkspaceId,
            watchedAssignedDate,
            watchedUnassignedDate || undefined,
            undefined,
            daysOfWeekForConflicts
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
  }, [watchedWorkspaceId, watchedAssignedDate, watchedUnassignedDate, watchedDaysOfWeek, checkConflicts]);
  // const filteredSpaces = React.useMemo(() => {
  //   if (!workspaceType) {
  //     return spaces;
  //   }

  //   console.log('Filtering spaces by type:', workspaceType);
  //   console.log('Available spaces:', spaces.map(s => ({ id: s.id, name: s.name, type: s.type })));

  //   const filtered = spaces.filter(space => {
  //     const spaceType = typeof space.type === 'string'
  //       ? space.type.replace(/^"(.*)"$/, '$1')
  //       : space.type;

  //     return spaceType === workspaceType;
  //   });

  //   console.log('Filtered spaces:', filtered);
  //   return filtered;
  // }, [spaces, workspaceType]);

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
    <div className="flex justify-center items-center min-h-screen">
      <Form onSubmit={handleFormSubmit} methods={methods} label={title}>
        {/* הצגת תוצאות בדיקת קונפליקטים */}
        {isCheckingConflicts && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
              <span className="text-sm text-yellow-800">בודק קונפליקטים...</span>
            </div>
          </div>
        )}

        {conflictCheck && !isCheckingConflicts && (
          <div
            className={`mb-4 p-3 rounded-md ${conflictCheck.hasConflicts
              ? "bg-red-50 border border-red-200"
              : "bg-green-50 border border-green-200"
              }`}
          >
            <div
              className={`text-sm font-medium ${conflictCheck.hasConflicts ? "text-red-800" : "text-green-800"
                }`}
            >
              {conflictCheck.message}
            </div>

            {conflictCheck.hasConflicts && conflictCheck.conflicts.length > 0 && (
              <div className="mt-2 text-xs text-red-600">
                <strong>קונפליקטים:</strong>
                <ul className="mt-1 list-disc list-inside">
                  {conflictCheck.conflicts.map((conflict, index) => (
                    <li key={index}>
                      {conflict.assignedDate} -{" "}
                      {conflict.unassignedDate || "ללא תאריך סיום"}
                      {conflict.notes && ` (${conflict.notes})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
            סוג ההקצאה: <span className="text-red-500">*</span>
          </label>
          <div className="flex justify-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="true"
                {...methods.register("isForCustomer")}
              />
              עבור לקוח
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="false"
                {...methods.register("isForCustomer")}
              />
              לשימוש פנימי
            </label>
          </div>
        </div>

        {/* שדות טופס */}
        <SelectField
          label="חלל עבודה"
          name="workspaceId"
          options={spaces.map(space => ({ label: space.name, value: space.id || '' }))}
          required
        />

        {isForCustomer && (
          <SelectField
            label="לקוח"
            name="customerId"
            options={customers.map(customer => ({
              label: customer.name,
              value: customer.id || ''
            }))}
            required
          />
        )}
        <InputField
          label="תאריך הקצאה"
          name="assignedDate"
          type="date"
          required
        />
        <InputField
          label="תאריך סיום"
          name="unassignedDate"
          type="date"
        />
        <InputField
          label="הערות"
          name="notes"
          type="textarea"
        />
        <InputField
          label="מוקצה ע"
          name="assignedBy"
          required
        />
        <SelectField
          label="סטטוס"
          name="status"
          options={
            isForCustomer
              ? [{ label: "פעיל", value: "ACTIVE" }]
              : [
                { label: "לא פעיל", value: "SUSPENDED" },
                { label: "תחזוקה", value: "ENDED" },
              ]
          }
          required
        />
        <div className="mt-6 flex justify-center">
          <Button type="submit" variant="primary" size="md">
            בצע הקצאה
          </Button>
        </div>

      </Form>
    </div>
  );
};










