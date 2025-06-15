import { Customer, CustomerFilter, CustomerSearchRequest, SavedSearch } from "../types/customer";

export class SavedSearchModel implements SavedSearch {
  id: string;
  name: string;
  userId: string;
  searchRequest: CustomerSearchRequest;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(data: {
    id: string;
    name: string;
    userId: string;
    searchRequest: CustomerSearchRequest;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.userId = data.userId;
    this.searchRequest = data.searchRequest;
    this.isPublic = data.isPublic;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

   toDatabaseFormat() {
    return {
      id: this.id,
      name: this.name,
      userId: this.userId,
      searchRequest: this.searchRequest,
      isPublic: this.isPublic,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export class CustomerSearchRequestModel implements CustomerSearchRequest {
  query?: string;
  filters?: CustomerFilter[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;

  constructor(data: {
    query?: string;
    filters?: CustomerFilter[];
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    this.query = data.query;
    this.filters = data.filters;
    this.sortBy = data.sortBy;
    this.sortDirection = data.sortDirection;
    this.page = data.page;
    this.limit = data.limit;
  }

  toDatabaseFormat() {
    return {
      query: this.query,
      filters: this. filters ? this.filters.map( fil => ({
         field: fil.field,
         operator: fil.operator,
         value: fil.value,
         values: fil.values
      })): [],
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      page: this.page,
      limit: this.limit,
    };
  }
}

export class CustomerFilterModel implements CustomerFilter {
    field: keyof Customer; // Keyof Customer interface to ensure valid field names
    operator: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';
    value?: any; // Value for single-value operators
    values?: any[]; 

   constructor(data: {
    field: keyof Customer;
    operator: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';
    value?: any;
    values?: any[];
  }) {
    this.field = data.field;
    this.operator = data.operator;
    this.value = data.value;
    this.values = data.values;
  }

  toDatabaseFormat() {
    return {
      field: this.field,
      operator: this.operator,
      value: this.value,
      values: this.values,
    };
  }
}
