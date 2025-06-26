import { error } from 'console';
import {Room} from'../models/room';
import { supabase } from '../supabaseClient';
//יצירת חדר
async function createRoom(body: any) {
    if (!body.name || !body.type || !body.status) {
        throw new Error("Missing required fields");
    }
    const room = new Room(
        body.id,
        body.name,
        body.type,
        body.status,
        body.capacity,
        body.features || [],
        body.hourlyRate,
        body.discountedHourlyRate,
        body.location,
        body.equipment || [],
        body.bookingRules,
        body.nextMaintenanceDate,
        new Date().toISOString(),
        new Date().toISOString(),
        body.description,
        body.googleCalendarId
      );
      const { data, error } = await supabase
    .from('rooms')
    .insert([room.toDatabaseFormat()]);

  if (error) {
    throw error;
  }

  return data;

}
//עדכון חדר
//בעדכון Room.status= לא פעיל יש להוסיף בדיקה האם קימת הזמנה עתידית אם כן לשלוח שגיאה
//ב-Controller לעדכון תכונות / ציוד: לפני שמוחקים — לבדוק אם יש Booking.
//בשמשנים discountedHourlyRate או hourlyRate צריך לשמור את המחיר בזמן ההזמנה ולהזמנות קימות לא לשנות מחיר אוטומטי
async function updateRoom(id:any) {
    //בדיקה שהחדר קיים
    const { data: existingRoom, error: fetchError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !existingRoom) {
    throw new Error("Room not found");
  }
  //בדיקה שאין הזמנות עתידיות
  if (updates.status === 'Inactive') {
    const { data: futureBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('roomId', id)
      .gte('date', new Date().toISOString());

    if (bookingsError) {
      throw bookingsError;
    }

    if (futureBookings && futureBookings.length > 0) {
      throw new Error("Cannot deactivate room with future bookings");
    }
  }
  //לשמור ב-DB
  const { data, error } = await supabase
    .from('rooms')
    .update(updates)
    .eq('id', id);

  if (error) {
    throw error;
  }

  return data;
}
//קבלת חדר
async function getRoom(id:any) {
    const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
//קבלת כל החדרים
async function getRooms(body: any) {
    let query = supabase.from('rooms').select('*');
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data;
}
//מחיקת חדר
async function deleteRoom(id:any) {
    const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('roomId', id);

  if (bookingsError) {
    throw bookingsError;
  }

  if (bookings && bookings.length > 0) {
    throw new Error("Cannot delete room with existing bookings");
  }

  // מחיקה
  const { data, error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return { message: "Room deleted successfully" };
}


export default{
    createRoom,
    updateRoom,
    getRoom,
    getRooms,
    deleteRoom
}