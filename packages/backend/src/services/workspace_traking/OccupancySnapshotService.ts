import {OccupancySnapshot} from'../../models/workspace_traking/OccupancySnapshot';
//כדי לראות את תמונת המצב
async function getAllSnapshots(body: any) {
}
  //דיווח תפוסה לפי סוג חלל עבודה ופרק זמן
async function getSnapshotReport(body: any){
}
  //כדי ליצא ל-csv 
async function exportOccupancySnapshotsToCSV(body: any){
}
//כדי לשמור את הנתונים הישנים בארכיון
async function archiveOldSnapshots(body: any){

}
//במקרה שהחישוב יכשל 
async function calculateOccupancyRate(id:any) {
  
}
//ניהול ללקוח שיש לו כמה משימות
async function calculateClientOccupancyS(customerId:any) {
  
}
//אינטגרציה עם סוגי לקוחות
async function integraionCustomer(customerId:any) {
  
}
export default {
  getAllSnapshots,
  getSnapshotReport,
  exportOccupancySnapshotsToCSV,
  archiveOldSnapshots,
  calculateOccupancyRate,
  calculateClientOccupancyS,
  integraionCustomer
}