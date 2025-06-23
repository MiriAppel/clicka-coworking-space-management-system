import React, { useState } from "react";
import { Table } from "../../../Common/Components/BaseComponents/Table";
import { FaBell, FaBellSlash } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface User {
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
    <div dir="rtl" style={{ padding: "2rem" }}>
      <h2>רשימת אינטראקציות</h2>

      <input
        type="text"
        placeholder="חפש לפי שם..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "1rem", width: "300px" }}
      />

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  setSelectedIds(
                    e.target.checked ? filteredUsers.map((u) => u.id) : []
                  );
                }}
                checked={
                  selectedIds.length === filteredUsers.length &&
                  filteredUsers.length > 0
                }
              />
            </th>
            <th>שם</th>
            <th>סוג אינטראקציה</th>
            <th>תזכורת</th>
            <th>תאריך קרוב</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.InteractionType || "-"}</td>
              <td>
                <button onClick={() => toggleReminder(user.id)}>
                  {user.reminder ? (
                    <FaBell color="orange" />
                  ) : (
                    <FaBellSlash color="gray" />
                  )}
                </button>
              </td>
              <td>{user.Dates?.[0] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "2rem" }}>גרף אינטראקציות לפי תאריך</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
