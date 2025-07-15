// קובץ React: FinancialReportsDashboard.tsx
// כולל הסרה של האפשרות לבחור בדוח "הכנסות תפוסה" ללא שינוי ב־ReportType

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { ChartDisplay } from '../../../../Common/Components/BaseComponents/Graph';
import { ExportButtons } from '../../../../Common/Components/BaseComponents/ExportButtons';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';

import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReports1';
import { ReportType, ReportParameters, ExpenseCategory } from 'shared-types';
import axios from 'axios';

// טיפוס כולל vendorId רק בצד הקליינט
type ExtendedReportParameters = ReportParameters & {
  vendorId?: string;
};

const ReportFormSchema = z.object({
  dateRange: z.object({
    startDate: z.string().min(1, 'יש להזין תאריך התחלה'),
    endDate: z.string().min(1, 'יש להזין תאריך סיום'),
  }),
  groupBy: z.enum(['month', 'quarter', 'year']).optional(),
  categories: z.array(z.nativeEnum(ExpenseCategory)).optional(),
  customerIds: z.array(z.string()).optional(),
  includeProjections: z.boolean().optional(),
});

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

const reportTypeLabels: Record<ReportType, string> = {
  REVENUE: 'הכנסות',
  EXPENSES: 'הוצאות',
  PROFIT_LOSS: 'רווח והפסד',
  CASH_FLOW: 'תזרים מזומנים',
  CUSTOMER_AGING: '',
  OCCUPANCY_REVENUE: 'הכנסות תפוסה',
};

export const FinancialReportsDashboard: React.FC = () => {
  const methods = useForm<ExtendedReportParameters>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      dateRange: { startDate: '', endDate: '' },
      categories: [],
      customerIds: [],
    },
  });

  const fetchReport = useFinancialReportsStore((s) => s.fetchReport);
  const reportData = useFinancialReportsStore((s) => s.reportData);
  const loading = useFinancialReportsStore((s) => s.loading);
  const error = useFinancialReportsStore((s) => s.error);

  const [selectedType, setSelectedType] = useState<ReportType>(ReportType.REVENUE);
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([]);
  const exportContentRef = useRef<HTMLDivElement>(null);

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

  const onSubmit = async (data: ExtendedReportParameters) => {
    const transformed = {
      ...data,
      vendorId: selectedType === ReportType.EXPENSES ? data.customerIds?.[0] : undefined,
    };
    await fetchReport(selectedType, transformed);
  };

  const getChartData = () => {
    switch (selectedType) {
      case ReportType.REVENUE:
        return reportData?.revenueData?.breakdown?.map((i) => ({ label: i.date, value: i.totalRevenue })) || [];
      case ReportType.EXPENSES:
        return reportData?.expenseData?.monthlyTrend?.map((i) => ({ label: i.month, value: i.totalExpenses })) || [];
      case ReportType.PROFIT_LOSS:
        return reportData?.profitLossData?.breakdown?.map((i) => ({ label: i.date, value: i.profit })) || [];
      case ReportType.CASH_FLOW:
        return reportData?.cashFlowData?.breakdown?.map((i) => ({ label: i.date, value: i.totalPayments })) || [];
      default:
        return [];
    }
  };

  const getReportTitle = (): string => {
    const values = methods.getValues();
    const typeLabel = reportTypeLabels[selectedType];
    const from = values.dateRange?.startDate;
    const to = values.dateRange?.endDate;

    const parts: string[] = [];
    if (from && to) parts.push(`בתקופה ${from} עד ${to}`);

    const customerIds = values.customerIds ?? [];
    if (selectedType === ReportType.REVENUE && customerIds.length) {
      const selectedNames = customers.filter((c) => customerIds.includes(c.id)).map((c) => c.name);
      parts.push(`ללקוחות: ${selectedNames.join(', ')}`);
    }

    if (selectedType === ReportType.EXPENSES) {
      const vendorIds = values.customerIds ?? [];
      if (vendorIds.length) {
        const vendorNames = vendors.filter((v) => vendorIds.includes(v.id)).map((v) => v.name);
        parts.push(`עבור ספקים: ${vendorNames.join(', ')}`);
      }
      if (values.categories?.length) {
        const categoryNames = values.categories.map((cat) => expenseCategoryLabels[cat as ExpenseCategory]);
        parts.push(`סוגי הוצאה: ${categoryNames.join(', ')}`);
      }
    }

    return `דוח ${typeLabel} ${parts.length ? '— ' + parts.join(' | ') : ''}`;
  };

  const formatNumber = (value: number): string => (value < 0 ? `${Math.abs(value)}-` : value.toString());

  const { data: fullTableData, columns: fullTableColumns } = (() => {
    let data: any[] = [];
    let columns: { header: string; accessor: string }[] = [];

    if (!reportData) return { data, columns };

    if (selectedType === ReportType.REVENUE && reportData.revenueData?.breakdown?.length) {
      data = reportData.revenueData.breakdown;
      columns = Object.keys(data[0]).map((key) => ({ header: key === 'date' ? 'תאריך' : key, accessor: key }));
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
    }

    return { data, columns };
  })();

  return (
    <Form label="טופס דוחות פיננסיים" schema={ReportFormSchema} onSubmit={onSubmit} methods={methods}>
      <div className="flex flex-col gap-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ReportType)}
          className="w-full px-2 py-1 border rounded"
        >
          {Object.values(ReportType)
            .filter((type) => type !== ReportType.OCCUPANCY_REVENUE)
            .map((type) =>
              reportTypeLabels[type] ? (
                <option key={type} value={type}>
                  {reportTypeLabels[type]}
                </option>
              ) : null
            )}
        </select>

        <InputField type="date" name="dateRange.startDate" label="מתאריך" required />
        <InputField type="date" name="dateRange.endDate" label="עד תאריך" required />

        <SelectField
          name="groupBy"
          label="בחר קיבוץ לפי"
          options={[
            { label: 'חודשי', value: 'month' },
            { label: 'רבעוני', value: 'quarter' },
            { label: 'שנתי', value: 'year' },
          ]}
        />

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

        <Button type="submit" disabled={loading}>
          {loading ? 'טוען...' : 'צור דוח'}
        </Button>
        {error && <p className="text-red-600">{error.message}</p>}

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

        {reportData && (
          <div ref={exportContentRef} className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">{getReportTitle()}</h2>
            <ChartDisplay type={selectedChartType} data={getChartData()} />
            <ExportButtons refContent={exportContentRef} exportData={fullTableData} title={`דוח_${selectedType}`} />

            <div className="mt-4">
              <table className="table-auto border border-gray-300 text-sm w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {fullTableColumns.map((col, idx) => (
                      <th key={idx} className="border px-4 py-2 font-semibold text-right">
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fullTableData.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-gray-50">
                      {fullTableColumns.map((col, colIdx) => (
                        <td key={colIdx} className="border px-4 py-2 text-right">
                          {typeof row[col.accessor] === 'number'
                            ? formatNumber(row[col.accessor])
                            : String(row[col.accessor] ?? '')}
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
