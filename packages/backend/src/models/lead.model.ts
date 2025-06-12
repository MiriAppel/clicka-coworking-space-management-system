import { DateISO, ID } from "../types/core";
import { WorkspaceType } from "../types/customer";
import { AddLeadInteractionRequest, CreateLeadRequest, GetLeadsRequest, InteractionType, Lead, LeadInteraction, LeadSource, LeadStatus, UpdateLeadRequest } from "../types/lead";

export class LeadModel implements Lead {

    id: ID;
    name: string;
    phone: string;
    email: string;
    businessType: string;
    interestedIn: WorkspaceType[];
    source: LeadSource;
    status: LeadStatus;
    contactDate?: DateISO;
    followUpDate?: DateISO;
    notes?: string;
    interactions: LeadInteraction[];
    createdAt: DateISO;
    updatedAt: DateISO;

    constructor(
        id: ID,
        name: string,
        phone: string,
        email: string,
        businessType: string,
        interestedIn: WorkspaceType[],
        source: LeadSource,
        status: LeadStatus,
        contactDate?: DateISO,
        followUpDate?: DateISO,
        notes?: string,
        interactions: LeadInteraction[] = [],
        createdAt: DateISO = new Date().toISOString(),
        updatedAt: DateISO = new Date().toISOString()
    ) {
        this.id = id;
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
}

export class LeadInteractionModel implements LeadInteraction {

    id: ID;
    leadId: ID;
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
        createdAt: DateISO = new Date().toISOString(),
        updatedAt: DateISO = new Date().toISOString()
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
}

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

}

export class GetLeadsRequestModel implements GetLeadsRequest {

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
}

export class AddLeadInteractionRequestModel implements AddLeadInteractionRequest {
    type: InteractionType;
    date: DateISO;
    notes: string;

    constructor(
        type: InteractionType,
        date: DateISO,
        notes: string
    ) {
        this.type = type;
        this.date = date;
        this.notes = notes;
    }
}

    

