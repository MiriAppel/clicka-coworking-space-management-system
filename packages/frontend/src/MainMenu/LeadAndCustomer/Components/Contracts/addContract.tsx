import React, { useState } from "react";
import { z } from "zod";
import { Form } from "../../../../Common/Components/BaseComponents/Form";
import { InputField } from "../../../../Common/Components/BaseComponents/Input";
import { SelectField } from "../../../../Common/Components/BaseComponents/Select";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { FileInputField } from "../../../../Common/Components/BaseComponents/FileInputFile";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";
import { useContractStore } from "../../../../Stores/LeadAndCustomer/contractsStore";


// enums
export enum ContractStatus {
  DRAFT = "DRAFT",
  PENDING_SIGNATURE = "PENDING_SIGNATURE",
  SIGNED = "SIGNED",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  TERMINATED = "TERMINATED",
}

export enum WorkspaceType {
  PRIVATE_ROOM = "PRIVATE_ROOM",
  DESK_IN_ROOM = "DESK_IN_ROOM",
  OPEN_SPACE = "OPEN_SPACE",
  KLIKAH_CARD = "KLIKAH_CARD",
}

// מיפויים לעברית
const statusLabels: Record<ContractStatus, string> = {
  [ContractStatus.DRAFT]: "טיוטה",
  [ContractStatus.PENDING_SIGNATURE]: "ממתין לחתימה",
  [ContractStatus.SIGNED]: "נחתם",
  [ContractStatus.ACTIVE]: "פעיל",
  [ContractStatus.EXPIRED]: "פג תוקף",
  [ContractStatus.TERMINATED]: "הסתיים",
};

const workspaceTypeLabels: Record<WorkspaceType, string> = {
  [WorkspaceType.PRIVATE_ROOM]: "חדר פרטי",
  [WorkspaceType.DESK_IN_ROOM]: "שולחן בחדר",
  [WorkspaceType.OPEN_SPACE]: "אופן ספייס",
  [WorkspaceType.KLIKAH_CARD]: "כרטיס קליקה",
};

// סכימה לטופס (Zod)
const contractSchema = z.object({
  customerId: z.string().nonempty("שדה חובה"),
  status: z.nativeEnum(ContractStatus),
  startDate: z.string(),
  endDate: z.string().optional(),
  workspaceType: z.nativeEnum(WorkspaceType),
  workspaceCount: z.coerce.number().min(1),
  monthlyRate: z.coerce.number().min(0),
  duration: z.coerce.number().min(1),
  renewalTerms: z.string().nonempty(),
  terminationNotice: z.coerce.number().min(0),
  specialConditions: z.string().optional(),
  documents: z.any().optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

export const AddContract = () => {
  const [loading, setLoading] = useState(false);
  const { handleCreateContract } = useContractStore();
  const navigate = useNavigate();

  const handleSubmit = async (data: ContractFormData) => {
    setLoading(true);
    const now = new Date().toISOString();
    // פיצול התנאים המיוחדים למערך
    const specialConditions = data.specialConditions
      ? data.specialConditions.split(",").map((s) => s.trim())
      : [];
    const payload = {
      customer_id: data.customerId,
      status: data.status,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      version: 1,
      created_at: now,
      updated_at: now,
      documents: data.documents ?? [],
      terms: {
        workspaceType: data.workspaceType,
        workspaceCount: data.workspaceCount,
        monthlyRate: data.monthlyRate,
        duration: data.duration,
        renewalTerms: data.renewalTerms,
        terminationNotice: data.terminationNotice,
        specialConditions: specialConditions,
        workspace_type: data.workspaceType,
        workspace_count: data.workspaceCount,
        monthly_rate: data.monthlyRate,
        renewal_terms: data.renewalTerms,
        termination_notice: data.terminationNotice,
        special_conditions: specialConditions,
      },
    };
    try {
      await handleCreateContract(payload);
      showAlert("הוספה", "החוזה נוסף בהצלחה", "success");
      navigate("/leadAndCustomer/contracts/");
      setLoading(false);
    } catch (err) {
      console.error(err);
      showAlert("הוספה", "שגיאה בהוספת חוזה", "error");
      setLoading(false);
      return;
    } 
  };

  return (
    <div dir="rtl" className="max-w-xl mx-auto p-6 border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        הוספת חוזה חדש
      </h2>

      <Form<ContractFormData>
        schema={contractSchema}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <InputField name="customerId" label="מזהה לקוח" required />
        <SelectField
          name="status"
          label="סטטוס"
          options={Object.entries(statusLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          required
        />
        <InputField name="startDate" label="תאריך התחלה" type="date" required />
        <InputField name="endDate" label="תאריך סיום" type="date" />

        <SelectField
          name="workspaceType"
          label="סוג עמדה"
          options={Object.entries(workspaceTypeLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          required
        />

        <InputField
          name="workspaceCount"
          label="מספר עמדות"
          type="number"
          required
        />
        <InputField name="monthlyRate" label="תעריף חודשי" type="number" required />
        <InputField name="duration" label="משך בחודשים" type="number" required />
        <InputField name="renewalTerms" label="תנאי חידוש" required />
        <InputField
          name="terminationNotice"
          label="ימי התראה"
          type="number"
          required
        />
        <InputField
          name="specialConditions"
          label="תנאים מיוחדים (מופרדים בפסיקים)"
        />
        <FileInputField name="documents" label="מסמכים (אפשרי)" multiple />

        <Button type="submit" variant="primary" size="md" disabled={loading}>
          {loading ? "שולח..." : "שמור חוזה"}
        </Button>
      </Form>
    </div>
  );
};
