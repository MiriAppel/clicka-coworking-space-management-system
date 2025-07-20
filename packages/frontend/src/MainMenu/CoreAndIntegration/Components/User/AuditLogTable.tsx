import React, { useEffect, useState } from "react";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";

const AuditLogTable = () => {
  // מצב לנתונים המקוריים
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  // מצב לנתונים אחרי סינון
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  // מצב טעינה
  const [loading, setLoading] = useState<boolean>(true);

  // שדות סינון
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  useEffect(() => {
    fetch("/api/audit-logs/AuditLogController")
      .then((response) => response.json())
      .then((data) => {
        setAuditLogs(data);
        setFilteredLogs(data); // בתחילה מציגים את הכל
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching audit logs:", error);
        setLoading(false);
      });
  }, []);

  // אפקט שמופעל בכל שינוי בסינון
  useEffect(() => {
    const filtered = auditLogs.filter((log) => {
      const matchesEmail = emailFilter ? log.userEmail?.includes(emailFilter) : true;
      const matchesAction = actionFilter ? log.action?.includes(actionFilter) : true;
      const matchesDate = dateFilter ? log.timestamp?.startsWith(dateFilter) : true;

      return matchesEmail && matchesAction && matchesDate;
    });

    setFilteredLogs(filtered);
  }, [emailFilter, actionFilter, dateFilter, auditLogs]);

  // הגדרת עמודות
  const columns: TableColumn<any>[] = [
    { header: "מייל משתמש", accessor: "userEmail" },
    { header: "תאריך ושעה", accessor: "timestamp" },
    // { header: "הפעולה", accessor: "action" },
    { header: "איזה פעולה", accessor: "functionName" },
    // { header: "אמייל המשתמש שעליו ביצעו את הפעולה", accessor: "targetInfo" },
  ];

  if (loading) return <div>טוען נתונים...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">יומן פעולות</h2>

      {/* סינון */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="סינון לפי מייל"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="סינון לפי פעולה"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          placeholder="סינון לפי תאריך"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* טבלה */}
      <Table
        columns={columns}
        data={filteredLogs}
        onUpdate={(row) => console.log("Update", row)}
        onDelete={(row) => console.log("Delete", row)}
      />
    </div>
  );
};

export default AuditLogTable;
