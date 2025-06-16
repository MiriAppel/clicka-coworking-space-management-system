import { GenerateDocumentRequest, GeneratedDocument, DocumentTemplate, DocumentType } from "../../../../../../backend/src/types/document";
import { ID } from "../../../../../../backend/src/types/core";
export const ReceiptAndDocumentGeneration = () => {

// Functions
// שליפת כל המסמכים שנוצרו
const fetchGeneratedDocuments = async (): Promise<GeneratedDocument[]> => {
    return [];
};

// שליפת תבניות מסמך קיימות
const fetchDocumentTemplates = async (): Promise<DocumentTemplate[]> => {
    return [];
};

// יצירת מסמך חדש (קבלה, חשבונית, זיכוי וכו')
const generateDocument = async (request: GenerateDocumentRequest): Promise<GeneratedDocument> => {
 return {} as GeneratedDocument;
};

// הורדת מסמך
const downloadDocument = async (documentId: ID): Promise<void> => {};

// שליחת מסמך במייל
const sendDocumentByEmail = async (documentId: ID, email: string): Promise<void> => {};






    return (
        <div>
            <h1>Receipt And Document Generation</h1>
        </div>
    )
}