import { z } from "zod";
import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { Form } from "../../../../Common/Components/BaseComponents/Form";
import { SelectField } from "../../../../Common/Components/BaseComponents/Select";
import { InputField } from "../../../../Common/Components/BaseComponents/Input";
import { AddLeadInteractionRequest, Lead } from "shared-types";
import { useLeadsStore } from "../../../../Stores/LeadAndCustomer/leadsStore";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

export const interactionSchema = z.object({
  type: z.enum(["call", "email", "meeting"], { required_error: "חובה לבחור סוג" }),
  notes: z.string().min(1, "יש להזין הערות"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), "תאריך לא תקין"),
});

export type InteractionFormData = z.infer<typeof interactionSchema>;

interface InteractionFormProps {
  onSubmit: (lead: Lead) => Promise<any>;
  onCancel: () => void;
}

export const InteractionForm: React.FC<InteractionFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const {
    selectedLead,
    handleSelectLead
  } = useLeadsStore();

  const nav = useNavigate()
  return (
    <Form<InteractionFormData>
      label="הוספת אינטראקציה"
      schema={interactionSchema}
      onSubmit={async (data) => {
        try {
          const temp = {
            ...selectedLead,
            interactions: [
              ...(selectedLead?.interactions || []),
              { ...data, userEmail: selectedLead?.email }
            ]
          } as Lead;

          handleSelectLead(temp.id!);
          await onSubmit(temp);

          MySwal.fire({
            title: 'בוצע בהצלחה!',
            text: 'האינטראקציה נוספה',
            icon: 'success',
            confirmButtonText: 'סגור',
            customClass: {
              popup: 'swal2-rtl',
            }
          }).then(
            () => nav('/leadAndCustomer/leads/interactions')
          );

        } catch (error) {
          MySwal.fire({
            title: 'אירעה שגיאה',
            text: 'ניסיון ההוספה נכשל. נסה שוב.',
            icon: 'error',
            confirmButtonText: 'סגור',
            customClass: {
              popup: 'swal2-rtl',
            }
          });
        }
      }}
    >
      <SelectField
        name="type"
        label="סוג אינטראקציה"
        options={[
          { label: "שיחה", value: "call" },
          { label: "אימייל", value: "email" },
          { label: "פגישה", value: "meeting" },
        ]}
      />

      <InputField name="date" label="תאריך" type="date" />
      <InputField name="notes" label="הערות" />

      <div className="col-span-full flex justify-end gap-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          onClick={onCancel}
        >
          ביטול
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          שמור
        </button>
      </div>
    </Form>
  );
};
