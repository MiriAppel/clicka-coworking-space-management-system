import { OccupancyTrend } from '../models/workspaceTraking/OccupancyTrend';

// כדי לזהות מגמת תפוסה
async function getAllTrends(id: any): Promise<OccupancyTrend[]> {
  return [];
}

// לעדכן - לבצע אופטימיזציה
async function updateTrend(id: any, data: Partial<OccupancyTrend>): Promise<OccupancyTrend | null> {
  return null;
}

// כדי לייצא ל־CSV
async function exportOccupancyTrendToCSV(filters: any): Promise<string> {
  return 'csv,data,here';
}

// כדי לשמור את הנתונים הישנים בארכיון
async function archiveOldTrend(filters: any): Promise<{ success: boolean }> {
  return { success: true };
}

// ניהול ללקוח שיש לו כמה משימות
async function calculateClientOccupancyT(customerId: any): Promise<any> {
  return {};
}

// ** יצוא נכון כברירת מחדל — מתאים ל-import trendService from ...
export default {
  getAllTrends,
  updateTrend,
  exportOccupancyTrendToCSV,
  archiveOldTrend,
  calculateClientOccupancyT
};
