//import {workspaceInventoryMenagement} from '../models/'
//פונקציה ששולפת את כל ה-workspace שסטטוס שלהם פנוי
async function getByAvialableStatus(id:any) {
}
//פונקציה השולפת את כל סוגי החדרים מתוך אינם
async function getAllTypes(id:any) {
    
}
//פונקציה השולפת את כל האופציות הנתונות לתכולת חדר בלי כפולים
async function getAllCpacities(roomid:any) {
    
}
//פונקציה ששולפת חללים עפ"י טיפ וסוג capacity
async function getBySpaceTypeAndCapacity(id:any) {
    
}
//פונקציה המגדירה חלל עבודה חדש תוך בדיקה שאין התנגשות עם חללים אחרים 
async function createWorkspace(id:any) {
    
}
//עדכון כל המאפינים הרלוונטים למנהל
async function updateWorkSpaceById(id:any) {
    
}
//סביבת העבודה מחיקת
async function deleteWorkSpaceById(id:any) {
    
}
export default{
    getByAvialableStatus,
    getAllTypes,
    getAllCpacities,
    getBySpaceTypeAndCapacity,
    createWorkspace,
    updateWorkSpaceById,
    deleteWorkSpaceById
}