import { DateRangeFilter } from './core';
import { WorkspaceType } from './customer';
import { ExpenseCategory } from './expense';
export declare enum TimePeriod {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY"
}
export declare enum ExportFormat {
    CSV = "CSV",
    PDF = "PDF",
    EXCEL = "EXCEL"
}
export interface OccupancyReportRequest {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    workspaceTypes?: WorkspaceType[];
    includeKlikahCardMembers?: boolean;
    format?: ExportFormat;
}
export interface OccupancyReportResponse {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    occupancyData: {
        date: string;
        totalSpaces: number;
        occupiedSpaces: number;
        openSpaceCount: number;
        deskInRoomCount: number;
        privateRoomCount: number;
        roomForThreeCount: number;
        klikahCardCount: number;
        occupancyRate: number;
    }[];
    summary: {
        averageOccupancyRate: number;
        maxOccupancyRate: number;
        minOccupancyRate: number;
        totalCustomerCount: number;
    };
}
export interface RevenueReportRequest {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    groupBy?: 'workspace_type' | 'billing_type';
    format?: ExportFormat;
}
export interface RevenueReportResponse {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    revenueData: {
        date: string;
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
    groupedData?: {
        name: string;
        totalRevenue: number;
        percentOfTotal: number;
    }[];
}
export interface ExpenseReportRequest {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    categories?: ExpenseCategory[];
    format?: ExportFormat;
}
export interface ExpenseReportResponse {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    expenseData: {
        date: string;
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
export interface CustomerReportRequest {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    includeInactive?: boolean;
    format?: ExportFormat;
}
export interface CustomerReportResponse {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    customerData: {
        date: string;
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
        churnRate: number;
        topExitReasons: {
            reason: string;
            count: number;
            percentOfTotal: number;
        }[];
    };
}
export interface EventReportRequest {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    format?: ExportFormat;
}
export interface EventReportResponse {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    eventData: {
        date: string;
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
export interface MeetingRoomUsageReportRequest {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    roomId?: string;
    format?: ExportFormat;
}
export interface MeetingRoomUsageReportResponse {
    period: TimePeriod;
    dateRange: DateRangeFilter;
    usageData: {
        date: string;
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
