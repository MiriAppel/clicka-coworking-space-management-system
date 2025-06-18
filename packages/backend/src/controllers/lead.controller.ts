import { Request, Response } from 'express'
import * as leadService from "../services/lead.service"
import { LeadModel} from '../models/lead.model';
import {UpdateLeadRequestModel }from '../models/LeadRequests'
import { LeadInteraction, LeadStatus } from '../types/lead';
import { LeadInteractionModel } from '../models/LeadInteraction';


export const getAllLeads = async (res: Response) => {
    try{
        // מזמן את ה service כדי לקבל את כל הלידים
        const leads = await leadService.getAllLeads();
        res.status(200).json(leads);
    }
    catch (error) {
       res.status(500).json({ message: 'Error fetching leads', error });
    }
}


export const getLeadById = async (req: Request, res: Response) => {
    const { id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה
    try {
        // מזמן את ה-service כדי לקבל את הליד לפי מזהה
        const lead = await leadService.getLeadById(id);
        if (lead) {
            res.status(200).json(lead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead', error });
    }
}

export const createLead = async (req: Request, res: Response) => {
    const leadData: LeadModel = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        const newLead = await leadService.createLead(leadData);
        res.status(201).json(newLead);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lead', error });
    }
}

// קבלת המקור לפי id
export const getSourcesLeadById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const sources = await leadService.GetSourcesLeadById(id);
        res.status(200).json(sources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sources', error });
    }
}

// עדכון ליד
export const patchLead = async (req: Request, res: Response) => {
    const leadData: UpdateLeadRequestModel = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    const { id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה 
    try {
        const updatedLead = await leadService.updatedLead(id, leadData);
        res.status(200).json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead', error });
    }
}


export const postLeadFromCSV = async (req: Request, res: Response) => {
    const csvData: string = req.body.csvData; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        await leadService.addLeadFromCSV(csvData);
        res.status(200).json({ message: 'Leads added from CSV' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding leads from CSV', error });
    }
}

// הוספת אינטרקציה לליד קיים
export const postInteractionToLead = async (req: Request, res: Response) => {
    const { leadId, interactionData } = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        await leadService.addInteractionToLead(leadId, interactionData);
        res.status(200).json({ message: 'Interaction added to lead' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding interaction', error });
    }
}

// עדכון אינטרקציה
export const patchInteractions = async (req: Request, res: Response) => {
    const data: LeadInteractionModel = req.body.csvData; // הנח שהנתונים מגיעים בגוף הבקשה
    const { id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה
    try {
        await leadService.UpdateInteractione(data , id);
        res.status(200).json({ message: 'Interactions updated from CSV' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating interactions', error });
    }
}

// המזכירה מקבלת את כל הלידים שלא בוצעה אינטרקציה יותר משבועיים
export const getLeadsToRemind = async (req: Request, res: Response) => {
    try {
        const leadsToRemind = await leadService.GetLeadToRemind();
        res.status(200).json(leadsToRemind);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads to remind', error });
    }
}


export const getLeadsByFilter = async (req: Request, res: Response) => {

    const filters = req.query;

    try {
        const customers = await leadService.filterLeads(filters);

        if (customers.length > 0) {
            res.status(200).json(customers);
        } else {
            res.status(404).json({ message: 'No customers found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error filtering customers', error });
    }
}


 
export const postCsvToLeads = async (req: Request, res: Response) => {
    const csvData: string = req.body.csvData; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        await leadService.convertCsvToLeads(csvData);
        res.status(200).json({ message: 'Leads converted from CSV' });
    } catch (error) {
        res.status(500).json({ message: 'Error converting CSV to leads', error });
    }
}

 //מחזירה את כל הלידים שיש להם תזכורות פתוחות
// export const getLeadsOpenReminders = async (req: Request, res: Response) => {
//     try {
//         const openReminders = await leadService.getOpenReminders();
//         res.status(200).json(openReminders);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching open reminders', error });
//     }
// }

