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
export const getSourcesLeadById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const sources = await leadService.GetSourcesLeadById(id);
        res.status(200).json(sources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sources', error });
    }
}
export const fullUpdateLead = async (req: Request, res: Response) => {
    const leadData: UpdateLeadRequestModel = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    const { id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה 
    try {
        const updatedLead = await leadService.updatedLead(id, leadData);
        res.status(200).json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lead', error });
    }
}
export const addLeadFromCSV = async (req: Request, res: Response) => {
    const csvData: string = req.body.csvData; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        await leadService.addLeadFromCSV(csvData);
        res.status(200).json({ message: 'Leads added from CSV' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding leads from CSV', error });
    }
}
export const addInteractionToLead = async (req: Request, res: Response) => {
    const { leadId, interactionData } = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        await leadService.addInteractionToLead(leadId, interactionData);
        res.status(200).json({ message: 'Interaction added to lead' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding interaction', error });
    }
}
export const updateInteractions = async (req: Request, res: Response) => {
    const data: LeadInteractionModel = req.body.csvData; // הנח שהנתונים מגיעים בגוף הבקשה
    const { id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה
    try {
        await leadService.UpdateInteractione(data , id);
        res.status(200).json({ message: 'Interactions updated from CSV' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating interactions', error });
    }
}
export const getLeadToRemind = async (req: Request, res: Response) => {
    try {
        const leadsToRemind = await leadService.GetLeadToRemined();
        res.status(200).json(leadsToRemind);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads to remind', error });
    }
}

export const getLeadByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const lead = await leadService.getLeadByEmail(email);
        if (lead) {
            res.status(200).json(lead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead by email', error });
    }
};
export const getLeadByPhone = async (req: Request, res: Response) => {
    const { phone } = req.params;
    try {
        const lead = await leadService.getLeadByPhone(phone);
        if (lead) {
            res.status(200).json(lead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead by phone', error });
    }
};
export const getLeadByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    try {
        const lead = await leadService.getLeadByName(name);
        if (lead) {
            res.status(200).json(lead);
        } else {
            res.status(404).json({ message: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lead by name', error });
    }
};
export const getLeadByStatus = async (req: Request, res: Response) => {
    const { status }: any = req.params; // הנח שהסטטוס נמצא בפרמטרים של הבקשה
    try {
        const leads = await leadService.getLeadByStatus(status);
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads by status', error });
    }
};
export const getLeadBySource = async (req: Request, res: Response) => {
    const { source } = req.params;
    try {
        const leads = await leadService.getLeadBySource(source);
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads by source', error });
    }
};
export const checkIfLeadBecomesCustomer = async (req: Request, res: Response) => {
    const { leadId } = req.params;
    try {
        const isCustomer = await leadService.checkIfLeadBecomesCustomer(leadId);
        res.status(200).json({ isCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error checking if lead becomes customer', error });
    }
};

export const getAllInteractions = async (req: Request, res: Response) => { 
    try {
        const interactions = await leadService.getAllInteractions();
        res.status(200).json(interactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching interactions', error });
    }
};
 
export const convertCsvToLeads = async (req: Request, res: Response) => {
    const csvData: string = req.body.csvData; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        await leadService.convertCsvToLeads(csvData);
        res.status(200).json({ message: 'Leads converted from CSV' });
    } catch (error) {
        res.status(500).json({ message: 'Error converting CSV to leads', error });
    }
}

export const checkIfFullLead = async (req: Request, res: Response) => {
    const leadData: UpdateLeadRequestModel = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        const isFull = await leadService.checkIfFullLead(leadData);
        res.status(200).json({ isFull });
    } catch (error) {
        res.status(500).json({ message: 'Error checking if lead is full', error });
    }
}

export const checkIfFullInteraction = async (req: Request, res: Response) => {
    const interactionData: LeadInteractionModel = req.body; // הנח שהנתונים מגיעים בגוף הבקשה
    try {
        const isFull = await leadService.checkIfFullInteraction(interactionData);
        res.status(200).json({ isFull });
    } catch (error) {
        res.status(500).json({ message: 'Error checking if interaction is full', error });
    }
}

export const deleteInteraction = async (req: Request, res: Response) => {
    const {leadId, id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה
    try {
        await leadService.deleteInteraction(leadId ,id);
        res.status(200).json({ message: 'Interaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting interaction', error });
    }
}

export const getOpenReminders = async (req: Request, res: Response) => {
    try {
        const openReminders = await leadService.getOpenReminders();
        res.status(200).json(openReminders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching open reminders', error });
    }
}

