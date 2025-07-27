import { useRef, useState, useEffect } from 'react';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { useForm, FormProvider } from 'react-hook-form';
import { DocumentType } from 'shared-types';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import axiosInstance from '../../../../Service/Axios';

// טיפוס שמתאים למבנה ה-API שלך
interface BackendDocument {
  id: string;
  name: string;
  path: string;
  mime_type: string;
  size: number;
  url: string;
  google_drive_id: string;
  created_at: string;
  updated_at: string;
  type?: string;
}

// טיפוס לטופס שמכיל רק את סוג המסמך שנבחר
type FormValues = {
  documentType: DocumentType;
};

// טיפוס לפרופס שהקומפוננטה מקבלת (מזהה ספק)
type VendorDocumentsProps = {
  vendorId: string;
};

// קומפוננטת ברירת מחדל להצגת מסמכים של ספק
export default function VendorDocuments({ vendorId }: VendorDocumentsProps) {
  // הודעת סטטוס כללית למשתמש
  const [message, setMessage] = useState<string | null>(null);
  // מערך של המסמכים שהתקבלו מהשרת
  const [documents, setDocuments] = useState<BackendDocument[]>([]);

  // אתחול form עם ערך דיפולטיבי עבור סוג מסמך
  const methods = useForm<FormValues>({
    defaultValues: { documentType: DocumentType.INVOICE },
  });
  // רפרנס לאלמנט input מסוג file
  const fileInput = useRef<HTMLInputElement | null>(null);

  // טוען את המסמכים מהשרת כשהקומפוננטה נטענת או משתנה vendorId
  useEffect(() => {
    async function fetchDocuments() {
      try {
        // שליחת בקשת GET לשרת לקבלת כל המסמכים של הספק
        const res = axiosInstance.get("/document/vendor/${vendorId}");
        if (!res) throw new Error('Failed to fetch documents');

        // 1. קרא את ה-JSON הגולמי מהשרת
        const raw: any[] = await (await res).data;
        console.log('🔴 raw from server:', raw);

        // 2. ממפה את השדה המתאים לשדה id
        const data: BackendDocument[] = raw.map(d => ({
          id:             d.id ?? d.document_id,  // תמיכה בשני שמות אפשריים
          name:           d.name,
          path:           d.path,
          mime_type:      d.mime_type,
          size:           d.size,
          url:            d.url,
          google_drive_id:d.google_drive_id,
          created_at:     d.created_at,
          updated_at:     d.updated_at,
          type:           d.type,
        }));
        console.log('🟢 mapped documents:', data);
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setMessage('שגיאה בטעינת המסמכים');
        setTimeout(() => setMessage(null), 4000);
      }
    }
    fetchDocuments();
  }, [vendorId]);

  // פונקציית העלאה של מסמך לשרת
  const uploadDocument = async () => {
    // קבלת סוג המסמך מתוך הטופס
    const docType = methods.getValues('documentType');
    // קבלת הקובץ שנבחר
    const file = fileInput.current?.files?.[0];
    if (!file) return;

    try {
      // יצירת FormData ושליחת הנתונים לשרת
      const formData = new FormData();
      formData.append('vendor_id', vendorId);
      formData.append('name', file.name);
      formData.append('type', docType);
      formData.append('file', file);

      const res = await fetch(`http://localhost:3001/api/document`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload document');

      // עדכון המסמכים במסמך החדש
      const newDoc: BackendDocument = await res.json();
      setDocuments((docs) => [...docs, newDoc]);
      setMessage('המסמך נוסף בהצלחה!');
      if (fileInput.current) fileInput.current.value = '';
    } catch (error) {
      console.error('Error uploading document:', error);
      setMessage('שגיאה בהעלאת המסמך');
    }
    setTimeout(() => setMessage(null), 4000);
  };

  // פונקציית מחיקה של מסמך
  const deleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/document/${docId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete document');

      // מסנן את המסמך שנמחק מתוך הרשימה
      setDocuments((docs) => docs.filter((d) => d.id !== docId));
      setMessage('המסמך נמחק!');
    } catch (error) {
      console.error('Error deleting document:', error);
      setMessage('שגיאה במחיקת המסמך');
    }
    setTimeout(() => setMessage(null), 2000);
  };

  // ממשק המשתמש להצגת טופס העלאה ורשימת המסמכים
  return (
    <div className="max-w-3xl mx-auto p-4" dir="rtl">
      {/* כותרת */}
      <h3 className="text-xl font-semibold mb-4">מסמכים</h3>

      {/* טופס לבחירת סוג מסמך והעלאת קובץ */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})} className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            {/* שדה בחירה של סוג המסמך */}
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
            />

            {/* העלאת קובץ */}
            <input
              type="file"
              ref={fileInput}
              className="border p-1 rounded"
              aria-label="בחר קובץ להעלאה"
            />

            {/* כפתור לשליחת הטופס */}
            <Button variant="primary" onClick={uploadDocument} className="mt-2 sm:mt-0">
              העלה מסמך
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* הודעת סטטוס למשתמש */}
      {message && <div className="mb-4 text-green-600">{message}</div>}

      {/* רשימת המסמכים */}
      <ul className="space-y-2">
        {/* במקרה שאין מסמכים */}
        {documents.length === 0 && <div className="text-gray-500">אין מסמכים</div>}

        {/* הצגת כל מסמך ברשימה */}
        {documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between border p-3 rounded shadow-sm">
            {/* קישור לפתיחת המסמך */}
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {doc.name}
            </a>

            {/* תיאור קצר של פרטי המסמך */}
            <div className="text-sm text-gray-600 ml-4 whitespace-nowrap">
              <span>({doc.type})</span> | <span>{Math.round(doc.size / 1024)} KB</span> |{' '}
              <span>{new Date(doc.created_at).toLocaleDateString()}</span>
            </div>

            {/* כפתור למחיקת המסמך */}
            <Button variant="accent" size="sm" onClick={() => deleteDocument(doc.id)} className="ml-4">
              מחק
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}