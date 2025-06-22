<<<<<<< HEAD
import {LeadModel} from "../models/lead.model";
import { LeadInteractionModel } from "../models/LeadInteraction";
import { supabase } from "../db/supabaseClient";
import { CreateLeadRequest, ID, LeadStatus, UpdateLeadRequest } from "shared-types";
=======
import { ID } from "../../../../types/core";
import { UpdateLeadRequest } from "../../../../types/lead";
import { supabase } from "../db/supabaseClient";
import { baseService } from "./baseService";
import { LeadSource } from "../../../../types/lead";
import { LeadModel } from "../models/lead.model";
import { parse } from 'papaparse';
>>>>>>> origin/main

export class leadService extends baseService <LeadModel> {

<<<<<<< HEAD
export const getLeadById = async (id: string): Promise<LeadModel | null> => {
  // אמור לשלוף ליד לפי מזהה
  // להחזיר את הליד שנמצא או null אם לא נמצא
  return null;
};

export const createLead = async (
  leadData: CreateLeadRequest
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
  leadData: UpdateLeadRequest
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

export const GetLeadToRemind = (): Promise<LeadModel[]> => {
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

export const checkIfFullLead = async (leadData: UpdateLeadRequest): Promise<boolean> => {
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
=======
  constructor() {
    super("LeadModel")
>>>>>>> origin/main
  }

  getSourcesLeadById = async (id: string): Promise<LeadSource[]> => {

    const { data, error } = await supabase
      .from('leads')
      .select('source')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching sources for lead by ID:', error);
      throw new Error('Failed to fetch sources for lead by ID');
    }
    if (!data) {
      console.warn(`No lead found with ID: ${id}`);
      return [];
    }
    return [data.source] as LeadSource[]; // הנחה שהשדה נקרא 'source'

  };

  addLeadFromCSV = async (csvData: string): Promise <void> => {

    // const parsedData = parse(csvData, { header: true }).data as UpdateLeadRequestModel[];
    const parsedData = parse(csvData, { header: true }).data as UpdateLeadRequest[];
    for (const lead of parsedData) {
      const isFullLead = this.checkIfFullLead(lead);

      if (!isFullLead) {
        console.warn('Incomplete lead data:', lead);
        continue; // דלג על ליד לא מלא
      }
      const { error } = await supabase.from('leads').insert(lead);
      if (error) {
        console.error('Error adding lead:', error);
        throw new Error('Failed to add lead');
      }
    }
  }
  
  checkIfFullLead(lead: UpdateLeadRequest): boolean {
    return !!(lead && lead.name && lead.email && lead.businessType && lead.phone && lead.interestedIn); 
  }

  convertCsvToLeads = (csvData: string): Promise <LeadModel[]> => {
      // אמור להמיר קובץ CSV למערך של לידים
      // עיבוד קובץ CSV והמרתו למערך של לידים
      return Promise.resolve([]);
  }

  getOpenReminders = async (): Promise<LeadModel[]> => {
      // אמור לשלוף לידים עם תזכורות פתוחות
      // להחזיר מערך של לידים עם תזכורות פתוחות
    return [];
  }

  checkIfLeadBecomesCustomer = async (leadId: ID): Promise<boolean> => {
    
    const lead = await this.getById(leadId);

    if (lead.status === 'CONVERTED')
      return true;
    return false;
    
  }
};
