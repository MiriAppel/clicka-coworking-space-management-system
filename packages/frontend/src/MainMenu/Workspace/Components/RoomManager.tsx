import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useRoomStore } from "../../../Stores/Workspace/roomStore";
import { Button } from "../../../Common/Components/BaseComponents/Button";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { showAlert } from "../../../Common/Components/BaseComponents/ShowAlert";
import { RoomModel } from "../../../../../backend/src/models/room.model";
import { RoomStatus, RoomType } from "shared-types";
import Swal from "sweetalert2";
import { Room } from "shared-types/booking";

type RoomForm = {
  name: string;
  type: RoomType;
  description?: string;
  capacity: number;
  hourlyRate: number;
  discountedHourlyRate: number;
  status: RoomStatus;
  equipment: string;
  features: string;
  minimumBookingMinutes: number;
  maximumBookingMinutes: number;
  FreeHoursForKlikcaCard: number;  // שים לב ל-CamelCase מדויק
  RequiredApproval: boolean;      // R גדולה!
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  workspaceMapId?: string; // אם יש צורך במזהה מפה
};

export function RoomManager() {
  const { rooms, getAllRooms, createRoom, updateRoom, deleteRoom } = useRoomStore();

  const methods = useForm<RoomForm>({
    defaultValues: {
      name: "",
      type: RoomType.MEETING_ROOM,
      capacity: 1,
      hourlyRate: 0,
      discountedHourlyRate: 0,
      status: RoomStatus.AVAILABLE,
      equipment: "",
      features: "",
      minimumBookingMinutes: 30,
      maximumBookingMinutes: 120,
      FreeHoursForKlikcaCard: 0,
      RequiredApproval: false,
      positionX: 0,
      positionY: 0,
      width: 1,
      height: 1,
    },
  });

  const { handleSubmit, reset, watch, control, setValue } = methods;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    getAllRooms();
  }, [getAllRooms]);

  const onSubmit = async (data: RoomForm) => {
    console.log("📤 נתוני טופס לפני שליחה:", data);

    try {
      if (!data.name) {
        return showAlert("שגיאה", "יש למלא את כל השדות החובה", "error");
      }
      if (
        data.discountedHourlyRate > data.hourlyRate ||
        data.discountedHourlyRate < 0
      ) {
        return showAlert(
          "שגיאה",
          "מחיר מוזל חייב להיות בין 0 למחיר רגיל",
          "error"
        );
      }
      if (data.minimumBookingMinutes <= 0 || data.maximumBookingMinutes <= 0) {
        return showAlert("שגיאה", "ערכי הזמנה חייבים להיות גדולים מ-0", "error");
      }
      if (data.maximumBookingMinutes < data.minimumBookingMinutes) {
        return showAlert(
          "שגיאה",
          "מקסימום הזמנה לא יכול להיות קטן ממינימום הזמנה",
          "error"
        );
      }
      if (data.width <= 0 || data.height <= 0) {
        return showAlert("שגיאה", "הרוחב והגובה חייבים להיות גדולים מ-0", "error");
      }

      const roomData: Partial<RoomModel> = {
        name: data.name,
        type: data.type,
        status: data.status,
        capacity: data.capacity,
        hourlyRate: data.hourlyRate,
        discountedHourlyRate: data.discountedHourlyRate,
        MinimumBookingMinutes: data.minimumBookingMinutes,
        MaximumBookingMinutes: data.maximumBookingMinutes,
        RequiredApproval: data.RequiredApproval, // R גדולה
        workspaceMapId: "ee67f9b4-bb66-4c7d-9d19-91dd209920f1", // תתאים לפי הצורך
        equipment: data.equipment.split(",").map((e) => e.trim()).filter(Boolean),
        FreeHoursForKlikcaCard: data.FreeHoursForKlikcaCard, // CamelCase מדויק
        positionX: data.positionX,
        positionY: data.positionY,
        width: data.width,
        height: data.height,
      };

      console.log("📡 נתונים שנשלחים לשרת:", roomData);

      if (editingId) {
        await updateRoom(editingId, roomData);
        showAlert("", "החדר עודכן בהצלחה", "success");
      } else {
        await createRoom(roomData);
        showAlert("", "החדר נוצר בהצלחה", "success");
      }
      reset();
      setEditingId(null);
      setIsFormVisible(false);
      getAllRooms();
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.message || "שגיאה כללית בבקשה";
      showAlert("שגיאה", msg, "error");
    }
  };

  const handleEdit = (room: Room) => {
    console.log("✏️ חדר בעריכה:", room);

    reset({
      name: room.name,
      description: room.description,
      type: room.type,
      status: room.status,
      capacity: room.capacity,
      hourlyRate: room.hourlyRate ?? 0,
      discountedHourlyRate: room.discountedHourlyRate ?? 0,
      features:room.features?.map((f) => f).join(", ") ?? "",
      // minimumBookingMinutes: room.MinimumBookingMinutes ?? 30,
      // maximumBookingMinutes: room.MaximumBookingMinutes ?? 120,
      // FreeHoursForKlikcaCard: room.FreeHoursForKlikcaCard ?? 0,
      // RequiredApproval: room.RequiredApproval ?? false,
      positionX: room.positionX ?? 0,
      positionY: room.positionY ?? 0,
      width: room.width ?? 1,
      height: room.height ?? 1,
      workspaceMapId: room.workspaceMapId ?? "ee67f9b4-bb66-4c7d-9d19-91dd209920f1",
    });

    setEditingId(room.id ?? null);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      text: "בטוח שברצונך למחוק את החדר?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085D6",
      confirmButtonText: "מחק",
      cancelButtonText: "ביטול",
      reverseButtons: false,
    });

    if (result.isConfirmed) {
      try {
        await deleteRoom(id);
        showAlert("", "החדר נמחק", "success");
        getAllRooms();
      } catch (e) {
        console.error(e);
        showAlert("שגיאה", "מחיקה נכשלה", "error");
      }
    }
  };

  const handleAdd = () => {
    reset();
    setEditingId(null);
    setIsFormVisible(true);
  };

  const filteredRooms = rooms.filter((r) => r && r.name);

  return (
    <div
      style={{
        padding: 20,
        maxWidth: "100%",
        margin: "auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>ניהול חדרים</h1>

      {!isFormVisible && (
        <>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Button variant="primary" onClick={handleAdd}>
              הוסף חדר
            </Button>
          </div>

          <div style={{ flexGrow: 1, overflowY: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#f3f4f6",
                  textAlign: "right",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                <tr>
                  <th style={{ padding: 12, borderBottom: "1px solid #ddd" }}>שם</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #ddd" }}>סוג</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #ddd" }}>קיבולת</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #ddd" }}>מחיר רגיל</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #ddd" }}>מחיר מוזל</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #ddd" }}>סטטוס</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #ddd" }}>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <tr
                      key={room.id}
                      style={{
                        backgroundColor: "#fff",
                        borderBottom: "1px solid #eee",
                        textAlign: "right",
                      }}
                    >
                      <td style={{ padding: 10 }}>{room.name}</td>
                      <td style={{ padding: 10 }}>{room.type}</td>
                      <td style={{ padding: 10 }}>{room.capacity}</td>
                      <td style={{ padding: 10 }}>
                        {typeof room.hourlyRate === "number"
                          ? `${room.hourlyRate} ₪`
                          : "-"}
                      </td>
                      <td style={{ padding: 10 }}>
                        {typeof room.discountedHourlyRate === "number"
                          ? `${room.discountedHourlyRate} ₪`
                          : "-"}
                      </td>
                      <td style={{ padding: 10 }}>{room.status}</td>
                      <td
                        style={{
                          padding: 10,
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          size="sm"
                          onClick={() => handleEdit(room)}
                          style={{
                            backgroundColor: "#F5A623",
                            color: "#fff",
                            minWidth: 40,
                            padding: "4px 6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 6,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#d98f1a")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#F5A623")
                          }
                        >
                          <EditIcon fontSize="small" />
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleDelete(room.id ?? "")}
                          style={{
                            backgroundColor: "#5A6B80",
                            color: "#fff",
                            minWidth: 40,
                            padding: "4px 6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 6,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#4a5568")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#5A6B80")
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: 20, textAlign: "center" }}>
                      אין חדרים להצגה
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isFormVisible && (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ maxWidth: 600, mx: "auto", p: 2, border: "1px solid #ccc", borderRadius: 2 }}
          noValidate
        >
          <h2 style={{ textAlign: "center", marginBottom: 24 }}>
            {editingId ? "עריכת חדר" : "הוספת חדר חדש"}
          </h2>

          <FormProvider {...methods}>
            <TextField
              label="שם חדר"
              fullWidth
              margin="normal"
              {...methods.register("name", { required: true })}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="type-label">סוג חדר</InputLabel>
                  <Select labelId="type-label" {...field}>
                    <MenuItem value={RoomType.MEETING_ROOM}>חדר ישיבות</MenuItem>
                    <MenuItem value={RoomType.LOUNGE}>לאונג’</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <TextField
              label="קיבולת"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("capacity", { valueAsNumber: true, min: 1 })}
            />
            <TextField
              label="מחיר לשעה"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("hourlyRate", { valueAsNumber: true, min: 0 })}
            />
            <TextField
              label="מחיר מוזל"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("discountedHourlyRate", { valueAsNumber: true, min: 0 })}
            />
            <TextField label="ציוד (מופרד בפסיקים)" fullWidth margin="normal" {...methods.register("equipment")} />
            <TextField label="מאפיינים (UUIDs מופרדים בפסיקים)" fullWidth margin="normal" {...methods.register("features")} />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">סטטוס</InputLabel>
                  <Select labelId="status-label" {...field}>
                    <MenuItem value={RoomStatus.AVAILABLE}>זמין</MenuItem>
                    <MenuItem value={RoomStatus.MAINTENANCE}>תחזוקה</MenuItem>
                    <MenuItem value={RoomStatus.INACTIVE}>לא פעיל</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <TextField
              label="מינימום זמן הזמנה (בדקות)"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("minimumBookingMinutes", { valueAsNumber: true, min: 1 })}
            />
            <TextField
              label="מקסימום זמן הזמנה (בדקות)"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("maximumBookingMinutes", { valueAsNumber: true, min: 1 })}
            />
            <TextField
              label="שעות חינם לקליקה"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("FreeHoursForKlikcaCard", { valueAsNumber: true, min: 0 })}
            />
            <TextField
              label="מיקום X"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("positionX", { valueAsNumber: true, min: 0 })}
            />
            <TextField
              label="מיקום Y"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("positionY", { valueAsNumber: true, min: 0 })}
            />
            <TextField
              label="רוחב"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("width", { valueAsNumber: true, min: 1 })}
            />
            <TextField
              label="גובה"
              fullWidth
              margin="normal"
              type="number"
              {...methods.register("height", { valueAsNumber: true, min: 1 })}
            />
            <Box sx={{ mt: 2, mb: 3 }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
                האם נדרש אישור להזמנה?
              </label>
              <label style={{ marginRight: 16 }}>
                <input
                  type="radio"
                  value="true"
                  {...methods.register("RequiredApproval")}
                  checked={watch("RequiredApproval") === true}
                  onChange={() => setValue("RequiredApproval", true)}
                />{" "}
                כן
              </label>
              <label>
                <input
                  type="radio"
                  value="false"
                  {...methods.register("RequiredApproval")}
                  checked={watch("RequiredApproval") === false}
                  onChange={() => setValue("RequiredApproval", false)}
                />{" "}
                לא
              </label>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsFormVisible(false);
                  setEditingId(null);
                }}
              >
                ביטול
              </Button>
              <Button type="submit" variant="primary">
                {editingId ? "עדכון חדר" : "יצירת חדר"}
              </Button>
            </Box>
          </FormProvider>
        </Box>
      )}
    </div>
  );
}
