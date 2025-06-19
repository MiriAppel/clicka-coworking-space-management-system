// report-types.d.ts

import { ApiResponse, DateRangeFilter } from './core-types';
import { WorkspaceType } from './customer-types';
import { ExpenseCategory } from './expense-types';
import { BillingItemType } from './billing-types';

// Time period enum
export enum TimePeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

// Export format
export enum ExportFormat {
  CSV = 'CSV',
  PDF = 'PDF',
  EXCEL = 'EXCEL'
}

// Occupancy report request
export interface OccupancyReportRequest {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  workspaceTypes?: WorkspaceType[];
  includeKlikahCardMembers?: boolean;
  format?: ExportFormat;
}

// Occupancy report response
export interface OccupancyReportResponse {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  occupancyData: {
    date: string; // ISO date string or YYYY-MM for monthly
    totalSpaces: number;
    occupiedSpaces: number;
    openSpaceCount: number;
    deskInRoomCount: number;
    privateRoomCount: number;
    roomForThreeCount: number;
    klikahCardCount: number;
    occupancyRate: number; // Percentage
  }[];
  summary: {
    averageOccupancyRate: number;
    maxOccupancyRate: number;
    minOccupancyRate: number;
    totalCustomerCount: number;
  };
}

// Revenue report request
export interface RevenueReportRequest {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  groupBy?: 'workspace_type' | 'billing_type';
  format?: ExportFormat;
}

// Revenue report response
export interface RevenueReportResponse {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  revenueData: {
    date: string; // ISO date string or YYYY-MM for monthly
    totalRevenue: number;
    membershipRevenue: number;
    meetingRoomRevenue: number;
    loungeRevenue: number;
    otherRevenue: number;
  }[];
  summary: {
    totalRevenue: number;
    membershipRevenuePercent: number;
    meetingRoomRevenuePercent: number;
    loungeRevenuePercent: number;
    otherRevenuePercent: number;
    averageMonthlyRevenue: number;
  };
  // If groupBy is specified
  groupedData?: {
    name: string; // Group name (workspace type or billing type)
    totalRevenue: number;
    percentOfTotal: number;
  }[];
}

// Expense report request
export interface ExpenseReportRequest {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  categories?: ExpenseCategory[];
  format?: ExportFormat;
}

// Expense report response
export interface ExpenseReportResponse {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  expenseData: {
    date: string; // ISO date string or YYYY-MM for monthly
    totalExpenses: number;
    expensesByCategory: {
      category: ExpenseCategory;
      amount: number;
    }[];
  }[];
  summary: {
    totalExpenses: number;
    averageMonthlyExpenses: number;
    topExpenseCategories: {
      category: ExpenseCategory;
      amount: number;
      percentOfTotal: number;
    }[];
  };
}

// Customer report request
export interface CustomerReportRequest {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  includeInactive?: boolean;
  format?: ExportFormat;
}

// Customer report response
export interface CustomerReportResponse {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  customerData: {
    date: string; // ISO date string or YYYY-MM for monthly
    newCustomers: number;
    exitedCustomers: number;
    totalActiveCustomers: number;
  }[];
  customersBreakdown: {
    workspaceType: WorkspaceType;
    count: number;
    percentOfTotal: number;
  }[];
  summary: {
    totalCustomers: number;
    averageTenureMonths: number;
    churnRate: number; // Percentage
    topExitReasons: {
      reason: string;
      count: number;
      percentOfTotal: number;
    }[];
  };
}

// Event report request
export interface EventReportRequest {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  format?: ExportFormat;
}

// Event report response
export interface EventReportResponse {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  eventData: {
    date: string; // ISO date string or YYYY-MM for monthly
    totalEvents: number;
    totalAttendees: number;
    eventsByType: {
      type: string;
      count: number;
    }[];
  }[];
  summary: {
    totalEvents: number;
    totalAttendees: number;
    averageAttendeesPerEvent: number;
  };
}

// Meeting room usage report request
export interface MeetingRoomUsageReportRequest {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  roomId?: string;
  format?: ExportFormat;
}

// Meeting room usage report response
export interface MeetingRoomUsageReportResponse {
  period: TimePeriod;
  dateRange: DateRangeFilter;
  usageData: {
    date: string; // ISO date string or YYYY-MM for monthly
    totalBookings: number;
    totalHours: number;
    chargeableHours: number;
    freeHours: number;
    revenue: number;
  }[];
  roomBreakdown?: {
    roomId: string;
    roomName: string;
    totalBookings: number;
    totalHours: number;
    percentOfTotalHours: number;
    revenue: number;
  }[];
  summary: {
    totalBookings: number;
    totalHours: number;
    averageBookingLengthHours: number;
    totalRevenue: number;
    percentChargeable: number;
  };
}
