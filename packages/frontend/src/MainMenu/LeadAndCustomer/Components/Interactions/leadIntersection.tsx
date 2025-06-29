import { useParams } from "react-router";
import React, { useState } from "react";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";

//אנטרקציות של המתעניין 
//קודם input 
//של חיפוש המזכירה תוכל לחפש למשל מי שהפעמוןשלו דולק וזה אומר שהוא צריך תזכורת 
// בנוסף צריך שיהיה בחירת מרובים או בחירה של כולם כמו ריבוע כזה בצד שאפשר לבחור כמה  
interface User { // לדוגמא של טבלה 
  id: number;
  name: string;
  email: string;
  InteractionType?: string;
  upload?: File | null;
  Dates?: string[]; // תאריכים כאי-סטראינג
  reminder?: boolean;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Sara Cohen",
    email: "sara@example.com",
    InteractionType: "Email",
    Dates: ["2024-05-10", "2024-06-01"],
    reminder: true,
  },
  {
    id: 2,
    name: "David Levi",
    email: "david@example.com",
    InteractionType: "Phone",
    Dates: ["2024-06-15"],
    reminder: false,
  },
];

export const LeadInteraction = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleReminder = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, reminder: !u.reminder } : u))
    );
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dateCounts = users.flatMap((u) => u.Dates || []).reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(dateCounts).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="p-6">
            <h2 className="text-xl font-bold mb-4">אינטראקציות של מתעניינים</h2>
      {/* <Table<User> data={users} columns={columns} dir="rtl" /> */}
    </div>
  );
};
