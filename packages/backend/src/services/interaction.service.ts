import { LeadInteractionModel } from "../models/leadInteraction.model";
import { baseService } from "./baseService";



export class interactionService extends baseService<LeadInteractionModel> {
  constructor() {
    super("LeadInteractionModel");
  }

  checkIfFullInteraction = async (leadData: LeadInteractionModel): Promise<boolean> => {
    // אמור לבדוק אם הליד מלא
    return false;
      ; // להחזיר true או false בהתאם למצב הליד
  };
  
}