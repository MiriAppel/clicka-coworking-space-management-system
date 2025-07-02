export type ID = string;
export type DateISO = string;
export interface FileReference {
    id: ID;
    name: string;
    path: string;
    mimeType: string;
    size: number;
    url: string;
    googleDriveId?: string;
    createdAt: DateISO;
    updatedAt: DateISO;
}
export interface ApiResponse<T = null> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Array<{
        field?: string;
        message: string;
    }>;
}
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
export interface DateRangeFilter {
    startDate: DateISO;
    endDate: DateISO;
}
export interface SortOptions {
    field: string;
    direction: 'asc' | 'desc';
}
export interface FilterOptions {
    field: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
    value: any;
}
