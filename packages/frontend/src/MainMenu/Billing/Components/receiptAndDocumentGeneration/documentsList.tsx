import { GeneratedDocument } from "../../../../../../backend/src/types/document";
import { ID } from "../../../../../../backend/src/types/core";
export const DocumentList = () => {

//functions
// שליפת כל המסמכים
const fetchGeneratedDocuments = async (): Promise<GeneratedDocument[]> => {
    return [];
};
// חיפוש מסמכים לפי טקסט (למשל לפי מספר מסמך או שם לקוח)
const handleSearch = (query: string): void => {};

// סינון מסמכים לפי סוג מסמך/סטטוס/תאריכים
const handleFilter = (filter: { type?: DocumentType; dateFrom?: string; dateTo?: string }): void => {};

// מחיקת מסמך
const handleDeleteDocument = async (documentId: ID): Promise<void> => {};



    return (
        <div>
            <h1>Document List</h1>
        </div>
    );
};