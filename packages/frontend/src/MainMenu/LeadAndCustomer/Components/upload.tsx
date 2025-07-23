import { useEffect, useState } from "react";
import FileUploader ,{ FileItem } from "../../../Common/Components/BaseComponents/FileUploader";
import { Button } from "../../../Common/Components/BaseComponents/Button";
import { Customer } from "shared-types";
import axios from "axios";

const BASE_URL = "http://localhost:3001";

interface FileUploaderProps {
  onFilesUploaded?: (files: FileItem[]) => void;
  onPathReady: (path: string) => void;
  email: string;
  documentCategory: string;
}
 
export const FolderPathGenerator: React.FC<FileUploaderProps> = ({ email, documentCategory, onPathReady }) => {
  useEffect(() => {
    if (email && documentCategory) {
      const path = `לקוחות/${email}/${documentCategory}`;
      onPathReady(path);
    }
  }, [email, documentCategory]);

  return null; // לא מציג כלום, רק מחשב נתיב
};

export default function ClientSearchAndSelect() {
  const [tz, setTz] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [fileCategory, setFileCategory] = useState("חשבוניות");
  const [folderPath, setFolderPath] = useState("");
  const [loading, setLoading] = useState(false);

  const searchClient = async () => {
    setLoading(true);
    setCustomer(null);
    setNotFound(false);
    try {
      const res = await axios.get(`${BASE_URL}/customer/search/${tz}`);
      const data: Customer = res.data
      setCustomer(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-t mt-4 text-sm max-w-xl mx-auto" dir="rtl">
      {/* חיפוש לקוח */}
      <h2 className="text-xl font-semibold mb-4">חיפוש לקוח לפי ת״ז</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">מספר זהות</label>
        <input
          type="text"
          value={tz}
          onChange={(e) => setTz(e.target.value)}
          className="border rounded w-full px-3 py-2"
          placeholder="הכנס תעודת זהות"
        />
      </div>

      <Button onClick={searchClient}>
        {loading ? "טוען..." : "חפש"}
      </Button>

      {/* תוצאה */}
      <div className="mt-4">
        {customer && (
          <div className="text-green-700">
            נמצא לקוח: <strong>{customer.name}</strong>
          </div>
        )}
        {notFound && <div className="text-red-600">הלקוח לא נמצא</div>}
      </div>

      {/* קטגוריית קובץ */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">קטגוריית מסמכים</label>
        <select
          value={fileCategory}
          onChange={(e) => setFileCategory(e.target.value)}
          className="border rounded w-full px-3 py-2"
        >
          <option value="חשבוניות">חשבוניות</option>
          <option value="חוזים">חוזים</option>
          <option value="שונות">שונות</option>
        </select>
      </div>

      {/* חישוב נתיב תיקייה */}
      <FolderPathGenerator
        email={customer?.email || ""}
        documentCategory={fileCategory}
        onPathReady={(path) => setFolderPath(path)}
      />

      {/* העלאת קבצים */}
      {customer && folderPath && (
        <div className="mt-6">
          <FileUploader
            folderPath={folderPath}
            onFilesUploaded={(files) => {
              console.log("קבצים הועלו:", files);
              // אפשר להוסיף לוגיקת הצלחה
            }}
          />
        </div>
      )}
    </div>
  );
}
