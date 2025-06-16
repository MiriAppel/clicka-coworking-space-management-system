import {OccupancyTrend} from'../../models/workspace_traking/OccupancyTrend';
//כדי לזהות מגמת תפוסה
async function getAllTrends(id:any) {
    
}
//לעדכן-לבצע אופטומיזציה
async function updateTrend(id:any) {
    
}
//כדי ליצא ל-csv 
async function exportOccupancyTrendToCSV() {
    
}
//כדי לשמור את הנתונים הישנים בארכיון
async function archiveOldTrend(){

}
//ניהול ללקוח שיש לו כמה משימות
async function calculateClientOccupancyT(customerId:any) {
  
}
module.exports={
    getAllTrends,
    updateTrend,
    exportOccupancyTrendToCSV,
    archiveOldTrend,
    calculateClientOccupancyT
}