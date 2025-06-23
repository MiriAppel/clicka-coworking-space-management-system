import { ID } from "./core";
import { ExpenseCategory } from "./expense";

// סוגי דוחות
export enum ReportType {
  REVENUE = 'REVENUE',
  EXPENSES = 'EXPENSES',
  PROFIT_LOSS = 'PROFIT_LOSS',
  CASH_FLOW = 'CASH_FLOW',
  CUSTOMER_AGING = 'CUSTOMER_AGING',
  OCCUPANCY_REVENUE = 'OCCUPANCY_REVENUE'
}

// פרמטרים לדוח
export interface ReportParameters {
  dateRange: { from: string; to: string };
  groupBy?: 'month' | 'quarter' | 'year';
  categories?: string[];
  customerIds?: ID[];
  includeProjections?: boolean;
}

// דוח פיננסי כללי
export interface FinancialReport {
  id: ID;
  type: ReportType;
  title: string;
  description?: string;
  parameters: ReportParameters;
  data: ReportData;
  generatedAt: string;
  generatedBy: ID;
}

// טיפוס כללי לנתוני דוח (אפשר להרחיב לפי הצורך)
export type ReportData = RevenueReportData | ExpenseReportData | any;

// דוח הכנסות
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

// דוח הוצאות
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