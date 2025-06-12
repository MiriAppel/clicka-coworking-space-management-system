

<<<<<<< HEAD
export class LeadInteraction implements LeadInteraction {
    id: string;
    leadId: string;
    type: LeadInteractionType;
    date: Date;
    notes: string;
    userId: string;
    userEmail: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        leadId: string,
        type: LeadInteractionType,
        date: Date,
        notes: string,
        userId: string,
        userEmail: string,
        createdAt: Date,
        updatedAt: Date
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

export class CreateLeadRequest implements LeadCreateRequest {
    name: string;
    phone: string;
    email: string;
    businessType: string;
    interestedIn: Lead.WorkspaceType[];
    source: Lead.Source;
    notes?: string;
    followUpDate?: Date;

    constructor(
        name: string,
        phone: string,
        email: string,
        businessType: string,
        interestedIn: Lead.WorkspaceType[],
        source: Lead.Source,
        notes?: string,
        followUpDate?: Date
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

export class UpdateLeadRequest implements Lead.UpdateRequest {
    name?: string;
    phone?: string;
    email?: string;
    businessType?: string;
    interestedIn?: Lead.WorkspaceType[];
    source?: Lead.Source;
    status?: Lead.Status;
    followUpDate?: Date;
    notes?: string;

    constructor(
        name?: string,
        phone?: string,
        email?: string,
        businessType?: string,
        interestedIn?: Lead.WorkspaceType[],
        source?: Lead.Source,
        status?: Lead.Status,
        followUpDate?: Date,
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

export class GetLeadsRequest implements Lead.GetRequest {
    status?: Lead.Status[];
    source?: Lead.Source[];
    interestedIn?: Lead.WorkspaceType[];
    page?: number;
    limit?: number;

    constructor(
        status?: Lead.Status[],
        source?: Lead.Source[],
        interestedIn?: Lead.WorkspaceType[],
        page: number = 1,
        limit: number = 10
    ) {
        this.status = status;
        this.source = source;
        this.interestedIn = interestedIn;
        this.page = page;
        this.limit = limit;
    }
}

export class AddLeadInteractionRequest implements Lead.AddInteractionRequest {
    leadId: string;
    type: Lead.InteractionType;
    date: Date;
    notes: string;
    userId: string;
    userEmail: string;

    constructor(
        leadId: string,
        type: Lead.InteractionType,
        date: Date,
        notes: string,
        userId: string,
        userEmail: string
    ) {
        this.leadId = leadId;
        this.type = type;
        this.date = date;
        this.notes = notes;
        this.userId = userId;
        this.userEmail = userEmail;
    }
}

    

