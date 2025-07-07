import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { useForm, FormProvider } from 'react-hook-form';
import { DocumentType, GeneratedDocument } from 'shared-types';
import { Button } from '../../../../Common/Components/BaseComponents/Button';

// טיפוס לפרטי הטופס - סוג המסמך
type FormValues = {
  documentType: DocumentType;
};

// קומפוננטה לניהול מסמכים של ספק
export default function VendorDocuments() {
  const { id } = useParams(); // מזהה הספק מה-URL

  const [message, setMessage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]); // כאן אין יותר נתונים קשיחים

  const methods = useForm<FormValues>({
    defaultValues: {
      documentType: DocumentType.INVOICE,
    },
  });

  const fileInput = useRef<HTMLInputElement | null>(null);

  // --- שלב 1: בעת טעינת הקומפוננטה נטען את המסמכים מהשרת ---
  useEffect(() => {
    async function fetchDocuments() {
      if (!id) return; // אם אין id לא נטען כלום
      try {
        const res = await fetch(`http://localhost:3001/vendors/${id}/documents`); // כתובת ה-API שלך לטעינת מסמכים
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        setDocuments(data); // שמירת המסמכים ב-state
      } catch (error) {
        console.error('Error fetching documents:', error);
        setMessage('שגיאה בטעינת המסמכים');
      }
    }
    fetchDocuments();
  }, [id]);

  // --- שלב 2: פונקציה להוספת מסמך דרך ה-API ---

  const uploadDocument = async () => {
    const docType = methods.getValues('documentType');
    if (!fileInput.current?.files?.[0]) return;
    const file = fileInput.current.files[0];

    try {
      // יצירת FormData להעלאת קובץ
      const formData = new FormData();
      formData.append('documentType', docType);
      formData.append('file', file);

      // קריאה ל-API להוספת המסמך - POST
      const res = await fetch(`http://localhost:3001/vendors/${id}/documents`, {
        method: 'POST',
        body: formData, // שולחים את הקובץ + הנתונים לשרת
      });

      if (!res.ok) throw new Error('Failed to upload document');

      const newDocument = await res.json();

      // מעדכנים את הרשימה עם המסמך החדש מהשרת
      setDocuments((docs) => [...docs, newDocument]);

      setMessage('המסמך נוסף בהצלחה!');
      setTimeout(() => setMessage(null), 4000);

      fileInput.current.value = ''; // איפוס שדה הקובץ

    } catch (error) {
      console.error('Error uploading document:', error);
      setMessage('שגיאה בהעלאת המסמך');
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // --- שלב 3: פונקציה למחיקת מסמך מהשרת ---

  const deleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/vendors/${id}/documents/${docId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete document');

      // מסמכים מעודכנים לאחר המחיקה
      setDocuments((docs) => docs.filter((doc) => doc.id !== docId));

      setMessage('המסמך נמחק!');
      setTimeout(() => setMessage(null), 2000);

    } catch (error) {
      console.error('Error deleting document:', error);
      setMessage('שגיאה במחיקת המסמך');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  // --- UI כמו קודם ---

  return (
    <div className="max-w-3xl mx-auto p-4" dir="rtl">
      <h3 className="text-xl font-semibold mb-4">מסמכים</h3>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
            <SelectField
              name="documentType"
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

            <input
              type="file"
              ref={fileInput}
              className="border rounded p-1"
              aria-label="בחר קובץ להעלאה"
            />

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

      {message && <div className="mb-4 text-green-600 font-medium">{message}</div>}

      {documents.length === 0 ? (
        <div className="text-gray-500">אין מסמכים לספק זה</div>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between border p-3 rounded shadow-sm"
            >
              <a
                href={doc.file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {doc.file.name}
              </a>
              <div className="text-sm text-gray-600 ml-4 whitespace-nowrap">
                <span>({doc.type})</span> |{' '}
                <span>{Math.round(doc.file.size / 1024)} KB</span> |{' '}
                <span>{new Date(doc.file.createdAt).toLocaleDateString()}</span>
              </div>
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
