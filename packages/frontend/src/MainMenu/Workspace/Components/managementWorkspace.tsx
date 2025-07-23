import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import { useWorkSpaceStore } from "../../../Stores/Workspace/workspaceStore";
import { Space, SpaceStatus, WorkspaceType } from "shared-types";
import { Table as StyledTable, TableColumn } from "../../../Common/Components/BaseComponents/Table";
import { Pencil, Trash } from "lucide-react";
import { Button } from "../../../Common/Components/BaseComponents/Button"; // עיצוב הכפתורים


import axios from "axios";
import { s } from "@fullcalendar/core/internal-common";

export const ManagementWorkspace = () => {
  const { workSpaces, getAllWorkspace, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkSpaceStore();
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Space | null>(null);
  const [newSpace, setNewSpace] = useState<Space>({
    id: '',
    name: '',
    description: '',
    type: WorkspaceType.PRIVATE_ROOM,
    status: SpaceStatus.AVAILABLE,
    currentCustomerId: 'עוד לא עודכן לקוח',
    currentCustomerName: 'עוד לא עודכן לקוח',
    positionX: 0,
    positionY: 0,
    width: 0,
    height: 0,
    workspaceMapId: '',
    location: '',
    createdAt: '',
    updatedAt: '',
  });

  useEffect(() => {
    getAllWorkspace();
  }, [getAllWorkspace]);

  const handleAddSpace = () => {
    setNewSpace({
      id: '',
      name: '',
      description: '',
      type: WorkspaceType.PRIVATE_ROOM,
      status: SpaceStatus.AVAILABLE,
      positionX: 0,
      positionY: 0,
      width: 0,
      height: 0,
      workspaceMapId: '',
      createdAt: '',
      updatedAt: '',
      location: '',
      // currentCustomerId: 'עוד לא עודכן לקוח',
      // currentCustomerName: 'עוד לא עודכן לקוח',
    });
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
        ...newSpace,
        updatedAt: formatDate(new Date()),
      };

      if (newSpace.id) {
        await updateWorkspace(spaceWithDates, spaceWithDates.id || "");
      }
      else {
        const newSpaceData = {
          ...spaceWithDates,
          createdAt: formatDate(new Date()),
        };
        await createWorkspace(newSpaceData);
      }

      setOpen(false);
      // getAllWorkspace();
    } catch (error) {
      console.error("Error saving new space:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewSpace({ ...newSpace, [name as string]: value });
  };

  // תיקון: פונקציה ל-Select בלבד
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setNewSpace({ ...newSpace, [name]: value });
  };

  const handleEdit = (workspace: Space) => {
    setNewSpace(workspace);
    setOpen(true);
  };

  const handleDelete = (workspace: Space) => {
    setWorkspaceToDelete(workspace);
    setConfirmDeleteOpen(true);
  };
  const confirmDelete = async () => {
    if (!workspaceToDelete) return;
    try {
      await deleteWorkspace(workspaceToDelete.id || "");
      // getAllWorkspace();
      setConfirmDeleteOpen(false);
      setWorkspaceToDelete(null);
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setWorkspaceToDelete(null);
  };


  const columns: TableColumn<Space>[] = [
    { header: 'שם חלל', accessor: 'name' },
    { header: 'סוג', accessor: 'type' },
    { header: 'סטטוס', accessor: 'status' },
    { header: 'מיקום X', accessor: 'positionX' },
    { header: 'מיקום Y', accessor: 'positionY' },
    { header: 'רוחב', accessor: 'width' },
    { header: 'אורך', accessor: 'height' },
    { header: 'תיאור', accessor: 'description' },
    { header: 'קוד לקוח', accessor: 'currentCustomerId' },
    { header: 'שם לקוח', accessor: 'currentCustomerName' },
    { header: 'נוצר ב', accessor: 'createdAt' },
    { header: 'עודכן ב', accessor: 'updatedAt' },
  ];



  return (
    <div style={{ padding: "20px" }}>
      <h1>ניהול חללים</h1>

      <div style={{ marginBottom: "20px" }}>
        {/* <Button variant="contained" color="primary" onClick={handleAddSpace}> */}
        <Button variant="primary" onClick={handleAddSpace}>

          הוספת חלל חדש
        </Button>
      </div>

      <h2>רשימת החללים:</h2>
      {workSpaces.length === 0 ? (
        <p>אין חללים להצגה.</p>
      ) : (
        <StyledTable<Space>
          columns={columns}
          data={workSpaces}
          onUpdate={handleEdit}
          onDelete={handleDelete}
          className="shadow-lg"
        />
      )}

      {/* Modal for Adding/Editing Space */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{newSpace.id ? "עריכת חלל" : "הוספת חלל חדש"}</DialogTitle>
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
            label="workspaceMapId"
            fullWidth
            name="workspaceMapId"
            value={newSpace.workspaceMapId}
            onChange={handleChange}
            required
            style={{ marginBottom: "10px" }}
          />
          <FormControl fullWidth style={{ marginBottom: "10px" }}>
            <InputLabel>סוג חלל</InputLabel>
            <Select
              name="type"
              value={newSpace.type}
              onChange={handleSelectChange}
              label="סוג חלל"
            >
              {Object.values(WorkspaceType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: "10px" }}>
            <InputLabel>סטטוס חלל</InputLabel>
            <Select
              name="status"
              value={newSpace.status}
              onChange={handleSelectChange}
              label="סטטוס חלל"
            >
              {Object.values(SpaceStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
      <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
        <DialogTitle>אישור מחיקה</DialogTitle>
        <DialogContent>
          <p>האם אתה בטוח שברצונך למחוק את החלל "{workspaceToDelete?.name}"?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="secondary">
            ביטול
          </Button>
          <Button onClick={confirmDelete} color="destructive">
            מחק
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};