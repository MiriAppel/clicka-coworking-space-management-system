import { createClient } from '@supabase/supabase-js';
import { BookingModel } from "../models/booking.model";
import type { ID, Room } from "shared-types";
import dotenv from 'dotenv';
import { customerService } from './customer.service';
import { getCurrentMeetingRoomPricing, getMeetingRoomPricingHistory } from './pricing.service';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
   


function logUserActivity(userId: string, action: string) {
  console.log(`[Activity Log] ${userId}: ${action}`);
}

export class BookingService {
  
   
  async createBooking(book: BookingModel): Promise<BookingModel | null> {
    try {
      // אם יש לקוח קיים - ננסה לשלוף את שמו
      if (book.customerId) {
        console.log('🔍 Trying to fetch customer name by ID:', book.customerId);
  
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('name')
          .eq('id', book.customerId)
          .single();
  
        if (customerError || !customer) {
          console.warn('⚠️ לא נמצא שם לקוח, נמשיך בלי זה');
        } else {
          console.log('✅ Customer found:', customer.name);
          book.customerName = customer.name;
        }
      }
  
      console.log('📦 Inserting booking:', book.toDatabaseFormat());
  
      const { data, error } = await supabase
        .from('booking')
        .insert([book.toDatabaseFormat()])
        .select()
        .single();
  
      if (error) {
        console.log('❌ Supabase Insert Error:', error);
        throw new Error(`Failed to create booking: ${error.message}`);
      }
  
      const createdBook = BookingModel.fromDatabaseFormat(data);
      logUserActivity(book.id ?? book.roomName, 'book created');
      return createdBook;
    } catch (err) {
      console.error('❌ Error in createBooking:', err);
      return null;
    }
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
  console.log(booking);
      return booking;
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  } 
  //פונקציה לחישוב סכום חיובים עבור הזמנת חדר ישיבות
  //אם הלקוח הוא חיצוני תשלום רגיל
  //אם  הלקוח הוא קיים:
  //1.אם מוקצה לו כרגע חלל - זה בחינם 
  //2.אם יש לו כרטיס קליקה הוא מקבל מחיר מסובסד
  static async calculateExtrenalCharges(totalHours:number) {
    const roomPricing =await getCurrentMeetingRoomPricing();
 if(!roomPricing){
      console.log("there is no pricing");
      return null;
    } 
  let totalCharge: number = 0;
  let chargeableHours: number = 0;
  }
 static async calculateCustomerCharges(customerId:string,totalHours:number) {
   console.log('Received request to update booking:', customerId);
    //בדיקה האם ללקוח כרטיס קליקה
    const customerServic = new customerService() 
    const customers =await customerServic.getAllCustomers();
    console.log("😍😍😍"+customers);
    const currentCustomerType = customers?.find(customer => customer.id === customerId)?.currentWorkspaceType
    if(!currentCustomerType){
      console.log("there is no customer type");
    }
    console.log("😍😍😍" + currentCustomerType );
    const roomPricing =await getCurrentMeetingRoomPricing();
    if(!roomPricing){
      console.log("there is no pricing");
      return null;
    }
  let totalCharge: number = 0;
  let chargeableHours: number = 0;
    if(roomPricing && currentCustomerType==="KLIKAH_CARD"){
      if(roomPricing.freeHoursKlikahCard > totalHours){
       {chargeableHours = totalHours - roomPricing.freeHoursKlikahCard;
        totalCharge =((chargeableHours  * (roomPricing.freeHoursKlikahCard) + (totalHours-chargeableHours) * (roomPricing.hourlyRate))) } 
     }
    else{
       chargeableHours = 0
        totalCharge = (totalHours  * (roomPricing.hourlyRate))
    }      
    }
     return  {chargeableHours,
              totalCharge }
    }
    static async updateBooking(id: string, updatedData: BookingModel): Promise<BookingModel | null> {
  //אם התקבל לקוח יש לו מחיר מיוחד ואם זה משתמש חיצוני המחיר שלו הוא רגיל
  if(updatedData.externalUserName){
     const result = await this.calculateExtrenalCharges(updatedData.totalHours);
  }
  if(updatedData.customerId){ 
    const result = await this.calculateCustomerCharges(updatedData.customerId,updatedData.totalHours);
   if (result) {
    const { chargeableHours, totalCharge } = result; 
    console.log("שעות לחיוב:", chargeableHours);
    console.log("סכום לחיוב:", totalCharge);
   }}
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
  static async getBookingById(id?:string|null) {
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
  static async  getBookingByEventId(googleEventId:string) {
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
     //אישור הזמנה 
   async bookingApproval(id: string): Promise<BookingModel | null> {
          const { data, error } = await supabase
              .from('booking')
              .update({'approved_by': "" ,'status': "APPROVED",'approved_at': new Date()})
              .eq('id', id)
              .select()
              .single();  
          if (error) {
              console.error('Error updating booking:', error);
              return null;
          }
          const booking =  BookingModel.fromDatabaseFormat(data); 
             console.log('📦 Updating booking:', booking);
          return booking; 
  }
// //תשימי לב שכאן עברתי על מערך של חדרי פגישות 
//     let freeHoursLeft = 34;
//         // אתחול שעות חינם שנותרו ללקוחות "קליקה כארד" (34 שעות).
//         for (const booking of input.meetingRoomBookings) {
//             // לולאה העוברת על כל הזמנות חדרי הישיבות.
//             let hourlyRate = booking.pricing.hourlyRate;
//             // אתחול התעריף השעתי לתעריף הרגיל של חדר הישיבות.
//             let chargeableHours = booking.totalHours;
//             // אתחול השעות לחיוב לסך השעות שהוזמנו.
//             let discountApplied = 0;
//             // אתחול סכום ההנחה שהופעלה.
//             if (isKlikahCardHolder) {
//                 // אם הלקוח הוא בעל "קליקה כארד".
//                 let freeHoursForThisBooking = Math.min(freeHoursLeft, booking.totalHours);
//                 // חישוב שעות חינם שיש להחיל על הזמנה זו (המינימום בין השעות החינם שנותרו לסך השעות בהזמנה).
//                 freeHoursLeft -= freeHoursForThisBooking;
//                 // הפחתת שעות החינם שהופעלו מסך השעות החינם שנותרו.
//                 chargeableHours = booking.totalHours - freeHoursForThisBooking;
//                 // חישוב השעות לחיוב לאחר הפחתת שעות החינם.
//                 discountApplied = freeHoursForThisBooking * hourlyRate;
//                 // חישוב סכום ההנחה שהופעלה.
//                 console.log(`Free hours applied: ${freeHoursForThisBooking}, Remaining free hours: ${freeHoursLeft}`);
//                 // הדפסת פרטי שעות החינם לקונסול.
//             } else {
//                 // אם הלקוח אינו בעל "קליקה כארד".
//                 if (booking.totalHours >= 4) {
//                     // אם סך השעות שהוזמנו הוא 4 ומעלה.
//                     hourlyRate = booking.pricing.discountedHourlyRate;
//                     // שימוש בתעריף השעתי המוזל.
//                 }
//             }
//             const totalCharge = Math.round(chargeableHours * hourlyRate * 100) / 100;
//             // חישוב הסכום הכולל לחיוב עבור הזמנת חדר ישיבות זו.
//             console.log(`Booking ID: ${booking.bookingId}, Chargeable hours: ${chargeableHours}, Hourly rate: ${hourlyRate}, Total charge: ${totalCharge}`);
//             // הדפסת פרטי החיוב עבור הזמנת חדר הישיבות לקונסול.
//             meetingRoomCharges.push({
//                 bookingId: booking.bookingId, // מזהה ההזמנה
//                 roomId: booking.roomId, // מזהה החדר
//                 totalHours: booking.totalHours, // סך השעות שהוזמנו
//                 chargeableHours, // שעות לחיוב
//                 hourlyRate, // תעריף שעתי
//                 totalCharge, // סכום כולל לחיוב
//                 discountApplied: discountApplied > 0 ? discountApplied : undefined, // סכום הנחה (אם הופעלה)
//             });

  }



