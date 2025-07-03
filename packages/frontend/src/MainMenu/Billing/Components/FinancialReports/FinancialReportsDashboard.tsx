import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReports1';
import { ReportType, ReportParameters, ExpenseCategory } from 'shared-types';
import { ChartDisplay } from '../../../../Common/Components/BaseComponents/Graph';
import { Table } from '../../../../Common/Components/BaseComponents/Table';
import axios from 'axios';

type ExtendedReportParameters = ReportParameters & {
  vendorId?: string;
};

const reportTypes = [
  { label: 'הכנסות', value: 'REVENUE' },
  { label: 'הוצאות', value: 'EXPENSES' },
];

const groupByOptions = [
  { label: 'חודשי', value: 'month' },
  { label: 'רבעוני', value: 'quarter' },
  { label: 'שנתי', value: 'year' },
];

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

export const FinancialReportsDashboard: React.FC = () => {
  const methods = useForm<ExtendedReportParameters>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      dateRange: { startDate: '', endDate: '' },
      categories: [],
      customerIds: [],
    },
  });

  const { fetchReport, reportData, loading, error } = useFinancialReportsStore();

  const [selectedType, setSelectedType] = useState<ReportType>(ReportType.REVENUE);
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);

  // שליפת לקוחות עבור דוחות הכנסות
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await axios.get('http://localhost:3001/api/customers', {
          withCredentials: true,
        });
        setCustomers(response.data || []);
      } catch (err) {
        console.error('שגיאה בטעינת לקוחות:', err);
      }
    }
    fetchCustomers();
  }, []);

  const onSubmit = async (data: ExtendedReportParameters) => {
    const transformed: ExtendedReportParameters = {
      ...data,
      vendorId: data.customerIds?.[0], // נדרש רק לדוחות הוצאות
    };

    await fetchReport(selectedType, transformed);
  };

  const expenseCategoryOptions = Object.values(ExpenseCategory).map((cat) => ({
    label: cat,
    value: cat,
  }));

  return (
    <Form<ExtendedReportParameters>
      label="טופס דוחות פיננסיים"
      schema={ReportFormSchema}
      onSubmit={onSubmit}
      methods={methods}
    >
      <div>
        <label>סוג דוח</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ReportType)}
          className="w-full px-2 py-1 border rounded"
        >
          {reportTypes.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <InputField name="dateRange.startDate" label="מתאריך (YYYY-MM-DD)" required />
      <InputField name="dateRange.endDate" label="עד תאריך (YYYY-MM-DD)" required />

      {selectedType === 'REVENUE' && (
        <>
          <div>
            <label>קיבוץ לפי</label>
            <select {...methods.register('groupBy')} className="w-full px-2 py-1 border rounded">
              {groupByOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>לקוח</label>
            <select
              {...methods.register('customerIds')}
              multiple
              className="w-full px-2 py-1 border rounded"
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {selectedType === 'EXPENSES' && (
        <>
          <div>
            <label>קטגוריות הוצאה</label>
            <select
              multiple
              {...methods.register('categories')}
              className="w-full px-2 py-1 border rounded"
            >
              {expenseCategoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div>
        <label>בחר סוג גרף</label>
        <select
          value={selectedChartType}
          onChange={(e) => setSelectedChartType(e.target.value as 'bar' | 'pie' | 'line')}
          className="w-full px-2 py-1 border rounded"
        >
          <option value="bar">גרף עמודות</option>
          <option value="pie">גרף עוגה</option>
          <option value="line">גרף קו</option>
        </select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'טוען...' : 'צור דוח'}
      </Button>

      {error && <p className="text-red-600">{error.message}</p>}

      {reportData && (
        <>
          {selectedType === 'REVENUE' && reportData.revenueData && (
            <ChartDisplay
              type={selectedChartType}
              data={reportData.revenueData.breakdown.map((item) => ({
                label: item.date,
                value: item.totalRevenue,
              }))}
              title="דוח הכנסות"
            />
          )}

          {selectedType === 'EXPENSES' && reportData.expenseData && (
            <ChartDisplay
              type={selectedChartType}
              data={reportData.expenseData.monthlyTrend.map((item) => ({
                label: item.month,
                value: item.totalExpenses,
              }))}
              title="דוח הוצאות"
            />
          )}

          <Table
            columns={[
              { header: 'תאריך', accessor: 'date' },
              { header: 'סכום כולל', accessor: 'totalRevenue' },
            ]}
            data={
              selectedType === 'REVENUE'
                ? reportData.revenueData.breakdown.map((item) => ({
                    date: item.date,
                    totalRevenue: item.totalRevenue,
                  }))
                : selectedType === 'EXPENSES'
                ? reportData.expenseData.monthlyTrend.map((item) => ({
                    date: item.month,
                    totalRevenue: item.totalExpenses,
                  }))
                : []
            }
          />
        </>
      )}
    </Form>
  );
};
