import { createClient } from '@supabase/supabase-js';
import { BookingModel } from "../models/booking.model";
import type { ID } from "shared-types";
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

function logUserActivity(userId: string, action: string) {
  console.log(`[Activity Log] ${userId}: ${action}`);
}

export class BookingService {
    static getBookingByEventId(id: string | null | undefined): any {
        throw new Error("Method not implemented.");
    }
   
  async createBooking(book: BookingModel): Promise<BookingModel | null> {
    console.log('📦 Inserting booking:', book.toDatabaseFormat());
    const { data, error } = await supabase
      .from('booking')
      .insert([book.toDatabaseFormat()])
      .select()
      .single();


   if (error) {
  console.log('❌ Supabase Insert Error:', error); // ✅ הוספתי הדפסה מפורטת
throw new Error(`Failed to create booking: ${error.message}`);
  }

    const createdBook =   BookingModel.fromDatabaseFormat(data);
    logUserActivity(book.id ?? book.roomName, 'book created');
    return createdBook;
    }
      async getAllBooking() {
    try {
      const { data, error } = await supabase
        .from('booking') 
        .select('*');

      if (error) {
        console.error('Supabase error:', error.message);
        return null;
      }
 const booking = BookingModel.fromDatabaseFormatArray(data)
      return booking;
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  }
   static async updateBooking(id: string, updatedData: BookingModel): Promise<BookingModel | null> {
  const formattedData = updatedData.toDatabaseFormat();
  console.log(":rocket: Trying to update booking with ID:", id);
  console.log(":memo: Data being sent:", formattedData);
  const { data, error } = await supabase
    .from('booking')
    .update([formattedData])
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error(':fire: Supabase update error:', error);
    return null;
  }
  if (!data) {
    console.warn(':warning: No data returned. ID might not exist.');
    return null;
  }
  console.log(":white_check_mark: Successfully updated booking:", data);
  return BookingModel.fromDatabaseFormat(data);
}
  //מחיקת פגישה
  async  deleteBooking(id:string) {
              const { error } = await supabase
              .from('booking')
              .delete()
              .eq('id', id);
  
          if (error) {
              console.error('Error deleting booking:', error);
              return false;
          }
          
         // logUserActivity(id, 'User deleted');
          // מחזיר true אם הפיצ'ר נמחק בהצלחה
          return true; 
  }
  
  //קבלת  פגישה לפי ID
  async  getBookingById(id:string) {
           const { data, error } = await supabase
                  .from('booking')
                  .select('*')
                  .eq('id', id)
                  .single();
      
              if (error) {
                  console.error('Error fetching booking:', error);
                  return null;
              }
      
              const booking = BookingModel.fromDatabaseFormat(data); // המרה לסוג UserModel
              // רישום פעילות המשתמש
             // logUserActivity(feature.id? feature.id:feature.description, 'User fetched by ID');
              // מחזיר את המשתמש שנמצא
              return booking;
  }
  //googleeventIdקבלת  פגישה לפי ID
  async  getBookingByEventId(googleEventId:string) {
           const { data, error } = await supabase
                  .from('booking')
                  .select('*')
                  .eq('google_calendar_event_id', googleEventId)
                  .single();
      
              if (error) {
                  console.error('Error fetching booking:', error);
                  return null;
              }
      
              const booking = BookingModel.fromDatabaseFormat(data); // המרה לסוג UserModel
              // רישום פעילות המשתמש
             // logUserActivity(feature.id? feature.id:feature.description, 'User fetched by ID');
              // מחזיר את המשתמש שנמצא
              return booking;
  }
}


