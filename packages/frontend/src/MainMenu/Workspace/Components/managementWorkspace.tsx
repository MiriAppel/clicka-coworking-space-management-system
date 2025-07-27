import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useEffect, useState } from "react";
// import { useWorkspaceStore } from "../../../Stores/Workspace/workspaceStore";
import { Space, WorkspaceType, SpaceStatus } from "shared-types";
import { useWorkSpaceStore } from "../../../Stores/Workspace/workspaceStore";

export const ManagementWorkspace = () => {
  const { workSpaces, getAllWorkspace, createWorkspace } = useWorkSpaceStore();
  const [open, setOpen] = useState(false);
  const [newSpace, setNewSpace] = useState<Space>({
    id: '',
    name: '',
    description: '',
    type: WorkspaceType.PRIVATE_ROOM1,
    status: SpaceStatus.AVAILABLE,
    workspaceMapId: '',
    // room: '',
    currentCustomerId: '',
    currentCustomerName: '',
    positionX: 0,
    positionY: 0,
    width: 0,
    height: 0,
    createdAt: '',
    updatedAt: '',
  });

  useEffect(() => {
    // דואגים לשלוף את כל החללים
    getAllWorkspace();
  }, [getAllWorkspace]);

  const handleAddSpace = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const formatDate = (date: Date) => {
        return date.toLocaleString("he-IL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).replace(",", "");
      };

      const spaceWithDates = {
        name: newSpace.name,
        type: newSpace.type,
        status: newSpace.status,
        positionX: newSpace.positionX,
        positionY: newSpace.positionY,
        width: newSpace.width,
        height: newSpace.height,
        workspaceMapId: newSpace.workspaceMapId,
        createdAt: formatDate(new Date()), // תאריך יצירה בפורמט המבוקש
        updatedAt: formatDate(new Date()), // תאריך עדכון בפורמט המבוקש
        description: newSpace.description,
        // room: newSpace.room,
        // currentCustomerId: newSpace.currentCustomerId,
        // currentCustomerName: newSpace.currentCustomerName,
      };

      console.log("Saving new space:", spaceWithDates);

      // קריאה ל־createWorkspace בשירות ה־zustand עם החלל החדש
      await createWorkspace(spaceWithDates);

      setOpen(false); // סגירת הדיאלוג אחרי שהחלל נשמר
      // עדכון החללים בסטור לאחר שמירת החלל החדש
      getAllWorkspace();
    } catch (error) {
      console.error("Error saving new space:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSpace({ ...newSpace, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ניהול חללים</h1>

      <div style={{ marginBottom: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleAddSpace}>
          הוספת חלל חדש
        </Button>
      </div>

      <h2>רשימת החללים:</h2>
      {workSpaces.length === 0 ? (
        <p>אין חללים להצגה.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>שם חלל</TableCell>
                <TableCell>סוג</TableCell>
                <TableCell>סטטוס</TableCell>
                <TableCell>מיקום X</TableCell>
                <TableCell>מיקום Y</TableCell>
                <TableCell>רוחב</TableCell>
                <TableCell>אורך</TableCell>
                <TableCell>תיאור</TableCell>
                <TableCell>חדר</TableCell>
                <TableCell>קוד לקוח</TableCell>
                <TableCell>שם לקוח</TableCell>
                <TableCell>נוצר ב</TableCell>
                <TableCell>התעדכן ב</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workSpaces.map((space) => (
                <TableRow key={space.id}>
                  <TableCell>{space.name}</TableCell>
                  <TableCell>{space.type}</TableCell>
                  <TableCell>{space.status}</TableCell>
                  <TableCell>{space.positionX}</TableCell>
                  <TableCell>{space.positionY}</TableCell>
                  <TableCell>{space.width}</TableCell>
                  <TableCell>{space.height}</TableCell>
                  <TableCell>{space.description}</TableCell>
                  {/* <TableCell>{space.room}</TableCell> */}
                  <TableCell>{space.currentCustomerId}</TableCell>
                  <TableCell>{space.currentCustomerName}</TableCell>
                  <TableCell>{space.createdAt}</TableCell>
                  <TableCell>{space.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Adding Space */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>הוספת חלל חדש</DialogTitle>
        <DialogContent>
          <TextField
            label="שם חלל"
            fullWidth
            name="name"
            value={newSpace.name}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="תיאור"
            fullWidth
            name="description"
            value={newSpace.description}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="מיקום X"
            fullWidth
            name="positionX"
            value={newSpace.positionX}
            onChange={handleChange}
            type="number"
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="מיקום Y"
            fullWidth
            name="positionY"
            value={newSpace.positionY}
            onChange={handleChange}
            type="number"
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="רוחב"
            fullWidth
            name="width"
            value={newSpace.width}
            onChange={handleChange}
            type="number"
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="אורך"
            fullWidth
            name="height"
            value={newSpace.height}
            onChange={handleChange}
            type="number"
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="workspace_map_id"
            fullWidth
            name="workspace_map_id"
            value={newSpace.workspaceMapId}
            onChange={handleChange}
            required
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="סוג חלל"
            fullWidth
            name="type"
            value={newSpace.type}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
            required
          />
          <TextField
            label="סטטוס חלל"
            fullWidth
            name="status"
            value={newSpace.status}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
            required
          />
          {/* חדש: הוספת שדות קלט חדשים
          <TextField
            label="קוד לקוח"
            fullWidth
            name="currentCustomerId"
            value={newSpace.currentCustomerId}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="שם לקוח"
            fullWidth
            name="currentCustomerName"
            value={newSpace.currentCustomerName}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
          /> */}
          <TextField
            label="חדר"
            fullWidth
            name="room"
            // value={newSpace.room}
            onChange={handleChange}
            style={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            ביטול
          </Button>
          <Button onClick={handleSave} color="primary">
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};


