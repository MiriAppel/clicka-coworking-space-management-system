export const deleteInteraction = async (req: Request, res: Response) => {
    const {leadId, id } = req.params; // הנח שהמזהה נמצא בפרמטרים של הבקשה
    try {
        await leadService.deleteInteraction(leadId ,id);
        res.status(200).json({ message: 'Interaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting interaction', error });
    }
}


export const getAllInteractionsByFilter = async (req: Request, res: Response) => { 
    try {
        const interactions = await leadService.getAllInteractions();
        res.status(200).json(interactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching interactions', error });
    }
};

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