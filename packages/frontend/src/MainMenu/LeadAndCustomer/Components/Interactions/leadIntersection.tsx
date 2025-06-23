import { useParams } from "react-router";
import React from "react";
import { Table, TableColumn } from "../../../Common/Components/BaseComponents/Table";

//אנטרקציות של המתעניין 
//קודם input 
//של חיפוש המזכירה תוכל לחפש למשל מי שהפעמוןשלו דולק וזה אומר שהוא צריך תזכורת 
// בנוסף צריך שיהיה בחירת מרובים או בחירה של כולם כמו ריבוע כזה בצד שאפשר לבחור כמה  
interface User { // לדוגמא של טבלה 
  id: number;
  name: string;
  email: string;
  role: string;
  upload?: File | null;
  InteractionType?: string;
  Dates?: Date[];
}
const users: User[] = [
  { id: 1, name: "Sara Cohen", email: "sara@example.com", role: "Admin" },
  { id: 2, name: "David Levi", email: "david@example.com", role: "User" },
  { id: 3, name: "Rina Azulay", email: "rina@example.com", role: "Manager" },
];
// 3. מגדיר את הCOLUMN
const columns: TableColumn<User>[] = [
  { header: "Name", accessor: "name" },
  { header: "type", accessor: "InteractionType" },//--   זה צריך להיות עמודה של סוג מאיזה סוג תקשורת היתה לנו(טלפון מייל וכד')
  { header: "Upload a file", accessor: "upload", },//עמודה של העלאת קובץ למתעניין 
  // { header: "פעמון ", accessor: "תזכורת" },--עמודה שיהיה פעמון שיזהר אם צריך לקבוע משהו או להתקשר 
  { header: "תאריכים שהיו לנו אנטרקציות", accessor: "Dates", },//צריך להיות שכל פעם רואים את התאריך הקרוב ביותר אבל אם לוחצים על חץ בצד זה מביא את שאר התאריכים
];

//למטה צריך להיות גרף של תאריכים וכמות האינטרקציות בכל תאריך ושיוכלו ללחוץ על האינטרקציה ולראות עם מי היה האינטרקציה
export const LeadIntersection = () => {
  return (
    <div>
      <h1>LeadIntersection</h1>
      <Table<User> data={users} columns={columns} dir="rtl" />
    </div>
  );
}