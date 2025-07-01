
import type{ ID, Lead, LeadInteraction, LeadSource, LeadStatus, WorkspaceType } from "shared-types";

export class LeadModel implements Lead {
  
  id?: ID; // PK
  idNumber: ID; // FK
  name: string;
  phone: string;
  email: string;
  businessType: string;
  interestedIn: WorkspaceType[];
  source: LeadSource;
  status: LeadStatus;
  interactions: LeadInteraction[]; // כל אינטראקציה שייכת לליד אחד, אבל ליד יכול להכיל הרבה אינטראקציות (שיחות, תזכורות, ביקורים וכו׳).
  createdAt: string;
  updatedAt: string;
  contactDate?: string | undefined;
  followUpDate?: string | undefined;
  notes?: string | undefined;

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
      id_number: this.idNumber,
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
      lead_interaction: this.interactions,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    }
  }
  static fromDatabaseFormat(dbData: any): LeadModel {
    return new LeadModel(
      dbData.id,
      dbData.id_number,
      dbData.name,
      dbData.phone,
      dbData.email,
      dbData.business_type,
      dbData.interested_in,
      dbData.source,
      dbData.status,
      dbData.contact_date,
      dbData.follow_up_date,
      dbData.notes,
      dbData.lead_interaction,
      dbData.created_at,
      dbData.updated_at
    );
  }

  static fromDatabaseFormatArray(dbDataArray: any[]): LeadModel[] {
    return dbDataArray.map(dbData => LeadModel.fromDatabaseFormat(dbData));
  }

}
