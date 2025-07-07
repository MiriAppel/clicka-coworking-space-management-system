import { Button as BaseButton } from "../../../../Common/Components/BaseComponents/Button";
import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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

  // דיאלוג ללקוח בודד
  const handleDialogOpenSingle = () => setOpenSingle(true);
  const handleDialogCloseSingle = () => setOpenSingle(false);

  // דיאלוג לכל הלקוחות
  const handleDialogOpenAll = () => setOpenAll(true);
  const handleDialogCloseAll = () => setOpenAll(false);

  // שליחת חיוב ללקוח בודד
  const handleSingle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(`/api/billing/calculate/${customerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: startDateSingle, endDate: endDateSingle }),
      });
      if (!res.ok) throw new Error("חישוב החיוב נכשל");
      if (onSuccess) onSuccess();
      alert("החשבונית חושבה ונשמרה בהצלחה");
      handleDialogCloseSingle();
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
            <TextField
              autoFocus
              required
              margin="dense"
              id="customerId"
              name="customerId"
              label="מזהה לקוח"
              type="text"
              fullWidth
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
            />
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