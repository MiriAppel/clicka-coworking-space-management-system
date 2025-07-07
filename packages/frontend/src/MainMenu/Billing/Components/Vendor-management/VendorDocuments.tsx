import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { useForm, FormProvider } from 'react-hook-form';
import { DocumentType, GeneratedDocument } from 'shared-types';
import { Button } from '../../../../Common/Components/BaseComponents/Button';

// הגדרת טיפוס לפרטי הטופס - סוג המסמך שייבחר
type FormValues = {
  documentType: DocumentType;
};

// הקומפוננטה הראשית לניהול מסמכים של ספק
export default function VendorDocuments() {
  // משיכת הפרמטר 'id' מהכתובת כדי לדעת איזה ספק מציגים
  const { id } = useParams();

  // state לשמירת הודעות למשתמש (כגון הצלחה או מחיקה)
  const [message, setMessage] = useState<string | null>(null);

  // state לשמירת רשימת המסמכים הקיימים
  const [documents, setDocuments] = useState<GeneratedDocument[]>([
    {
      id: '1',
      type: DocumentType.INVOICE,
      entityId: id ?? '',
      documentNumber: 'INV-001',
      templateId: 'tmpl-1',
      file: {
        id: 'file-1',
        url: '#', // קישור לקובץ (כרגע דמה)
        name: 'חשבונית.pdf',
        path: '/mock/path/חשבונית.pdf',
        mimeType: 'application/pdf',
        size: 123456,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      generatedAt: new Date().toISOString(),
    },
  ]);

  // אתחול ה-hook לניהול הטופס עם ערך ברירת מחדל לסוג המסמך
  const methods = useForm<FormValues>({
    defaultValues: {
      documentType: DocumentType.INVOICE,
    },
  });

  // יצירת הפניה (ref) לשדה הקובץ כדי לגשת אליו ישירות
  const fileInput = useRef<HTMLInputElement | null>(null);

  // פונקציה להוספת מסמך חדש לרשימת המסמכים
  const uploadDocument = () => {
    // מקבלת את הערך הנבחר לסוג המסמך מתוך הטופס
    const docType = methods.getValues('documentType');
    // אם לא נבחר קובץ - לא עושים כלום
    if (!fileInput.current?.files?.[0]) return;
    // קבלת הקובץ שנבחר
    const file = fileInput.current.files[0];

    // הוספת המסמך החדש ל-state של המסמכים
    setDocuments((docs) => [
      ...docs,
      {
        id: (docs.length + 1).toString(), // יצירת מזהה ייחודי
        type: docType,
        entityId: id ?? '',
        documentNumber: `DOC-${docs.length + 1}`, // מספר מסמך אוטומטי
        templateId: 'tmpl-1',
        file: {
          id: `file-${docs.length + 1}`,
          url: '#', // צריך להיות קישור אמיתי לקובץ
          name: file.name,
          path: '/mock/path/' + file.name,
          mimeType: file.type,
          size: file.size,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        generatedAt: new Date().toISOString(),
      },
    ]);

    // הצגת הודעת הצלחה למשתמש
    setMessage('המסמך נוסף בהצלחה!');
    // הסרת ההודעה אחרי 4 שניות
    setTimeout(() => setMessage(null), 4000);

    // איפוס שדה הקובץ כדי לאפשר העלאה חוזרת של אותו קובץ
    fileInput.current.value = '';
  };

  // פונקציה למחיקת מסמך מהרשימה לפי מזהה
  const deleteDocument = (docId: string) => {
    // עדכון ה-state עם המסמכים ללא המסמך שנבחר למחיקה
    setDocuments((docs) => docs.filter((doc) => doc.id !== docId));
    // הודעת מחיקה למשתמש
    setMessage('המסמך נמחק!');
    // הסרת ההודעה אחרי 2 שניות
    setTimeout(() => setMessage(null), 2000);
  };

  // מבנה ה-UI של הקומפוננטה
  return (
    <div className="max-w-3xl mx-auto p-4" dir="rtl">
      {/* כותרת */}
      <h3 className="text-xl font-semibold mb-4">מסמכים</h3>

      {/* עטיפת הטופס ב-FormProvider כדי לספק את הקשר הטופס לקומפוננטות פנימיות */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
            {/* קומפוננטת בחירת סוג מסמך, מחוברת ל-react-hook-form */}
            <SelectField
              name="documentType" // שם השדה בטופס
              label="סוג מסמך"
              options={[
                { value: DocumentType.INVOICE, label: 'חשבונית' },
                { value: DocumentType.RECEIPT, label: 'קבלה' },
                { value: DocumentType.CREDIT_NOTE, label: 'זיכוי' },
                { value: DocumentType.STATEMENT, label: 'דוח' },
                { value: DocumentType.TAX_INVOICE, label: 'חשבונית מס' },
              ]}
              className="mb-2 sm:mb-0"
            />

            {/* שדה הקלט להעלאת קובץ */}
            <input
              type="file"
              ref={fileInput}
              className="border rounded p-1"
              aria-label="בחר קובץ להעלאה"
            />

            {/* כפתור להוספת המסמך */}
            <Button
              type="button"
              variant="primary"
              onClick={uploadDocument}
              className="mt-2 sm:mt-0"
            >
              העלה מסמך
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* הצגת הודעות למשתמש (אם קיימות) */}
      {message && <div className="mb-4 text-green-600 font-medium">{message}</div>}

      {/* אם אין מסמכים, מציג הודעה מתאימה */}
      {documents.length === 0 ? (
        <div className="text-gray-500">אין מסמכים לספק זה</div>
      ) : (
        // רשימת המסמכים
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between border p-3 rounded shadow-sm"
            >
              {/* קישור לפתיחת הקובץ בלשונית חדשה */}
              <a
                href={doc.file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {doc.file.name}
              </a>
              {/* פרטי הקובץ: סוג, גודל ותאריך */}
              <div className="text-sm text-gray-600 ml-4 whitespace-nowrap">
                <span>({doc.type})</span> |{' '}
                <span>{Math.round(doc.file.size / 1024)} KB</span> |{' '}
                <span>{new Date(doc.file.createdAt).toLocaleDateString()}</span>
              </div>
              {/* כפתור מחיקה */}
              <Button
                variant="accent"
                size="sm"
                onClick={() => deleteDocument(doc.id)}
                className="ml-4"
              >
                מחק
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}