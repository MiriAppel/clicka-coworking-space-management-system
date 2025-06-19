import {Room} from'../models/Room';
//יצירת חדר
async function CreateRoomRequest(body: any) {
    
}
//עדכון חדר
//בעדכון Room.status= לא פעיל יש להוסיף בדיקה האם קימת הזמנה עתידית אם כן לשלוח שגיאה
//ב-Controller לעדכון תכונות / ציוד: לפני שמוחקים — לבדוק אם יש Booking.
//בשמשנים discountedHourlyRate או hourlyRate צריך לשמור את המחיר בזמן ההזמנה ולהזמנות קימות לא לשנות מחיר אוטומטי
async function UpdateRoomRequest(id:any) {
    
}
//קבלת חדר
async function GetRoomRequest(id:any) {
    
}
//קבלת כל החדרים
async function GetRoomsRequest(body: any) {
    
}
//מחיקת חדר
async function deleteRoomRequest(id:any) {
    
}
//טיפול בכשלים באינטגרציה עם יומן גוגל
//יש לבדוק אם ההרשאות תקינות ואם TOKEN בתוקפו 
//וכן יש לבדוק אם הפגשיה נשמרת
async function integrationWithGoogle(id:any) {
    //להשתמש ב-try,catch
    //לשמור שגיאות במסד נתונים
    //לשלוח הודעות למנהל במקרה של כשל
}

export default{
    CreateRoomRequest,
    UpdateRoomRequest,
    GetRoomRequest,
    GetRoomsRequest,
    deleteRoomRequest,
    integrationWithGoogle
}