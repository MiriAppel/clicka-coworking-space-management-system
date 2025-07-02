import { baseService } from "./baseService";
import { LeadModel } from "../models/lead.model";
import Papa, { parse } from 'papaparse';
import { ID, LeadSource, UpdateLeadRequest } from "shared-types";
import { supabase } from '../db/supabaseClient'

export class leadService extends baseService <LeadModel> {


  constructor() {
    super("leads")

  }

    getAllLeads = async (): Promise<LeadModel[] | null> => {
        const leads = await this.getAll();
        return LeadModel.fromDatabaseFormatArray(leads) // המרה לסוג UserModel
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
    return new Promise((resolve, reject) => {
      Papa.parse<LeadModel>(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (err: any) => {
          reject(err);
        }
      });
    });
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

  addInteraction = async (leadId: string, data: { type: string; date: string; notes: string }) => {
  const { error } = await supabase
    .from("interactions")
    .insert([
      {
        lead_id: leadId,
        type: data.type,
        date: data.date,
        notes: data.notes,
      },
    ]);

  if (error) throw new Error("בעיה בהוספת אינטראקציה: " + error.message);
};
};
