import { create } from 'zustand'; // ייבוא ספריית Zustand ליצירת store
import { ReportData, ReportType, ReportParameters } from 'shared-types'; // ייבוא טיפוסים מה־shared-types שלך
import { fetchReportData } from '../../MainMenu/Billing/Components/FinancialReports/reportService'; // ייבוא השירות שמבצע fetch לשרת
interface FinancialReportsState {
  reportData?: ReportData; // ✅ שינוי: כעת reportData הוא מערך של ReportData (ולא אובייקט בודד)
  loading: boolean;
  error?: Error;
  fetchReport: (type: ReportType, parameters: ReportParameters) => Promise<void>;
}

export const useFinancialReportsStore = create<FinancialReportsState>((set) => ({
  reportData: undefined,
  loading: false,
  error: undefined,

  /**
   * שליחת בקשה לשרת לקבלת דוח לפי סוג ופרמטרים
   */
  fetchReport: async (type, parameters) => {
    set({ loading: true, error: undefined });
    try {
      const data = await fetchReportData(type, parameters);
      set({ reportData: data }); // שמירת התוצאה (מערך) ב־store
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },
}));