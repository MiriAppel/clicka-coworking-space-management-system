import express from 'express'; // ייבוא express לצורך יצירת router חדש
import { handleGenerateReport } from '../controllers/reports.controller'; // ייבוא הפונקציה מה-controller שמטפלת בבקשות לדוחות

const router = express.Router(); // יצירת instance של express router
const reportController=new reports.controller(); // יצירת instance של ה-controller
// מסלול POST לדוחות
// כתובת ה-API תהיה /api/billing/reports/:type
router.post('/reports/:type', handleGenerateReport); // קישור הפונקציה מה-controller למסלול זה
// לדוגמה: POST /api/billing/reports/REVENUE
// :type יכול להיות כל אחד מהדוחות (REVENUE, EXPENSES וכו')

export default router; // ייצוא ברירת מחדל של ה-router
 