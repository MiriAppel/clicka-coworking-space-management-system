import { useState } from 'react';
import { Button } from '../../../Common/Components/BaseComponents/Button';
import { showAlert } from '../../../Common/Components/BaseComponents/ShowAlert';
import { DocumentTemplate } from 'shared-types';
import { useDocumentTemplateStore } from '../../../Stores/DocumentManagement/DocumentTemplateStore';

interface PreviewDocumentTemplateProps {
  documentTemplate: DocumentTemplate;
  onClose: () => void;
  onRenderHtml: (html: any) => void;
}

export const PreviewDocumentTemplate = ({ documentTemplate, onClose, onRenderHtml }: PreviewDocumentTemplateProps) => {
  // יצירת מצב התחלתי למשתנים - מילוי ערכים ריקים לכל משתנה בתבנית
  const [variables, setVariables] = useState<Record<string, string>>(() => {
    const initialVars: Record<string, string> = {};
    documentTemplate.variables?.forEach(variableName => {
      const cleanKey = variableName.replace(/^"+|"+$/g, '').trim();
      initialVars[cleanKey] = '';
    });
    return initialVars;
  });

  const { previewDocumentTemplate } = useDocumentTemplateStore();

  // עדכון ערך משתנה ספציפי כאשר המשתמש מקליד
  const handleVariableChange = (key: string, value: string) => {
    const cleanKey = key.replace(/^"+|"+$/g, '').trim();
    setVariables(prev => ({ ...prev, [cleanKey]: value }));
  };

  // יצירת תצוגה מקדימה של התבנית עם הערכים שהמשתמש הזין
  const handlePreview = async () => {
    if (!documentTemplate.id) {
      showAlert("שגיאה", 'נדרש מזהה תבנית מסמך.', "error");
      return;
    }

    try {
      const html = await previewDocumentTemplate(documentTemplate.id, variables);
      onRenderHtml(html);
    } catch (error) {
      console.error("Error previewing document template:", error);
      showAlert("שגיאה", "תצוגת תבנית נכשלה.", "error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto p-6" dir="rtl">
      <h2 className="text-3xl font-bold mb-4">תבנית מסמך: {documentTemplate.name}</h2>
      
      {documentTemplate.variables?.map(variable => {
        const cleanKey = variable.replace(/^"+|"+$/g, '').trim();
        return (
          <div key={cleanKey} className="flex flex-col mb-4 w-full">
            <label className="font-semibold text-lg mb-2">{cleanKey}</label>
            <input
              type="text"
              value={variables[cleanKey] ?? ''}
              onChange={(e) => handleVariableChange(cleanKey, e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              dir="auto"
            />
          </div>
        );
      })}
      
      <div className="flex justify-between mt-4 w-full gap-2">
        <Button onClick={handlePreview} className="flex-1 flex justify-center">
          הצג תצוגה מקדימה
        </Button>
        <Button onClick={onClose} className="flex-1 flex justify-center">
          סגור
        </Button>
      </div>
    </div>
  );
};