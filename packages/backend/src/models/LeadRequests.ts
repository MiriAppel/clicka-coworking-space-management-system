import { DateISO } from '../types/core';
import { WorkspaceType } from '../types/customer';
import { AddLeadInteractionRequest, CreateLeadRequest, GetLeadsRequest, LeadSource, LeadStatus, UpdateLeadRequest } from '../types/lead';
import { InteractionType } from './LeadInteraction';

export class CreateLeadRequestModel implements CreateLeadRequest {
  name: string;
  phone: string;
  email: string;
  businessType: string;
  interestedIn: WorkspaceType[];
  source: LeadSource;
  notes?: string;
  followUpDate?: DateISO;

  constructor(
    name: string,
    phone: string,
    email: string,
    businessType: string,
    interestedIn: WorkspaceType[],
    source: LeadSource,
    notes?: string,
    followUpDate?: DateISO
  ) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.businessType = businessType;
    this.interestedIn = interestedIn;
    this.source = source;
    this.notes = notes;
    this.followUpDate = followUpDate;
  }

  toDatabaseFormat() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      business_type: this.businessType,
      interested_in: this.interestedIn,
      source: this.source,
      notes: this.notes,
      follow_up_date: this.followUpDate
    };

  }
}

export class UpdateLeadRequestModel implements UpdateLeadRequest {
  name?: string;
  phone?: string;
  email?: string;
  businessType?: string;
  interestedIn?: WorkspaceType[];
  source?: LeadSource;
  status?: LeadStatus;
  followUpDate?: DateISO;
  notes?: string;

  constructor(
    name?: string,
    phone?: string,
    email?: string,
    businessType?: string,
    interestedIn?: WorkspaceType[],
    source?: LeadSource,
    status?: LeadStatus,
    followUpDate?: DateISO,
    notes?: string
  ) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.businessType = businessType;
    this.interestedIn = interestedIn;
    this.source = source;
    this.status = status;
    this.followUpDate = followUpDate;
    this.notes = notes;
  }
  
toDatabaseFormat() {
  return {
    name: this.name,
    phone: this.phone,
    email: this.email,
    business_type: this.businessType,
    interested_in: this.interestedIn,
    source: this.source,
    status: this.status,
    follow_up_date: this.followUpDate,
    notes: this.notes,
  };
}

  
}

export class GetLeadsRequestModel implements  GetLeadsRequest{
  status?: LeadStatus[];
  source?: LeadSource[];
  interestedIn?: WorkspaceType[];
  followUpDateFrom?: DateISO;
  followUpDateTo?: DateISO;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';

  constructor(
    status?: LeadStatus[],
    source?: LeadSource[],
    interestedIn?: WorkspaceType[],
    followUpDateFrom?: DateISO,
    followUpDateTo?: DateISO,
    search?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  ) {
    this.status = status;
    this.source = source;
    this.interestedIn = interestedIn;
    this.followUpDateFrom = followUpDateFrom;
    this.followUpDateTo = followUpDateTo;
    this.search = search;
    this.page = page;
    this.limit = limit;
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }

  toDatabaseFormat() {
    return {
      status: this.status,
      source: this.source,
      interested_in: this.interestedIn,
      follow_up_date_from: this.followUpDateFrom,
      follow_up_date_to: this.followUpDateTo,
      search: this.search,
      page: this.page,
      limit: this.limit,
      sort_by: this.sortBy,
      sort_direction: this.sortDirection,
    };
  }
}

export class AddLeadInteractionRequestModel implements AddLeadInteractionRequest {
  type: InteractionType;
  date: DateISO;
  notes: string;

  constructor(
    type:InteractionType,
    date: DateISO,
    notes: string
  ){
    this.type = type;
    this.date = date;
    this.notes = notes
  }
}
