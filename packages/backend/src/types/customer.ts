// customer-types.d.ts

import { ID, DateISO, FileReference, ApiResponse, PaginatedResponse, DateRangeFilter } from './core';

// Workspace type enum
export enum WorkspaceType {
  PRIVATE_ROOM = 'PRIVATE_ROOM',
  DESK_IN_ROOM = 'DESK_IN_ROOM',
  OPEN_SPACE = 'OPEN_SPACE',
  KLIKAH_CARD = 'KLIKAH_CARD'
}
export enum TimelineEventType {
  Lead = 'lead',
  Interaction = 'interaction',
  Contract = 'contract',
  Payment = 'payment',
  ExitNotice = 'exitNotice',
  StatusChange = 'statusChange'
}

// Customer status enum
export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  NOTICE_GIVEN = 'NOTICE_GIVEN',
  EXITED = 'EXITED',
  PENDING = 'PENDING'
}

// Exit reason enum
export enum ExitReason {
  RELOCATION = 'RELOCATION',
  BUSINESS_CLOSED = 'BUSINESS_CLOSED',
  PRICE = 'PRICE',
  WORK_FROM_HOME = 'WORK_FROM_HOME',
  SPACE_NEEDS = 'SPACE_NEEDS',
  DISSATISFACTION = 'DISSATISFACTION',
  OTHER = 'OTHER'
}

// Customer entry-exit period
export interface CustomerPeriod {
  id: ID;
  customerId: ID;
  entryDate: DateISO;
  exitDate?: DateISO;
  exitNoticeDate?: DateISO;
  exitReason?: ExitReason;
  exitReasonDetails?: string;
  createdAt: DateISO;
  updatedAt: DateISO;
}

// Payment method
export interface PaymentMethod {
  id: ID;
  customerId: ID;
  creditCardLast4?: string;
  creditCardExpiry?: string;
  creditCardHolderIdNumber?: string;
  creditCardHolderPhone?: string;
  isActive: boolean;
  createdAt: DateISO;
  updatedAt: DateISO;
}

export interface TimelineEvent {
  id: ID;
  type: TimelineEventType;
  date: string; // ISO date string
  title: string; // כותרת קצרה לאירוע
  description?: string; // תיאור מפורט יותר (אופציונלי)
  relatedId?: string; // קישור לאובייקט (למשל leadId, contractId)
}

export interface CustomerTimeline {
  customerId: ID;
  events: TimelineEvent[];
}

// Customer model
export interface Customer {
  id: ID;
  name: string;
  phone: string;
  email: string;
  idNumber: string;
  businessName: string;
  businessType: string;
  status: CustomerStatus[];
  currentWorkspaceType?: WorkspaceType[];
  workspaceCount: number;
  contractSignDate?: DateISO;
  contractStartDate?: DateISO;
  billingStartDate?: DateISO;
  notes?: string;
  invoiceName?: string;
  contractDocuments?: FileReference[];
  paymentMethods: PaymentMethod[];
  periods: CustomerPeriod[];
  createdAt: DateISO;
  updatedAt: DateISO;
}

// Create customer request
export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email: string;
  idNumber: string;
  businessName: string;
  businessType: string;
  workspaceType: WorkspaceType;
  workspaceCount: number;
  contractSignDate: DateISO;
  contractStartDate: DateISO;
  billingStartDate: DateISO;
  notes?: string;
  invoiceName?: string;
  paymentMethod?: {
    creditCardLast4?: string;
    creditCardExpiry?: string;
    creditCardHolderIdNumber?: string;
    creditCardHolderPhone?: string;
  };
  contractDocuments?: FileReference[];
}

// Update customer request
export interface UpdateCustomerRequest {
  name?: string;
  phone?: string;
  email?: string;
  idNumber?: string;
  businessName?: string;
  businessType?: string;
  notes?: string;
  invoiceName?: string;
}

// Get customers request
export interface GetCustomersRequest {
  status?: CustomerStatus[];
  workspaceType?: WorkspaceType[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Record exit notice request
export interface RecordExitNoticeRequest {
  exitNoticeDate: DateISO;
  plannedExitDate: DateISO;
  exitReason: ExitReason;
  exitReasonDetails?: string;
}

// Complete customer exit request
export interface CompleteCustomerExitRequest {
  actualExitDate: DateISO;
  exitReason: ExitReason;
  exitReasonDetails?: string;
  finalNotes?: string;
}

// Add contract document request
export interface AddContractDocumentRequest {
  document: FileReference;
  description?: string;
}

// Customer desk change request
export interface CustomerDeskChangeRequest {
  newWorkspaceType: WorkspaceType;
  newWorkspaceCount: number;
  effectiveDate: DateISO;
  notes?: string;
}

// Extend customer contract request
export interface ExtendCustomerContractRequest {
  newEndDate: DateISO;
  notes?: string;
}

// Convert lead to customer request
export interface ConvertLeadToCustomerRequest {
  leadId: ID;
  workspaceType: WorkspaceType;
  workspaceCount: number;
  contractSignDate: DateISO;
  contractStartDate: DateISO;
  billingStartDate: DateISO;
  notes?: string;
  paymentMethod?: {
    creditCardLast4?: string;
    creditCardExpiry?: string;
    creditCardHolderIdNumber?: string;
    creditCardHolderPhone?: string;
  };
  contractDocuments?: FileReference[];
}
