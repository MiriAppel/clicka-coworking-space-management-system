import { ID, DateISO } from '../types/core';
import { WorkspaceType } from '../types/customer';
import { Lead, LeadInteraction } from '../types/lead';

export class LeadModel implements Lead {
  
  id?: ID;
  idNumber: ID;
  name: string;
  phone: string;
  email: string;
  businessType: string;
  interestedIn: WorkspaceType[];
  source: LeadSource;
  status: LeadStatus;
  contactDate?: string | undefined;
  followUpDate?: string | undefined;
  notes?: string | undefined;
  interactions: LeadInteraction[];
  createdAt: string;
  updatedAt: string;

    constructor( 
    id: ID,
    idNumber: ID,
    name: string,
    phone: string,
    email: string,
    businessType: string,
    interestedIn: WorkspaceType[],
    source: LeadSource,
    status: LeadStatus,
    contactDate: string | undefined,
    followUpDate: string | undefined,
    notes: string | undefined,
    interactions: LeadInteraction[],
    createdAt: string,
    updatedAt: string
  ) {
    this.id = id;
    this.idNumber = idNumber;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.businessType = businessType;
    this.interestedIn = interestedIn;
    this.source = source;
    this.status = status;
    this.contactDate = contactDate;
    this.followUpDate = followUpDate;
    this.notes = notes;
    this.interactions = interactions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDatabaseFormat() {
    return {
      id: this.id,
      idNumber: this.idNumber,
      name: this.name,
      phone: this.phone,
      email: this.email,
      business_type: this.businessType,
      interested_in: this.interestedIn,
      source: this.source,
      status: this.status,
      contact_date: this.contactDate,
      follow_up_date: this.followUpDate,
      notes: this.notes,
      interactions: this.interactions ? this.interactions.map(int => ({
          id: int.id,
          leadId: int.leadId,
          type: int.type,
          date: int.date,
          notes: int.notes,
          userId: int.userId,
          userEmail: int.userEmail,
          createdAt: int.createdAt,
          updatedAt: int.updatedAt
      })) : [],
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    }
  }
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  SCHEDULED_TOUR = 'SCHEDULED_TOUR',
  PROPOSAL_SENT = 'PROPOSAL_SENT',
  CONVERTED = 'CONVERTED',
  NOT_INTERESTED = 'NOT_INTERESTED',
  LOST = 'LOST'
}

export enum LeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EVENT = 'EVENT',
  PHONE = 'PHONE',
  WALK_IN = 'WALK_IN',
  EMAIL = 'EMAIL',
  OTHER = 'OTHER'
}

