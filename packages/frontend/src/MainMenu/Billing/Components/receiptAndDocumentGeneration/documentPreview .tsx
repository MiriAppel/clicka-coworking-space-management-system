import { GeneratedDocument } from "../../../../../../backend/src/types/document";
import { ID } from "../../../../../../backend/src/types/core";
export const DocumentPreview = () => {
 //functions
// שליפת מסמך לתצוגה
const fetchDocumentForPreview = async (documentId: ID): Promise<GeneratedDocument> => {
 return {} as GeneratedDocument;
};

  return (
    <div>
      <h1>Document Preview</h1>
      <p>This section will display the preview of the generated document.</p>
      {/* Additional UI components for document preview can be added here */}
    </div>
  );
}