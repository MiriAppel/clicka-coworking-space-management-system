import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Stack } from "@mui/material";

interface Customer {
  id: string;
  name: string;
  email: string;
}

const sampleCustomers: Customer[] = [
  { id: "1", name: "דוד כהן", email: "david@example.com" },
  { id: "2", name: "שרה לוי", email: "sara@example.com" },
];

export const CustomersList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);

  const filteredCustomers = customers.filter(c =>
    c.name.includes(searchTerm) || c.email.includes(searchTerm)
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "1rem" }}>רשימת לקוחות</h2>

      <Stack spacing={2} direction="row" style={{ marginBottom: "1rem" }}>
        <TextField
          label="חיפוש לפי שם או מייל"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={() => navigate("new")}>
          הוסף לקוח חדש
        </Button>
      </Stack>

      <ul>
        {filteredCustomers.map(customer => (
          <li key={customer.id} style={{ marginBottom: "1rem" }}>
            <strong>{customer.name}</strong> - {customer.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
