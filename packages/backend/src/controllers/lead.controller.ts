import { Request, Response } from 'express';
import * as leadService from '../services/lead.service';



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
