import React, { useState, useEffect } from "react";
import { FaBell, FaBellSlash, FaEdit, FaTrash } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface User {
  id: number;
  name: string;
  email: string;
  InteractionType?: string;
  upload?: File | null;
  Dates?: string[];
  reminder?: boolean;
}

const getLocalUsers = () => {
  const data = localStorage.getItem("interactions");
  return data ? JSON.parse(data) : [];
};

export const LeadInteraction = () => {
  const [users, setUsers] = useState<User[]>(getLocalUsers());
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    InteractionType: "",
    upload: null,
    Dates: [],
    reminder: false,
  });

  useEffect(() => {
    localStorage.setItem("interactions", JSON.stringify(users));
  }, [users]);

  const handleAddOrUpdate = () => {
    if (!formData.name || !formData.email) return;
    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? formData : u))
      );
    } else {
      setUsers((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      name: "",
      email: "",
      InteractionType: "",
      upload: null,
      Dates: [],
      reminder: false,
    });
    setSelectedUser(null);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData(user);
  };

  const toggleReminder = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, reminder: !u.reminder } : u))
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchName = u.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "All" || u.InteractionType === typeFilter;
    return matchName && matchType;
  });

  const chartData = Object.entries(
    users
      .flatMap((u) => u.Dates || [])
      .reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  ).map(([date, count]) => ({ date, count }));

  return (
    <div dir="rtl" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>ניהול אינטראקציות</h2>

      {/* טופס */}
      <div style={{ marginBottom: "2rem" }}>
        <input
          placeholder="שם"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          placeholder="אימייל"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <select
          value={formData.InteractionType}
          onChange={(e) =>
            setFormData({ ...formData, InteractionType: e.target.value })
          }
        >
          <option value="">בחר סוג</option>
          <option value="Email">אימייל</option>
          <option value="Call">שיחה</option>
          <option value="Meeting">פגישה</option>
        </select>
        <input
          type="date"
          onChange={(e) =>
            setFormData({ ...formData, Dates: [e.target.value] })
          }
          value={formData.Dates?.[0] || ""}
        />
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, upload: e.target.files?.[0] || null })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={formData.reminder}
            onChange={(e) =>
              setFormData({ ...formData, reminder: e.target.checked })
            }
          />
          תזכורת
        </label>
        <button onClick={handleAddOrUpdate}>
          {selectedUser ? "עדכן" : "הוסף"}
        </button>
        {selectedUser && <button onClick={resetForm}>ביטול</button>}
      </div>

      {/* חיפוש וסינון */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="חיפוש לפי שם..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="All">הכל</option>
          <option value="Email">אימייל</option>
          <option value="Call">שיחה</option>
          <option value="Meeting">פגישה</option>
        </select>
      </div>

      {/* טבלה */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>שם</th>
            <th>אימייל</th>
            <th>סוג</th>
            <th>תאריך</th>
            <th>קובץ</th>
            <th>תזכורת</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.InteractionType}</td>
              <td>{user.Dates?.[0]}</td>
              <td>{user.upload?.name || "-"}</td>
              <td>
                <button onClick={() => toggleReminder(user.id)}>
                  {user.reminder ? (
                    <FaBell color="orange" />
                  ) : (
                    <FaBellSlash color="gray" />
                  )}
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(user)}>
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(user.id)}>
                  <FaTrash color="red" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* גרף */}
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
