import { DocumentTemplate } from "../../../../../../backend/src/types/document";
import { ValidationResult } from "../../../../../../backend/src/types/validationResult";
import { ID } from "../../../../../../backend/src/types/core";
import { useReceiptAndDocumentsStore } from "../../../../Stores/Billing/receiptAndDocumentsStore";
export const DocumentTemplateForm = () => {
  const { fetchTemplateDetails, handleFieldChange, validateTemplateForm,
    handleCreateTemplate, handleUpdateTemplate
  } = useReceiptAndDocumentsStore();
  //in the store



  return (
    <div>
      <h2>Document Template Form</h2>
      {/* Add form fields and logic here */}
    </div>
  );
}





