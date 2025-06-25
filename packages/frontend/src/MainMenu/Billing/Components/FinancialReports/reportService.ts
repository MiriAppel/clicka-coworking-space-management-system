import { ReportData, ReportParameters, ReportType } from 'shared-types'; // ייבוא הטיפוסים הדרושים

/**
 * פונקציה כללית לשליחת בקשה לשרת לקבלת דוח
 * @param type - סוג הדוח (REVENUE / EXPENSES)
 * @param parameters - הפרמטרים שנבחרו ע"י המשתמש (תאריכים, פילטרים וכו')
 * @returns תוצאת הדוח בפורמט ReportData
 */
export async function fetchReportData(type: ReportType, parameters: ReportParameters): Promise<ReportData> {
  try {
    // שליחת קריאת POST לשרת עם סוג הדוח והפרמטרים
    const response = await fetch(`/api/billing/reports/${type}`, {
      method: 'POST', // סוג הבקשה - POST
      headers: { 'Content-Type': 'application/json' }, // הגדרת סוג התוכן - JSON
      body: JSON.stringify(parameters), // המרת הפרמטרים למחרוזת JSON
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch report: ${response.statusText}`); // טיפול בשגיאות סטטוס
    }

    const data: ReportData = await response.json(); // המרת תגובת השרת ל־ReportData
    return data; // החזרת הנתונים

  } catch (error) {
    console.error('Error fetching report:', error); // הדפסת השגיאה לקונסול
    throw error; // החזרת השגיאה להמשך טיפול
  }
}
