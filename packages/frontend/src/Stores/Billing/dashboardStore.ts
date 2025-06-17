
import { create } from "zustand";
import { FinancialReport, ReportType, ReportParameters } from "../../../../backend/src/types/financialReport";
import { ID } from "../../../../backend/src/types/core";
import { Expense } from "../../../../backend/src/types/expense";
import { Invoice, Payment } from "../../../../backend/src/types/billing";

interface DashboardState  {
  dashboardSummary?: any;
  mainReports: FinancialReport[];
  financialSummary?: FinancialReport;
  recentExpenses: Expense[];
  recentPayments: Payment[];
  recentInvoices: Invoice[];
  alerts: { id: ID; message: string; type: string }[];
  chartData?: FinancialReport;
  fetchDashboardSummary: () => Promise<void>;
  fetchMainReports: (types: ReportType[], parameters: ReportParameters) => Promise<void>;
  fetchFinancialSummary: (parameters: ReportParameters) => Promise<void>;
  fetchRecentExpenses: () => Promise<void>;
  fetchRecentPayments: () => Promise<void>;
  fetchRecentInvoices: () => Promise<void>;
  fetchDashboardAlerts: () => Promise<void>;
  fetchChartData: (type: ReportType, parameters: ReportParameters) => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboardSummary: undefined,
  mainReports: [],
  financialSummary: undefined,
  recentExpenses: [],
  recentPayments: [],
  recentInvoices: [],
  alerts: [],
  chartData: undefined,

  fetchDashboardSummary: async () => {},
  fetchMainReports: async () => {},
  fetchFinancialSummary: async () => {},
  fetchRecentExpenses: async () => {},
  fetchRecentPayments: async () => {},
  fetchRecentInvoices: async () => {},
  fetchDashboardAlerts: async () => {},
  fetchChartData: async () => {},
}));