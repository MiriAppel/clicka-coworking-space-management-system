import { Button as BaseButton } from "../../../../Common/Components/BaseComponents/Button";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl, // הוסף את זה
  InputLabel, // הוסף את זה
  Select, // הוסף את זה
  MenuItem, // הוסף את זה
} from '@mui/material';
import { CustomerModel } from '../../../../../../backend/src/models/customer.model'; // הנח שהמודל נמצא כאן
import { useInvoiceStore } from '../../../../Stores/Billing/invoiceStore';

export const CreateInvoiceButtons = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  // דיאלוג ללקוח בודד
  const [openSingle, setOpenSingle] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [startDateSingle, setStartDateSingle] = useState("");
  const [endDateSingle, setEndDateSingle] = useState("");

  // דיאלוג לכל הלקוחות
  const [openAll, setOpenAll] = useState(false);
  const [startDateAll, setStartDateAll] = useState("");
  const [endDateAll, setEndDateAll] = useState("");

  const [customers, setCustomers] = useState<CustomerModel[]>([]); // השתמש במודל הלקוח
  //-------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers'); // החלף ב-URL הנכון
        if (!res.ok) throw new Error("שגיאה בטעינת לקוחות");
        const data = await res.json();
        setCustomers(data); // הנח שהנתונים הם מערך של לקוחות
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);
  //--------------------------------------------------------------------------------------------------
  // דיאלוג ללקוח בודד
  const handleDialogOpenSingle = () => setOpenSingle(true);
  const handleDialogCloseSingle = () => setOpenSingle(false);

  // דיאלוג לכל הלקוחות
  const handleDialogOpenAll = () => setOpenAll(true);
  const handleDialogCloseAll = () => setOpenAll(false);

  const handleSingle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // שליחת בקשה לחישוב חיוב
      const res = await fetch(`/api/billing/calculate/${customerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: startDateSingle, endDate: endDateSingle, dueDate: endDateSingle }),
      });

      // בדיקת הצלחה של הבקשה
      if (!res.ok) throw new Error("חישוב החיוב נכשל");

      // קריאה לתגובה מהשרת
      const billingResult = await res.json();
      

      // יצירת חשבונית בחנות
      const invoiceData = {
        //  מיפוי הנתונים מהתוצאה שהתקבלה למבנה הצפוי של createInvoice
        id: billingResult.invoice.id,
        customerId: billingResult.invoice.customerId,
        customerName: billingResult.invoice.customerName,
        status: billingResult.invoice.status,
        issueDate: billingResult.invoice.issueDate,
        dueDate: billingResult.invoice.dueDate,
        items: billingResult.invoice.items,
        subtotal: billingResult.subtotal,
        taxAmount: billingResult.taxAmount,
        total: billingResult.total,
      };

      console.log("Biiling result", billingResult);
      console.log("Invoice data to create:", invoiceData);
      // טיפול בשגיאות בעת יצירת החשבונית
      try {
        const invoice = await useInvoiceStore.getState().createInvoice(invoiceData);
        console.log("Invoice from server:", invoice);

        if (onSuccess) onSuccess();
        alert("החשבונית חושבה ונשמרה בהצלחה");
        handleDialogCloseSingle();
      } catch (createInvoiceError) {
        console.error("Error creating invoice:", createInvoiceError);
        if (onError) onError(createInvoiceError);
        alert("אירעה שגיאה בעת יצירת החשבונית");
      }
    } catch (err) {
      if (onError) onError(err);
      alert("אירעה שגיאה בעת חישוב החיוב");
    }
  };

  // שליחת חיוב לכל הלקוחות
  const handleAll = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(`/api/billing/calculate-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: startDateAll, endDate: endDateAll }),
      });
      if (!res.ok) throw new Error("חישוב החיוב נכשל");
      if (onSuccess) onSuccess();
      alert("החשבוניות חושבו ונשמרו בהצלחה");
      handleDialogCloseAll();
    } catch (err) {
      if (onError) onError(err);
      alert("אירעה שגיאה בעת חישוב החיוב");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* כפתור שפותח דיאלוג ללקוח בודד */}
      <BaseButton onClick={handleDialogOpenSingle}>חשב חיוב ללקוח</BaseButton>
      {/* כפתור שפותח דיאלוג לכל הלקוחות */}
      <BaseButton onClick={handleDialogOpenAll}>חשב חיוב לכל הלקוחות</BaseButton>



      {/* דיאלוג להזנת מזהה לקוח ותאריכים ללקוח בודד */}
      <Dialog open={openSingle} onClose={handleDialogCloseSingle}>
        <DialogTitle>חשב חיוב ללקוח</DialogTitle>
        <form onSubmit={handleSingle}>
          <DialogContent>
            {/* החלפת TextField ב-Select לבחירת לקוח */}
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="customer-select-label">בחר לקוח</InputLabel>
              <Select
                labelId="customer-select-label"
                id="customerId"
                name="customerId"
                value={customerId}
                label="בחר לקוח"
                onChange={e => setCustomerId(e.target.value as string)}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name} {/* הצגת שם הלקוח */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              required
              margin="dense"
              id="startDateSingle"
              name="startDate"
              label="תאריך התחלה"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDateSingle}
              onChange={e => setStartDateSingle(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="endDateSingle"
              name="endDate"
              label="תאריך סיום"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDateSingle}
              onChange={e => setEndDateSingle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCloseSingle}>ביטול</Button>
            <Button type="submit">חשב</Button>
          </DialogActions>
        </form>
      </Dialog>



      {/* דיאלוג להזנת תאריכים לכל הלקוחות */}
      <Dialog open={openAll} onClose={handleDialogCloseAll}>
        <DialogTitle>חשב חיוב לכל הלקוחות</DialogTitle>
        <form onSubmit={handleAll}>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="startDateAll"
              name="startDate"
              label="תאריך התחלה"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDateAll}
              onChange={e => setStartDateAll(e.target.value)}
            />
            <TextField
              required
              margin="dense"
              id="endDateAll"
              name="endDate"
              label="תאריך סיום"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDateAll}
              onChange={e => setEndDateAll(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCloseAll}>ביטול</Button>
            <Button type="submit">חשב</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
