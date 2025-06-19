// report-types.d.ts
import { ApiResponse, DateISO, DateRangeFilter, ID } from './core';
import { WorkspaceType } from './customer';
import { ExpenseCategory } from './expense';
import { BillingItemType } from './billing';

//extra interfaces
export interface ReportData {
revenueData: RevenueReportData;
expenseData: ExpenseReportData;
// profitLossData: ProfitLossReportData;
// cashFlowData: CashFlowReportData;
// customerAgingData: CustomerAgingReportData;
// occupancyRevenueData: OccupancyRevenueReportData;
}
export interface FinancialReport {
id: ID;
type: ReportType;
title: string;
description?: string;
parameters: ReportParameters;
data: ReportData;
generatedAt: DateISO;
generatedBy: ID;

}
export enum ReportType {
REVENUE = '&#39;REVENUE&#39',
EXPENSES = '&#39;EXPENSES&#39',
PROFIT_LOSS = '&#39;PROFIT_LOSS&#39',
CASH_FLOW = '&#39;CASH_FLOW&#39',
CUSTOMER_AGING = '&#39;CUSTOMER_AGING&#39',
OCCUPANCY_REVENUE = '&#39;OCCUPANCY_REVENUE&#39'
}
export interface ReportParameters {
dateRange: DateRangeFilter;
groupBy?: '&#39;month&#39; | &#39;quarter&#39; | &#39;year&#39';
categories?: string[];
customerIds?: ID[];
includeProjections?: boolean;
}
export interface RevenueReportData {
totalRevenue: number;
membershipRevenue: number;
meetingRoomRevenue: number;
loungeRevenue: number;
otherRevenue: number;
breakdown: {
date: string;
totalRevenue: number;
membershipRevenue: number;
meetingRoomRevenue: number;
loungeRevenue: number;
}[];
}
export interface ExpenseReportData {
totalExpenses: number;
expensesByCategory: {
category: ExpenseCategory;
amount: number;
percentage: number;
}[];
monthlyTrend: {
month: string;

totalExpenses: number;
topCategories: {
category: ExpenseCategory;
amount: number;
}[];
}[];
}

export interface ExpenseReportByCategoryAndVendor {
  totalExpenses: number;
  expensesByCategoryAndVendor: {
    category: ExpenseCategory;
    vendorId: ID;
    vendorName: string;
    amount: number;
    percentage: number;
  }[];
  period: {
    startDate: DateISO;
    endDate: DateISO;
  };
}
export interface RevenueReportByWorkspaceAndPeriod {
  totalRevenue: number;
  byWorkspaceType: {
    workspaceType: WorkspaceType;
    revenue: number;
    breakdown: {
      period: string; // לדוג' '2024-06' או 'Q2-2024'
      revenue: number;
    }[];
  }[];
  period: {
    startDate: DateISO;
    endDate: DateISO;
  };
}

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
