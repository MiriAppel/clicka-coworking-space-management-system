import {OccupancyAlert} from'../../models/workspace_traking/OccupancyAlert';
//להקפיץ טריגר אם הקיבולת מתקרבת לסף
async function checkAndTriggerAlert(id:any) {
}
//כדי ליצא ל-csv 
async function exportOccupancyAlertToCSV(body: any) {
    
}
//כדי לשמור את הנתונים הישנים בארכיון
async function archiveOldAlert(body: any){

}
//במקרה של אי מסירת הודעות
async function sendOccupancyAlert(id:any) {
    
}
export default{
    checkAndTriggerAlert,
    exportOccupancyAlertToCSV,
    archiveOldAlert,
    sendOccupancyAlert

}