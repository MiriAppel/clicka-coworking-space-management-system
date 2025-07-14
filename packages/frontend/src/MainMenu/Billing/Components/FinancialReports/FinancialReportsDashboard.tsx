import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { ChartDisplay } from '../../../../Common/Components/BaseComponents/Graph';
import { ExportButtons } from '../../../../Common/Components/BaseComponents/exportButtons';

import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReports1';
import { ReportType, ReportParameters, ExpenseCategory } from 'shared-types';
import axios from 'axios';

// הרחבת סוג הדוחות עם פרמטר נוסף עבור vendorId
type ExtendedReportParameters = ReportParameters & {
  vendorId?: string;
};

// הגדרת מבנה הטופס והוולידציה בעזרת zod
const ReportFormSchema = z.object({
  dateRange: z.object({
    startDate: z.string().min(1, 'יש להזין תאריך התחלה'),  // וולידציה לתאריך התחלה
    endDate: z.string().min(1, 'יש להזין תאריך סיום'),    // וולידציה לתאריך סיום
  }),
  groupBy: z.enum(['month', 'quarter', 'year']).optional(),  // קיבוץ לפי תקופה (חודשי, רבעוני, שנתי)
  categories: z.array(z.nativeEnum(ExpenseCategory)).optional(),  // קיבוץ לפי קטגוריות הוצאה
  customerIds: z.array(z.string()).optional(),  // בחירת לקוחות
  includeProjections: z.boolean().optional(),  // אפשרות להוסיף תחזיות
});

// תיאורים עבור כל קטגוריית הוצאה
const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  RENT: 'שכירות',
  UTILITIES: 'חשבונות',
  CLEANING: 'ניקיון',
  MAINTENANCE: 'תחזוקה',
  OFFICE_SUPPLIES: 'ציוד משרדי',
  REFRESHMENTS: 'כיבוד',
  MARKETING: 'שיווק',
  SALARIES: 'משכורות',
  INSURANCE: 'ביטוחים',
  SOFTWARE: 'תוכנה',
  PROFESSIONAL_SERVICES: 'שירותים מקצועיים',
  TAXES: 'מיסים',
  EVENTS: 'אירועים',
  FURNITURE: 'ריהוט',
  EQUIPMENT: 'ציוד',
  PETTY_CASH: 'קופה קטנה',
  OTHER: 'אחר',
};

// תיאורים עבור סוגי הדוחות השונים
const reportTypeLabels: Record<ReportType, string> = {
  REVENUE: 'הכנסות',
  EXPENSES: 'הוצאות',
  PROFIT_LOSS: 'רווח והפסד',
  CASH_FLOW: 'תזרים מזומנים',
  CUSTOMER_AGING: '',
  OCCUPANCY_REVENUE: 'הכנסות תפוסה',
};

