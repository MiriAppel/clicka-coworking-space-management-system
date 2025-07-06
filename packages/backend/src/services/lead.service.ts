import { baseService } from "./baseService";
import { LeadModel } from "../models/lead.model";
import Papa, { parse } from "papaparse";
import { ID, LeadSource, UpdateLeadRequest } from "shared-types";
import { supabase } from "../db/supabaseClient";

export class leadService extends baseService<LeadModel> {
  constructor() {
    super("leads");
  }

  getAllLeads = async (): Promise<LeadModel[] | null> => {
    const leads = await this.getAll();
    return LeadModel.fromDatabaseFormatArray(leads) // המרה לסוג UserModel
  }

  getSourcesLeadById = async (id: string): Promise<LeadSource[]> => {
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

  addLeadFromCSV = async (csvData: string): Promise<void> => {
    // const parsedData = parse(csvData, { header: true }).data as UpdateLeadRequestModel[];
    const parsedData = parse(csvData, { header: true })
      .data as UpdateLeadRequest[];
    for (const lead of parsedData) {
      const isFullLead = this.checkIfFullLead(lead);

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

  checkIfFullLead(lead: UpdateLeadRequest): boolean {
    return !!(
      lead &&
      lead.name &&
      lead.email &&
      lead.businessType &&
      lead.phone &&
      lead.interestedIn
    );
  }

  convertCsvToLeads = (csvData: string): Promise<LeadModel[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse<LeadModel>(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  };

  getOpenReminders = async (): Promise<LeadModel[]> => {
    // אמור לשלוף לידים עם תזכורות פתוחות
    // להחזיר מערך של לידים עם תזכורות פתוחות
    return [];
  };

  checkIfLeadBecomesCustomer = async (leadId: ID): Promise<boolean> => {
    const lead = await this.getById(leadId);

    if (lead.status === "CONVERTED") return true;
    return false;
  };

  getLeadsByPage = async (filters: {
    page?: number;
    limit?: number;
  }): Promise<LeadModel[]> => {
    console.log("Service getLeadsByPage called with:", filters);

    const { page, limit } = filters;

    const pageNum = Number(filters.page);
    const limitNum = Number(filters.limit);

    if (!Number.isInteger(pageNum) || !Number.isInteger(limitNum)) {
      throw new Error("Invalid filters provided for pagination");
    }

    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("name", { ascending: false })
      .range(from, to);

    // console.log("Supabase data:", data);
    console.log("Supabase error:", error);

    if (error) {
      console.error("❌ Supabase error:", error.message || error);
      return Promise.reject(
        new Error(`Supabase error: ${error.message || JSON.stringify(error)}`)
      );
    }

    const leads =  data || [];
    return LeadModel.fromDatabaseFormatArray(leads)
  };

  addInteraction = async (leadId: string, interaction: { type: string; date: string; notes: string; userEmail: string }) => {
    console.log(leadId, interaction);

    const { data, error } = await supabase
      .from("lead_interaction")
      .insert([
        {
          lead_id: leadId,
          type: interaction.type.toUpperCase(),
          date: interaction.date,
          notes: interaction.notes,
          user_email: interaction.userEmail,
          user_id: leadId
        },
      ]);
    if (data)
      return data;
    if (error) console.log(error);;
  }



  deleteInteraction = async (leadId: string, interactionId: string): Promise<void> => {
    try {
      // שליחה של בקשה למחוק אינטראקציה מתוך המערך
      const { data, error } = await supabase
        .from('lead_interaction')
        .delete()
        .eq('id', interactionId)
        .eq('lead_id', leadId);

      if (error) {
        console.log(error + '--------------------------');

      }
      // console.log(data); // יוכל להדפיס את התוצאה של העדכון
    } catch (error) {
      console.error("Error deleting interaction:", error);
      throw new Error("Failed to delete interaction");
    }
  };

}



