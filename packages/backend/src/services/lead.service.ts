import {LeadModel,LeadInteractionModel,UpdateLeadRequestModel,CreateLeadRequestModel,} from "../models/lead.model";
import { ID } from "../types/core";
import { LeadStatus } from "../types/lead";
import { supabase } from "../db/supabaseClient";

export const getAllLeads = async (): Promise<LeadModel[]> => {
  //אמור לשלוף את כל הלידים
  return []; // להחזיר מערך של לידים
};

export const getLeadById = async (id: string): Promise<LeadModel | null> => {
  // אמור לשלוף ליד לפי מזהה
  // להחזיר את הליד שנמצא או null אם לא נמצא
  return null;
};

export const createLead = async (
  leadData: CreateLeadRequestModel
): Promise<void> => {
  // אמור ליצור ליד חדש
  //בדיקת טלפון ומייל תקינים
  // בדיקה אם הם קיימים
  // עיבוד פורמטים של מספרי טלפון בינאלומיים
  // טיפול בקלט מעורב עברי- אנגלי
  // תמיכה בקבצים מצורפים לתיעוד אינטראקציה
  // שילוב עם מערכת דוא"ל לרישום אוטומטי
  // יצירת אינטרקציה ראשונית עם ליד- לזמן את הפונקציה addInteractionToLead
};

export const GetSourcesLeadById = async (id: ID): Promise<String[]> => {
  // אמור לשלוף את מקורות הליד לפי מזהה
  return []; // להחזיר מערך של מקורות הליד
};

export const updatedLead = async (
  id: ID,
  leadData: UpdateLeadRequestModel
): Promise<LeadModel> => {
  //הפונקציה מזמנת את הפונקציה checkIfFullLead
  //אם זה עדכון חלקי זה שולח ל patch
  // אם זה עדכון מלא זה שולח ל put
  return leadData as LeadModel; // להחזיר את הליד המעודכן
};

export const addLeadFromCSV = async (csvData: string): Promise<void> => {
  // אמור להוסיף לידים מקובץ CSV
  // עיבוד קובץ CSV והמרתו למערך של לידים
};

export const addInteractionToLead = async (leadId: ID,interactionData: LeadInteractionModel): Promise<void> => {
  // מוסיף אינטרקציה במערך של אינטרקציות ליד
};

export const UpdateInteractione = async (date: LeadInteractionModel,id: ID) => {
  // אמור לעדכן אינטרקציה קיימת בליד
  // מחפש את האינטרקציה לפי מזהה ומעדכן אותה עם הפונקציה checkIfFullInteraction
};

export const GetLeadToRemined = (): Promise<LeadModel[]> => {
  // אמור לשלוף לידים שדורשים מעקב
  // להחזיר מערך של לידים שדורשים מעקב
  return Promise.resolve([]);
};

export const convertCsvToLeads = (csvData: string): Promise<LeadModel[]> => {
  // אמור להמיר קובץ CSV למערך של לידים
  // עיבוד קובץ CSV והמרתו למערך של לידים
  return Promise.resolve([]);
};

export const getAllInteractions = async (): Promise<LeadInteractionModel[]> => {
  // אמור לשלוף את כל האינטרקציות
  // להחזיר מערך של אינטרקציות ליד
  return [];
};

export const checkIfFullLead = async (leadData: UpdateLeadRequestModel): Promise<boolean> => {
    // אמור לבדוק אם הליד מלא
    return true; // להחזיר true או false בהתאם למצב הליד
}

export const checkIfFullInteraction = async (leadData: LeadInteractionModel): Promise<boolean> => {
  // אמור לבדוק אם הליד מלא
  return false;
    ; // להחזיר true או false בהתאם למצב הליד
};

export const deleteInteraction = async (leadId: ID, interactionId: ID): Promise<void> => {
  const { data, error } = await supabase
    .from('leads')
    .select('interactions')
    .eq('id', leadId)
    .single();

  if (error || !data?.interactions) throw new Error('Lead not found or error occurred');

  const updated = data.interactions.filter((i: any) => i.id !== interactionId);

  const { error: updateError } = await supabase
    .from('leads')
    .update({ interactions: updated })
    .eq('id', leadId);

  if (updateError) throw new Error('Failed to update interactions');
};


export const getOpenReminders = async (): Promise<LeadModel[]> => {
  // אמור לשלוף לידים עם תזכורות פתוחות
  // להחזיר מערך של לידים עם תזכורות פתוחות
  return [];
};

export const getLeadByEmail = async (
  email: string
): Promise<LeadModel | null> => {
  // אמור לשלוף ליד לפי כתובת דוא"ל
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching lead");
    throw new Error("Faild to fetch lead by email");
  }

  if (!data) {
    console.warn(`No lead has email: ${email}`);
    return null;
  }
  // להחזיר את הליד שנמצא או null אם לא נמצא
  return data as LeadModel;
};

export const getLeadByPhone = async (
  phone: string
): Promise<LeadModel | null> => {
  // אמור לשלוף ליד לפי מספר טלפון
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("phone", phone)
    .single();

  if (error) {
    console.error("Error fetching lead");
    throw new Error("Faild to fetch lead by phone");
  }
  if (!data) {
    console.warn(`No lead has phone number: ${phone}`);
    return null;
  }
  // להחזיר את הליד שנמצא או null אם לא נמצא
  return data as LeadModel;
};

export const getLeadByName = async (
  name: string
): Promise<LeadModel | null> => {
  // אמור לשלוף ליד לפי שם
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("name", name)
    .single();
  if (error) {
    console.error("Error fetching lead");
    throw new Error("Faild to fetch leas by name");
  }
  if (!data) {
    console.warn(`No lead has name: ${name}`);
    return null;
  }
  // להחזיר את הליד שנמצא או null אם לא נמצא
  return data as LeadModel;
};

export const getLeadByStatus = async (
  status: LeadStatus
): Promise<LeadModel[] | null> => {
  // אמור לשלוף לידים לפי סטטוס
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("status", status);

  if (error) {
    console.error("Error fetching leads by status");
    throw new Error("Failed to fetch leads by status");
  }
  if (!data || data.length == 0) {
    console.warn(`No leads found in status: ${status}`);
    return null; //אם אין לידים בסטטוס המבוקש
  }
  // להחזיר מערך של לידים עם הסטטוס המבוקש
  return data as LeadModel[];
};

export const getLeadBySource = async (
  source: string
): Promise<LeadModel[] | null> => {
  // אמור לשלוף לידים לפי מקור
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("source", source);
  if (error) {
    console.error("Error fetching leads by source:", error.message);
    throw new Error("Failed to fetch leads by source");
  }
  if (!data || data.length === 0) {
    console.warn(`No leads found with source: ${source}`);
    return null;
  }
  // להחזיר מערך של לידים עם המקור המבוקש
  return data as LeadModel[];
};

export const checkIfLeadBecomesCustomer = async (
  leadId: ID
): Promise<boolean> => {
  // אמור לבדוק אם ליד הפך ללקוח
  // בדיקה עם הפונקציה getLeadByStatus או getLeadById
  const { data, error } = await supabase
    .from("leads")
    .select("status")
    .eq("id", leadId)
    .single();

  if (error || !data) {
    console.error("Error checking lead status:", error);
    return false;
  }

  return data.status === LeadStatus.CONVERTED; // להחזיר true אם הליד הפך ללקוח, אחרת false
};