export const FinancialReportsDashboard: React.FC = () => {
  // שימוש ב-react-hook-form כדי לטפל בטופס ובוולידציה
  const methods = useForm<ExtendedReportParameters>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      dateRange: { startDate: '', endDate: '' },
      categories: [],
      customerIds: [],
    },
  });

  // קריאה למצב הדוחות דרך ה-store
  const fetchReport = useFinancialReportsStore((s) => s.fetchReport);
  const reportData = useFinancialReportsStore((s) => s.reportData);
  const loading = useFinancialReportsStore((s) => s.loading);
  const error = useFinancialReportsStore((s) => s.error);

  // ניהול סטייט עבור סוג הדוח והגרף
  const [selectedType, setSelectedType] = useState<ReportType>(ReportType.REVENUE);
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([]);
  const exportContentRef = useRef<HTMLDivElement>(null);  // Ref עבור הייצוא

  // ביצוע קריאה ל-API עבור לקוחות וספקים
  useEffect(() => {
    async function fetchEntities() {
      try {
        const [customerRes, vendorRes] = await Promise.all([
          axios.get('http://localhost:3001/api/customers', { withCredentials: true }),
          axios.get('http://localhost:3001/vendor', { withCredentials: true }),
        ]);
        setCustomers(customerRes.data || []);
        setVendors(vendorRes.data || []);
      } catch {}
    }
    fetchEntities();
  }, []);

  // שליחה של הנתונים מהטופס
  const onSubmit = async (data: ExtendedReportParameters) => {
    const transformed = {
      ...data,
      vendorId: selectedType === ReportType.EXPENSES ? data.customerIds?.[0] : undefined,
    };
    await fetchReport(selectedType, transformed);  // קריאה לפונקציה ל-fetch את הדוח
  };

  // קבלת נתוני הגרף בהתאמה לסוג הדוח
  const getChartData = () => {
    switch (selectedType) {
      case ReportType.REVENUE:
        return reportData?.revenueData?.breakdown?.map((item) => ({
          label: item.date,
          value: item.totalRevenue,
        })) || [];

      case ReportType.EXPENSES:
        return reportData?.expenseData?.monthlyTrend?.map((item) => ({
          label: item.month,
          value: item.totalExpenses,
        })) || [];

      case ReportType.PROFIT_LOSS:
        return reportData?.profitLossData?.breakdown?.map((item) => ({
          label: item.date,
          value: item.profit,
        })) || [];

      case ReportType.CASH_FLOW:
        return reportData?.cashFlowData?.breakdown?.map((item) => ({
          label: item.date,
          value: item.totalPayments,
        })) || [];

      case ReportType.OCCUPANCY_REVENUE:
        return reportData?.occupancyRevenueData?.occupancyData?.map((item) => ({
          label: item.date,
          value: item.revenue,  // הכנסה מתפוסה
        })) || [];

      default:
        return [];
    }
  };

  // קיבוץ נתוני הדוח וטיפול בפרטי הטבלה
  const { data: fullTableData, columns: fullTableColumns } = (() => {
    let data: any[] = [];
    let columns: { header: string; accessor: string }[] = [];

    if (!reportData) return { data, columns };

    if (selectedType === ReportType.REVENUE && reportData.revenueData?.breakdown?.length) {
      data = reportData.revenueData.breakdown;
      columns = Object.keys(data[0]).map((key) => ({
        header: key === 'date' ? 'תאריך' : key,
        accessor: key,
      }));
    } else if (selectedType === ReportType.EXPENSES && reportData.expenseData?.monthlyTrend?.length) {
      data = reportData.expenseData.monthlyTrend.map((item) => {
        const top = item.topCategories || [];
        return {
          month: item.month,
          totalExpenses: item.totalExpenses,
          'קטגוריה 1': top[0]?.category || '',
          'סכום 1': top[0]?.amount || '',
          'קטגוריה 2': top[1]?.category || '',
          'סכום 2': top[1]?.amount || '',
          'קטגוריה 3': top[2]?.category || '',
          'סכום 3': top[2]?.amount || '',
        };
      });
      columns = Object.keys(data[0]).map((key) => ({ header: key, accessor: key }));
    } else if (selectedType === ReportType.PROFIT_LOSS && reportData.profitLossData?.breakdown?.length) {
      data = reportData.profitLossData.breakdown;
      columns = Object.keys(data[0]).map((key) => ({ header: key, accessor: key }));
    } else if (selectedType === ReportType.CASH_FLOW && reportData.cashFlowData?.breakdown?.length) {
      data = reportData.cashFlowData.breakdown;
      columns = Object.keys(data[0]).map((key) => ({ header: key, accessor: key }));
    } else if (selectedType === ReportType.OCCUPANCY_REVENUE && reportData.occupancyRevenueData?.occupancyData?.length) {
      data = reportData.occupancyRevenueData.occupancyData;
      columns = [
        { header: 'תאריך', accessor: 'date' },
        { header: 'סה"כ מקומות', accessor: 'totalSpaces' },
        { header: 'מקומות תפוסים', accessor: 'occupiedSpaces' },
        { header: 'מקומות פתוחים', accessor: 'openSpaceCount' },
        { header: 'שולחנות בחדר', accessor: 'deskInRoomCount' },
        { header: 'חדרים פרטיים', accessor: 'privateRoomCount' },
        { header: 'כרטיסי קליקה', accessor: 'klilahCardCount' },
        { header: 'אחוז תפוסה', accessor: 'occupancyRate' },
        { header: 'הכנסות תפוסה', accessor: 'revenue' },  // הוספת הכנסות תפוסה
      ];
    }

    return { data, columns };
  })();

  return (
    <Form label="טופס דוחות פיננסיים" schema={ReportFormSchema} onSubmit={onSubmit} methods={methods}>
      <div className="flex flex-col gap-4">
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as ReportType)} className="w-full px-2 py-1 border rounded">
          {Object.values(ReportType).map((type) =>
            reportTypeLabels[type] ? (
              <option key={type} value={type}>
                {reportTypeLabels[type]}
              </option>
            ) : null
          )}
        </select>

        <InputField name="dateRange.startDate" label="מתאריך (YYYY-MM-DD)" required />
        <InputField name="dateRange.endDate" label="עד תאריך (YYYY-MM-DD)" required />

        <label>בחר קיבוץ לפי :</label>
        <select {...methods.register('groupBy')} className="w-full px-2 py-1 border rounded">
          <option value="month">חודשי</option>
          <option value="quarter">רבעוני</option>
          <option value="year">שנתי</option>
        </select>

        {selectedType === ReportType.REVENUE && (
          <>
            <label>בחר לקוחות:</label>
            <select {...methods.register('customerIds')} multiple className="w-full px-2 py-1 border rounded">
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </>
        )}

        {selectedType === ReportType.EXPENSES && (
          <>
            <label>בחר ספק:</label>
            <select {...methods.register('customerIds')} multiple className="w-full px-2 py-1 border rounded">
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            <label>בחר סוג הוצאה:</label>
            <select {...methods.register('categories')} multiple className="w-full px-2 py-1 border rounded">
              {Object.values(ExpenseCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {expenseCategoryLabels[cat]}
                </option>
              ))}
            </select>
          </>
        )}

        <label>בחר סוג גרף:</label>
        <select
          value={selectedChartType}
          onChange={(e) => setSelectedChartType(e.target.value as 'bar' | 'pie' | 'line')}
          className="w-full px-2 py-1 border rounded"
        >
          <option value="bar">גרף עמודות</option>
          <option value="pie">גרף עוגה</option>
          <option value="line">גרף קו</option>
        </select>

        <Button type="submit" disabled={loading}>
          {loading ? 'טוען...' : 'צור דוח'}
        </Button>
        {error && <p className="text-red-600">{error.message}</p>}

        {reportData && (
          <div ref={exportContentRef} className="mt-8">
            <ChartDisplay type={selectedChartType} data={getChartData()} />
            <ExportButtons refContent={exportContentRef} exportData={fullTableData} title={`דוח_${selectedType}`} />

            <div className="overflow-auto w-full mt-4">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {fullTableColumns.map((col, idx) => (
                      <th key={idx} className="border px-4 py-2 font-semibold">
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fullTableData.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-gray-50">
                      {fullTableColumns.map((col, colIdx) => (
                        <td key={colIdx} className="border px-4 py-2">
                          {String(row[col.accessor] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Form>
  );
};
