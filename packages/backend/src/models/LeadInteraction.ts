import { ID, DateISO } from '../../../../types/core';
import { LeadInteraction } from '../../../../types/lead';

export class LeadInteractionModel implements LeadInteraction {

  id: ID; // PK
  leadId: ID; // FK
  type: InteractionType;
  date: DateISO;
  notes: string;
  userId: ID; 
  userEmail: string;
  createdAt: DateISO;
  updatedAt: DateISO;

  constructor(
    id: ID,
    leadId: ID,
    type: InteractionType,
    date: DateISO,
    notes: string,
    userId: ID,
    userEmail: string,
    createdAt: DateISO,
    updatedAt: DateISO
  ) {
    this.id = id;
    this.leadId = leadId;
    this.type = type;
    this.date = date;
    this.notes = notes;
    this.userId = userId;
    this.userEmail = userEmail;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat(): any {
    return {
      id: this.id,
      lead_id: this.leadId,
      type: this.type,
      date: this.date,
      notes: this.notes,
      user_id: this.userId,
      user_email: this.userEmail,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  
  }

}

export enum InteractionType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  MEETING = 'MEETING',
  TOUR = 'TOUR',
  NOTE = 'NOTE',
  DOCUMENT = 'DOCUMENT'
}


