import { LeadModel } from "../models/lead.model";
import { ID } from "../../../../types/core";
import { LeadStatus, UpdateLeadRequest } from "../../../../types/lead";
import { supabase } from "../db/supabaseClient";
import { baseService } from "./baseService";
import  {parse}  from 'papaparse'; // נניח שאתה משתמש בספריית papaparse לעיבוד CSV
import { LeadSource } from "../../../../types/lead";

export class LeadService extends baseService<LeadModel> {
  constructor() {
    super("LeadModel");
  }

  getSourcesLeadById = async (id: string): Promise<LeadSource[]> => {
    // אמור לשלוף את מקורות הליד לפי מזהה הליד
    const { data, error } = await supabase
      .from("leads")
      .select("source")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching sources for lead by ID:", error);
      throw new Error("Failed to fetch sources for lead by ID");
    }
    if (!data) {
      console.warn(`No lead found with ID: ${id}`);
      return [];
    }
    return [data.source] as LeadSource[]; // הנחה שהשדה נקרא 'source'
  };

  // אמור להוסיף לידים מקובץ CSV
  // עיבוד קובץ CSV והמרתו למערך של לידים
  addLeadFromCSV = async (csvData: string): Promise<void> => {
    // const parsedData = parse(csvData, { header: true }).data as UpdateLeadRequestModel[];
    const parsedData = parse(csvData, { header: true })
      .data as UpdateLeadRequest[];
    for (const lead of parsedData) {
      const isFullLead = await this.checkIfFullLead(lead);
      if (!isFullLead) {
        console.warn("Incomplete lead data:", lead);
        continue; // דלג על ליד לא מלא
      }
      const { error } = await supabase.from("leads").insert(lead);
      if (error) {
        console.error("Error adding lead:", error);
        throw new Error("Failed to add lead");
      }
    }
  };

  GetLeadToRemind = (): Promise<LeadModel[]> => {
    // אמור לשלוף לידים שדורשים מעקב
    // להחזיר מערך של לידים שדורשים מעקב
    return Promise.resolve([]);
  };

  checkIfFullLead = async (leadData: UpdateLeadRequest): Promise<boolean> => {
    // אמור לבדוק אם הליד מלא
    return true; // להחזיר true או false בהתאם למצב הליד
  };

  getOpenReminders = async (): Promise<LeadModel[]> => {
    // אמור לשלוף לידים עם תזכורות פתוחות
    // להחזיר מערך של לידים עם תזכורות פתוחות
    return [];
  };

  //סינונים
  // export const getLeadByEmail = async (
  //   email: string
  // ): Promise<LeadModel | null> => {
  //   // אמור לשלוף ליד לפי כתובת דוא"ל
  //   const { data, error } = await supabase
  //     .from("leads")
  //     .select("*")
  //     .eq("email", email)
  //     .single();

  //   if (error) {
  //     console.error("Error fetching lead");
  //     throw new Error("Faild to fetch lead by email");
  //   }

  //   if (!data) {
  //     console.warn(`No lead has email: ${email}`);
  //     return null;
  //   }
  //   // להחזיר את הליד שנמצא או null אם לא נמצא
  //   return data as LeadModel;
  // };

  // export const getLeadByPhone = async (
  //   phone: string
  // ): Promise<LeadModel | null> => {
  //   // אמור לשלוף ליד לפי מספר טלפון
  //   const { data, error } = await supabase
  //     .from("leads")
  //     .select("*")
  //     .eq("phone", phone)
  //     .single();

  //   if (error) {
  //     console.error("Error fetching lead");
  //     throw new Error("Faild to fetch lead by phone");
  //   }
  //   if (!data) {
  //     console.warn(`No lead has phone number: ${phone}`);
  //     return null;
  //   }
  //   // להחזיר את הליד שנמצא או null אם לא נמצא
  //   return data as LeadModel;
  // };

  // export const getLeadByName = async (
  //   name: string
  // ): Promise<LeadModel | null> => {
  //   // אמור לשלוף ליד לפי שם
  //   const { data, error } = await supabase
  //     .from("leads")
  //     .select("*")
  //     .eq("name", name)
  //     .single();
  //   if (error) {
  //     console.error("Error fetching lead");
  //     throw new Error("Faild to fetch leas by name");
  //   }
  //   if (!data) {
  //     console.warn(`No lead has name: ${name}`);
  //     return null;
  //   }
  //   // להחזיר את הליד שנמצא או null אם לא נמצא
  //   return data as LeadModel;
  // };

  // export const getLeadByStatus = async (
  //   status: LeadStatus
  // ): Promise<LeadModel[] | null> => {
  //   // אמור לשלוף לידים לפי סטטוס
  //   const { data, error } = await supabase
  //     .from("leads")
  //     .select("*")
  //     .eq("status", status);

  //   if (error) {
  //     console.error("Error fetching leads by status");
  //     throw new Error("Failed to fetch leads by status");
  //   }
  //   if (!data || data.length == 0) {
  //     console.warn(`No leads found in status: ${status}`);
  //     return null; //אם אין לידים בסטטוס המבוקש
  //   }
  //   // להחזיר מערך של לידים עם הסטטוס המבוקש
  //   return data as LeadModel[];
  // };
  // export const getLeadBySource = async (
  //   source: string
  // ): Promise<LeadModel[] | null> => {
  //   // אמור לשלוף לידים לפי מקור
  //   const { data, error } = await supabase
  //     .from("leads")
  //     .select("*")
  //     .eq("source", source);
  //   if (error) {
  //     console.error("Error fetching leads by source:", error.message);
  //     throw new Error("Failed to fetch leads by source");
  //   }
  //   if (!data || data.length === 0) {
  //     console.warn(`No leads found with source: ${source}`);
  //     return null;
  //   }
  //   // להחזיר מערך של לידים עם המקור המבוקש
  //   return data as LeadModel[];
  // };

  checkIfLeadBecomesCustomer = async (leadId: ID): Promise<boolean> => {
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
}
