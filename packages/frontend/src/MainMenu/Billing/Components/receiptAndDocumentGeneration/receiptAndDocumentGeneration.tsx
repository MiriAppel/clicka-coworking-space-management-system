import { GenerateDocumentRequest, GeneratedDocument, DocumentTemplate, DocumentType } from "../../../../../../types/document";
import { ID } from "../../../../../../types/core";
import { useReceiptAndDocumentsStore } from "../../../../Stores/Billing/receiptAndDocumentsStore";
export const ReceiptAndDocumentGeneration = () => {
    const { fetchGeneratedDocuments, fetchDocumentTemplates, generateDocument
        , downloadDocument, sendDocumentByEmail
    } = useReceiptAndDocumentsStore();
    // Functions
   
    return (
        <div>
            <h1>Receipt And Document Generation</h1>
        </div>
    )
}