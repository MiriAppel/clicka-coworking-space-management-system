import React, { useEffect, useState } from "react";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { axiosInstance } from "../../../../Service/Axios";

/**
 * קומפוננט לתצוגת טבלת יומן פעולות המשתמשים
 * מאפשר צפייה וסינון של כל הפעולות שבוצעו במערכת
 */
const AuditLogTable = () => {

  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);

  /**
   * State לניהול מצב הטעינה
   * true = מציג אינדיקטור טעינה, false = מציג את הטבלה
   */
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * States לשמירת ערכי הסינון שהמשתמש מזין
   * כל שינוי באחד מהערכים מפעיל שליפה חדשה מהשרת
   */
  const [emailFilter, setEmailFilter] = useState<string>(""); // סינון לפי אימייל
  const [functionNameFilter, setFunctionNameFilter] = useState<string>(""); // סינון לפי סוג פעולה
  const [dateFilter, setDateFilter] = useState<string>(""); // סינון לפי תאריך

  /**
   * פונקציה אסינכרונית לשליפת נתוני יומן הפעולות מהשרת
   * בונה URL עם פרמטרי הסינון ושולחת בקשה לשרת
   * 
   * @param email - אימייל לסינון (אופציונלי)
   * @param functionName - שם פונקציה לסינון (אופציונלי)
   * @param date - תאריך לסינון בפורמט YYYY-MM-DD (אופציונלי)
   */
  const fetchAuditLogs = async (
    email = "",
    functionName = "",
    date = ""
  ) => {
    // הפעלת מצב טעינה
    setLoading(true);

    try {
      /**
       * בניית פרמטרי הURL באמצעות URLSearchParams
       * רק פרמטרים שיש להם ערך נוספים לבקשה
       */
      const queryParams = new URLSearchParams();

      // הוספת פרמטרים רק אם יש להם ערך
      if (email) queryParams.append("userEmail", email);
      if (functionName) queryParams.append("functionName", functionName);

      /**
       * טיפול מיוחד בתאריך:
       * המשתמש בוחר תאריך אחד, אך אנחנו רוצים לקבל את כל הפעולות של אותו יום
       * לכן ממירים לטווח שלם: מתחילת היום עד סופו
       */
      if (date) {
        queryParams.append("startDate", `${date}T00:00:00.000Z`); // 00:00:00 של היום
        queryParams.append("endDate", `${date}T23:59:59.999Z`);   // 23:59:59 של היום
      }

      /**
       * שליחת בקשת GET לשרת באמצעות axiosInstance
       * הURL כולל את כל פרמטרי הסינון
       */
      const response = await axiosInstance.get(`/audit-logs/AuditLogController?${queryParams.toString()}`);

      /**
       * axios מחזיר את הנתונים ב-response.data
       * השרת מחזיר מערך של אובייקטי AuditLog
       */
      const data = response.data;

      // עדכון ה-state עם הנתונים החדשים
      setFilteredLogs(data);

    } catch (error) {
      /**
       * טיפול בשגיאות רשת או עיבוד
       * רישום השגיאה לקונסול ואיפוס הנתונים
       */
      console.error("Error fetching audit logs:", error);
      setFilteredLogs([]); // מערך ריק במקרה של שגיאה

    } finally {
      /**
       * תמיד לכבות את מצב הטעינה
       * בין אם הבקשה הצליחה או נכשלה
       */
      setLoading(false);
    }
  };

  /**
   * Hook שמפעיל את fetchAuditLogs בכל שינוי בערכי הסינון
   * זה מאפשר סינון בזמן אמת - כל הקלדה מפעילה חיפוש חדש
   * 
   * Dependencies: [emailFilter, functionNameFilter, dateFilter]
   * כלומר הפונקציה תרוץ בכל שינוי באחד מהערכים האלה
   */
  useEffect(() => {
    fetchAuditLogs(emailFilter, functionNameFilter, dateFilter);
  }, [emailFilter, functionNameFilter, dateFilter]);

  /**
   * הגדרת עמודות הטבלה
   * כל עמודה מוגדרת עם כותרת (header) ושדה בנתונים (accessor)
   */
  const columns: TableColumn<any>[] = [
    { header: "ID", accessor: "id" }, // עמודת ID של הפעולה 
    { header: "מייל משתמש", accessor: "userEmail" }, // עמודת מייל המשתמש שביצע את הפעולה
    {
      header: "תאריך ושעה", accessor: "timestamp",
      /**
       * פונקציית render מותאמת אישית להצגת התאריך
       * ממירה את התאריך מפורמט ISO לפורמט ידידותי למשתמש
       */
      render: (value: string) => {
        return new Date(value).toLocaleString('he-IL', {
          year: 'numeric',    // שנה מלאה (2024)
          month: '2-digit',   // חודש בשתי ספרות (01-12)
          day: '2-digit',     // יום בשתי ספרות (01-31)
          hour: '2-digit',    // שעה בשתי ספרות (00-23)
          minute: '2-digit',  // דקות בשתי ספרות (00-59)
          second: '2-digit'   // שניות בשתי ספרות (00-59)
        });
      }
    },
    { header: "איזה פעולה", accessor: "functionName" }, // עמודת שם הפונקציה שביצעה את הפעולה
  ];

  /**
   * תצוגת טעינה
   * מוצגת כל עוד loading === true
   */
  if (loading) return <div>טוען נתונים...</div>;

  return (
    <div className="p-4">
      {/* כותרת הדף */}
      <h2 className="text-xl font-bold mb-4">פעולות משתמשים</h2>

      {/* אזור הסינון */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* שדה סינון לפי אימייל */}
        <input
          type="text"
          placeholder="סינון לפי מייל"
          value={emailFilter}
          /**
           * כל שינוי בשדה מעדכן את ה-state
           * זה יפעיל את useEffect שישלח בקשה חדשה לשרת
           */
          onChange={(e) => setEmailFilter(e.target.value)}
          className="border p-2 rounded"
        />

        {/* שדה סינון לפי שם פונקציה */}
        <input
          type="text"
          placeholder="סינון לפי פעולה"
          value={functionNameFilter}
          onChange={(e) => setFunctionNameFilter(e.target.value)}
          className="border p-2 rounded"
        />

        {/* שדה סינון לפי תאריך */}
        <input
          type="date" // שדה תאריך מובנה של HTML5
          placeholder="סינון לפי תאריך"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* הטבלה עצמה */}
      <Table
        columns={columns}     // הגדרות העמודות
        data={filteredLogs}   // הנתונים לתצוגה
        showActions={false}   // אין פעולות כמו עדכון או מחיקה
      />
    </div>
  );
};

export default AuditLogTable;