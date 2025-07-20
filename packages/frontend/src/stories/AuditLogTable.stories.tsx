// // AuditLogTable.stories.tsx
// import React from "react";
// import { Meta, StoryObj } from "@storybook/react-webpack5";
// import { AuditLogTable, AuditLog } from "../MainMenu/CoreAndIntegration/Components/User/AuditLogTable";

// // 🟡 הגדרת המטא־מידע של הרכיב – איך Storybook מזהה ומארגן את הסיפור
// const meta: Meta<typeof AuditLogTable> = {
//   title: "Components/AuditLogTable", // 📝 מיקום הרכיב בעץ ה־Storybook
//   component: AuditLogTable,          // 🎯 הרכיב שמוצג בסיפור
// };

// export default meta;

// // 🔁 טיפוס לסיפור – זה עוזר לנו להגדיר תסריטים שונים לרכיב
// type Story = StoryObj<typeof AuditLogTable>;

// // 🧪 נתוני דמה שנשתמש בהם להצגה בטבלה
// const mockData: AuditLog[] = [
//   {
//     id: "1",
//     userEmail: "user@example.com",
//     timestamp: "2025-07-14T12:34:56Z",
//     functionName: "createUser",
//     targetInfo: "abc-123",
//     createdAt: "2025-07-14T12:34:56Z",
//     updatedAt: "2025-07-14T12:34:56Z",
//   },
//   {
//     id: "2",
//     userEmail: "admin@example.com",
//     timestamp: "2025-07-14T13:00:00Z",
//     functionName: "deleteUser",
//     targetInfo: "xyz-789",
//     createdAt: "2025-07-14T13:00:00Z",
//     updatedAt: "2025-07-14T13:00:00Z",
//   },
// ];

// // ✅ הסיפור הראשי – מציג את הטבלה עם הנתונים המלאים
// export const Default: Story = {
//   args: {
//     data: mockData, // 📦 נתוני הטבלה שנשלחים כרכיב props
//   },
// };




// AuditLogTable.stories.tsx
// import React from "react";
// import { Meta, StoryObj } from "@storybook/react-webpack5";
// import  AuditLogTable  from "../MainMenu/CoreAndIntegration/Components/User/AuditLogTable";

// // 🟡 הגדרת המטא־מידע של הרכיב – איך Storybook מזהה ומארגן את הסיפור
// const meta: Meta<typeof AuditLogTable> = {
//   title: "Components/AuditLogTable", // 📝 מיקום הרכיב בעץ ה־Storybook
//   component: AuditLogTable,          // 🎯 הרכיב שמוצג בסיפור
// };

// export default meta;

// // 🔁 טיפוס לסיפור – זה עוזר לנו להגדיר תסריטים שונים לרכיב
// type Story = StoryObj<typeof AuditLogTable>;

// // ✅ הסיפור הראשי – מציג את הטבלה עם הנתונים מהשרת
// export const Default: Story = {
//   args: {
//     // אין צורך להעביר נתוני mock, הקומפוננטה כבר שולפת אותם ב-useEffect
//   },
// };




// import React from "react";
// import  AuditLogTable  from "../MainMenu/CoreAndIntegration/Components/User/AuditLogTable";

// // נתונים מדומים לשימוש ב-Storybook
// const mockAuditLogs = [
//   {
//     userEmail: "user1@example.com",
//     timestamp: "2025-07-16T10:15:30Z",
//     action: "CREATE",
//     functionName: "createUser",
//     targetInfo: "User ID: 123"
//   },
//   {
//     userEmail: "user2@example.com",
//     timestamp: "2025-07-15T09:05:10Z",
//     action: "UPDATE",
//     functionName: "updateSettings",
//     targetInfo: "Settings ID: 45"
//   },
//   {
//     userEmail: "user3@example.com",
//     timestamp: "2025-07-14T14:23:00Z",
//     action: "DELETE",
//     functionName: "deleteInvoice",
//     targetInfo: "Invoice ID: 789"
//   }
// ];

// // קומפוננטה עטיפה שמאפשרת לשלוח נתונים מדומים ל-AuditLogTable
// const AuditLogTableWithMockData = () => {
//   const [auditLogs, setAuditLogs] = React.useState(mockAuditLogs);
//   const [loading, setLoading] = React.useState(false);

//   // אפשר להוסיף useEffect לטעינת נתונים מה-API אמיתי, אם רוצים
//   // או להשאיר כאן רק את הנתונים המדומים

//   return <AuditLogTableWrapper auditLogs={auditLogs} loading={loading} />;
// };

// // מכיוון שהקומפוננטה שלך מקבלת את הנתונים בעצמה דרך useEffect,
// // אפשר להכניס את הלוגיקה לטבלה בקומפוננטת עטיפה שמקבלת את הנתונים כ-props
// // וכך ניתן לשלוט על הנתונים מה-storybook

// interface AuditLogTableWrapperProps {
//   auditLogs: any[];
//   loading: boolean;
// }

// const AuditLogTableWrapper: React.FC<AuditLogTableWrapperProps> = ({ auditLogs, loading }) => {
//   const columns = [
//     { header: "מייל משתמש", accessor: "userEmail" },
//     { header: "זמן", accessor: "timestamp" },
//     { header: "Action", accessor: "action" },
//     { header: "Function", accessor: "functionName" },
//     { header: "Target Info", accessor: "targetInfo" },
//   ];

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <AuditLogTable
//         columns={columns}
//         data={ausditLogs}
//         onUpdate={(row) => console.log("Update", row)}
//         onDelete={(row) => console.log("Delete", row)}
//       />
//     </div>
//   );
// };

// export default {
//   title: "Components/AuditLogTable",
//   component: AuditLogTableWithMockData,
// };

// export const Default = () => <AuditLogTableWithMockData />;



import React from "react";
import { Table, TableColumn } from "../../src/Common/Components/BaseComponents/Table";

type AuditLog = {
  userEmail: string;
  timestamp: string;
  action: string;
  functionName: string;
  targetInfo: string;
};

// הגדרת העמודות והדאטה נשארת כמו שכתבת

export default {
  title: "Components/AuditLogTable",
  component: Table,
};

/**
 * קומפוננטת Storybook עבור: Basic
 * תיאור: מגדירה תרחישים שונים להצגת הקומפוננטה Basic בסביבת פיתוח.
 */
export const Basic = () => {
  const sampleData: AuditLog[] = [
    {
      userEmail: "user1@example.com",
      timestamp: "2025-07-16T10:30:00Z",
      action: "Create",
      functionName: "addUser",
      targetInfo: "User ID 123",
    },
    {
      userEmail: "user2@example.com",
      timestamp: "2025-07-15T14:20:00Z",
      action: "Update",
      functionName: "editProfile",
      targetInfo: "User ID 456",
    },
  ];

  const columns: TableColumn<AuditLog>[] = [
    { header: "מייל משתמש", accessor: "userEmail" },
    { header: "זמן", accessor: "timestamp" },
    { header: "Action", accessor: "action" },
    { header: "Function", accessor: "functionName" },
    { header: "Target Info", accessor: "targetInfo" },
  ];

  const onUpdate = (row: AuditLog) => {
    console.log("Update", row);
  };

  const onDelete = (row: AuditLog) => {
    console.log("Delete", row);
  };

  return (
    <Table
      columns={columns}
      data={sampleData}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
};
