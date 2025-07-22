export var TimelineEventType;
(function (TimelineEventType) {
    TimelineEventType["LEAD_CREATED"] = "LEAD_CREATED";
    TimelineEventType["INTERACTION"] = "INTERACTION";
    TimelineEventType["CONVERSION"] = "CONVERSION";
    TimelineEventType["CONTRACT_SIGNED"] = "CONTRACT_SIGNED";
    TimelineEventType["WORKSPACE_ASSIGNED"] = "WORKSPACE_ASSIGNED";
    TimelineEventType["PAYMENT_RECEIVED"] = "PAYMENT_RECEIVED";
    TimelineEventType["STATUS_CHANGE"] = "STATUS_CHANGE";
    TimelineEventType["NOTE_ADDED"] = "NOTE_ADDED";
})(TimelineEventType || (TimelineEventType = {}));
export var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "DRAFT";
    ContractStatus["PENDING_SIGNATURE"] = "PENDING_SIGNATURE";
    ContractStatus["SIGNED"] = "SIGNED";
    ContractStatus["ACTIVE"] = "ACTIVE";
    ContractStatus["EXPIRED"] = "EXPIRED";
    ContractStatus["TERMINATED"] = "TERMINATED";
})(ContractStatus || (ContractStatus = {}));
// Workspace type enum
export var WorkspaceType;
(function (WorkspaceType) {
    WorkspaceType["PRIVATE_ROOM"] = "PRIVATE_ROOM";
    WorkspaceType["DESK_IN_ROOM"] = "DESK_IN_ROOM";
    WorkspaceType["OPEN_SPACE"] = "OPEN_SPACE";
    WorkspaceType["KLIKAH_CARD"] = "KLIKAH_CARD";
    WorkspaceType["DOOR_PASS"] = "DOOR_PASS";
    WorkspaceType["WALL"] = "WALL";
    WorkspaceType["COMPUTER_STAND"] = "COMPUTER_STAND";
    WorkspaceType["RECEPTION_DESK"] = "RECEPTION_DESK";
})(WorkspaceType || (WorkspaceType = {}));
// Customer status enum
export var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["ACTIVE"] = "ACTIVE";
    CustomerStatus["NOTICE_GIVEN"] = "NOTICE_GIVEN";
    CustomerStatus["EXITED"] = "EXITED";
    CustomerStatus["PENDING"] = "PENDING";
    CustomerStatus["CREATED"] = "CREATED";
})(CustomerStatus || (CustomerStatus = {}));
// Exit reason enum
export var ExitReason;
(function (ExitReason) {
    ExitReason["RELOCATION"] = "RELOCATION";
    ExitReason["BUSINESS_CLOSED"] = "BUSINESS_CLOSED";
    ExitReason["PRICE"] = "PRICE";
    ExitReason["WORK_FROM_HOME"] = "WORK_FROM_HOME";
    ExitReason["SPACE_NEEDS"] = "SPACE_NEEDS";
    ExitReason["DISSATISFACTION"] = "DISSATISFACTION";
    ExitReason["OTHER"] = "OTHER";
})(ExitReason || (ExitReason = {}));
// export interface SavedSearch {
//     id: ID;
//     name: string;
//     userId: ID;
//     searchRequest: CustomerSearchRequest;
//     isPublic: boolean; // Whether the saved search is public or private
//     createdAt: DateISO;
//     updatedAt: DateISO;
// }
// export interface CustomerSearchRequest {
//     query?: string; // Full-text search query
//     filters?: CustomerFilter[]; // Array of filters
//     sortBy?: string; // Field to sort by
//     sortDirection?: 'asc' | 'desc'; // Sort direction
//     page?: number; // Current page number for pagination
//     limit?: number; // Number of items per page
// }
// export interface CustomerFilter {
//     field: keyof Customer; // Keyof Customer interface to ensure valid field names
//     operator: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';
//     value?: any; // Value for single-value operators
//     values?: any[]; // Values for 'in' operator
// }
// export interface CustomerTimeline {
//     customerId: ID;
//     totalEvents: number; // For pagination, total count of events
//     dateRange?: DateRangeFilter; // Applied date range filter
// }
// export interface DateRangeFilter {
//     startDate?: DateISO;
//     endDate?: DateISO;
// }
