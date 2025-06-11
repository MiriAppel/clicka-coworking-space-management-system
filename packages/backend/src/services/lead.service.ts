// lead.service.ts

import { LeadModel } from '../types/lead'; 

export const getAllLeads = async (): Promise<LeadModel[]> => {
    //אמור לשלוף את כל הלידים
    return []; // להחזיר מערך של לידים
}

export const getLeadById = async (id: string): Promise<LeadModel | null> => {
    // אמור לשלוף ליד לפי מזהה
    // להחזיר את הליד שנמצא או null אם לא נמצא
}

export const createLead = async (leadData: LeadModel): Promise<LeadModel> => {
    // אמור ליצור ליד חדש
    //בדיקת טלפון ומייל תקינים
    // בדיקה אם הם קיימים
    // עיבוד פורמטים של מספרי טלפון בינאלומיים
    // טיפול בקלט מעורב עברי- אנגלי
    // תמיכה בקבצים מצורפים לתיעוד אינטראקציה
    // שילוב עם מערכת דוא"ל לרישום אוטומטי
    return leadData; // להחזיר את הליד שנוצר
}

export const GetSourcesLeadById = async (id: string): Promise<String[]> => {
    // אמור לשלוף את מקורות הליד לפי מזהה
    return []; // להחזיר מערך של מקורות הליד
}

export const fullUpdateLead = async (leadData: LeadModel): Promise<LeadModel> => {
    // אמור לעדכן ליד קיים
    return leadData; // להחזיר את הליד המעודכן
}





