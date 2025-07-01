import { Request, Response } from "express";
import { LeadModel } from "../models/lead.model";
import { leadService } from "../services/lead.service";

const serviceLead = new leadService();

export const getAllLeads = async (req: Request, res: Response) => {
  try {
    console.log("enter");

    const leads = await serviceLead.getAllLeads();
    console.log(leads);
    console.log("controller get");

    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Error fetching leads", error });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  const { id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה
  try {
    // מזמן את ה-service כדי לקבל את הליד לפי מזהה
    const lead = await serviceLead.getById(id);
    if (lead) {
      res.status(200).json(lead);
    } else {
      res.status(404).json({ message: "Lead not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching lead", error });
  }
};

export const createLead = async (req: Request, res: Response) => {
  console.log("controller");
  console.log("body", req.body);

  try {
    const leadData: LeadModel = req.body;
    console.log(leadData);

    const newLead = await serviceLead.post(leadData);

    res.status(201).json(newLead);
  } catch (error: any) {
    console.error("Error creating lead:", error);
    res.status(500).json({
      message: "Error creating lead",
      error: error.message || error,
    });
  }
};

// קבלת המקור לפי id
export const getSourcesLeadById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const sources = await serviceLead.getSourcesLeadById(id);
    res.status(200).json(sources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sources", error });
  }
};

// עדכון ליד
export const patchLead = async (req: Request, res: Response) => {
  const leadData = req.body; // הנח שהנתונים מגיעים בגוף הבקשה

  const { id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה
  try {
    const updatedLead = await serviceLead.patch(leadData, id);
    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Error updating lead", error });
  }
};

export const postLeadFromCSV = async (req: Request, res: Response) => {
  const csvData: string = req.body.csvData; // הנח שהנתונים מגיעים בגוף הבקשה
  try {
    await serviceLead.convertCsvToLeads(csvData);
    res.status(200).json({ message: "Leads added from CSV" });
  } catch (error) {
    res.status(500).json({ message: "Error adding leads from CSV", error });
  }
};

// המזכירה מקבלת את כל הלידים שלא בוצעה אינטרקציה יותר משבועיים
export const getLeadsToRemind = async (req: Request, res: Response) => {
  try {
    const leadsToRemind = await serviceLead.getOpenReminders();
    res.status(200).json(leadsToRemind);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads to remind", error });
  }
};

export const getLeadsByFilter = async (req: Request, res: Response) => {
  const filters = req.query;
  try {
    const customers = await serviceLead.getByFilters(filters);

    if (customers.length > 0) {
      res.status(200).json(customers);
    } else {
      res.status(404).json({ message: "No customers found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error filtering customers", error });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const leads = await serviceLead.delete(id);
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all statuses', error });
    }
}
