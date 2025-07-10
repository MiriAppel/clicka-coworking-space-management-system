import { useRef, useState, useEffect } from 'react';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { useForm, FormProvider } from 'react-hook-form';
import { DocumentType } from 'shared-types';
import { Button } from '../../../../Common/Components/BaseComponents/Button';

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

type FormValues = {
  documentType: DocumentType;
};

type VendorDocumentsProps = {
  vendorId: string;
};

export default function VendorDocuments({ vendorId }: VendorDocumentsProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<BackendDocument[]>([]);

  const methods = useForm<FormValues>({
    defaultValues: { documentType: DocumentType.INVOICE },
  });
  const fileInput = useRef<HTMLInputElement | null>(null);

  // שלב 1: טען מסמכים מהשרת
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch(`http://localhost:3001/api/document/vendor/${vendorId}`);
        if (!res.ok) throw new Error('Failed to fetch documents');
              // 1. קרא את ה-JSON הגולמי מהשרת
      const raw: any[] = await res.json();
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

  // שלב 2: העלאת מסמך לשרת
  const uploadDocument = async () => {
    const docType = methods.getValues('documentType');
    const file = fileInput.current?.files?.[0];
    if (!file) return;

    try {
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

  // שלב 3: מחיקת מסמך מהשרת
  const deleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/document/${docId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete document');

      setDocuments((docs) => docs.filter((d) => d.id !== docId));
      setMessage('המסמך נמחק!');
    } catch (error) {
      console.error('Error deleting document:', error);
      setMessage('שגיאה במחיקת המסמך');
    }
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4" dir="rtl">
      <h3 className="text-xl font-semibold mb-4">מסמכים</h3>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})} className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
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

            <input
              type="file"
              ref={fileInput}
              className="border p-1 rounded"
              aria-label="בחר קובץ להעלאה"
            />

            <Button variant="primary" onClick={uploadDocument} className="mt-2 sm:mt-0">
              העלה מסמך
            </Button>
          </div>
        </form>
      </FormProvider>

      {message && <div className="mb-4 text-green-600">{message}</div>}

      <ul className="space-y-2">
        {documents.length === 0 && <div className="text-gray-500">אין מסמכים</div>}
        {documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between border p-3 rounded shadow-sm">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {doc.name}
            </a>
            <div className="text-sm text-gray-600 ml-4 whitespace-nowrap">
              <span>({doc.type})</span> | <span>{Math.round(doc.size / 1024)} KB</span> |{' '}
              <span>{new Date(doc.created_at).toLocaleDateString()}</span>
            </div>
            <Button variant="accent" size="sm" onClick={() => deleteDocument(doc.id)} className="ml-4">
              מחק
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
