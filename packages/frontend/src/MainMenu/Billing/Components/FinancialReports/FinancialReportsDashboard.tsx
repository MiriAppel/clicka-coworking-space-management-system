import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReports1';
import { ReportType, ReportParameters } from 'shared-types';
import { ChartDisplay } from '../../../../Common/Components/BaseComponents/Graph';
import { Table } from '../../../../Common/Components/BaseComponents/Table';

// סוגי דוחות
const reportTypes = [
  { label: 'הכנסות', value: 'REVENUE' },
  { label: 'הוצאות', value: 'EXPENSES' },
];

// קיבוץ
const groupByOptions = [
  { label: 'חודשי', value: 'month' },
  { label: 'רבעוני', value: 'quarter' },
  { label: 'שנתי', value: 'year' },
];

// קטגוריות הוצאה
const expenseCategories = [
  { label: 'שכירות', value: 'RENT' },
  { label: 'חשבונות', value: 'UTILITIES' },
  { label: 'ניקיון', value: 'CLEANING' },
  { label: 'משכורות', value: 'SALARIES' },
  { label: 'שיווק', value: 'MARKETING' },
  { label: 'אחר', value: 'OTHER' },
];

// ספקים
const suppliers = [
  { label: 'ספק A', value: 'SUPPLIER_A' },
  { label: 'ספק B', value: 'SUPPLIER_B' },
  { label: 'ספק C', value: 'SUPPLIER_C' },
];

// סכמה עבור הטופס
const ReportFormSchema = z.object({
  from: z.string().min(1, "יש להזין תאריך התחלה"),
  to: z.string().min(1, "יש להזין תאריך סיום"),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).required(),
});

export const FinancialReportsDashboard: React.FC = () => {
  const methods = useForm<ReportParameters>();
  const { fetchReport, reportData, loading, error } = useFinancialReportsStore();

  const [selectedType, setSelectedType] = useState<ReportType>(ReportType.REVENUE);
  const [selectedGroupBy, setSelectedGroupBy] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'pie' | 'line'>('bar'); // הוספתי את 'line' כאופציה

  const onSubmit = async (data: ReportParameters) => {
    const finalParams: ReportParameters = {
      ...data,
      groupBy: selectedType === 'REVENUE' ? selectedGroupBy : undefined,
      categories: selectedType === 'EXPENSES' ? selectedCategories : undefined,
      // supplier: selectedType === 'EXPENSES' && selectedSupplier ? selectedSupplier : undefined,
    };
    await fetchReport(selectedType, finalParams);
  };

  return (
    <Form<ReportParameters>
      label="טופס דוחות פיננסיים"
      schema={ReportFormSchema}
      onSubmit={onSubmit}
      methods={methods}
    >
      {/* סוג דוח */}
      <div>
        <label>סוג דוח</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ReportType)}
          className="w-full px-2 py-1 border rounded"
        >
          <option value="">בחר סוג דוח</option>
          {reportTypes.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* טווח תאריכים */}
      <InputField name="from" label="מתאריך (YYYY-MM-DD)" required />
      <InputField name="to" label="עד תאריך (YYYY-MM-DD)" required />

      {/* פילטרים דינמיים */}
      {selectedType === 'REVENUE' && (
        <div>
          <label>קיבוץ לפי</label>
          <select
            value={selectedGroupBy}
            onChange={(e) => setSelectedGroupBy(e.target.value as 'month' | 'quarter' | 'year')}
            className="w-full px-2 py-1 border rounded"
          >
            {groupByOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedType === 'EXPENSES' && (
        <>
          {/* קטגוריות */}
          <div>
            <label>קטגוריות הוצאה</label>
            <select
              multiple
              value={selectedCategories}
              onChange={(e) =>
                setSelectedCategories(Array.from(e.target.selectedOptions, (opt) => opt.value))
              }
              className="w-full px-2 py-1 border rounded"
            >
              {expenseCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* ספקים */}
          <div>
            <label>ספק</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-2 py-1 border rounded"
            >
              <option value="">בחר ספק</option>
              {suppliers.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* בחירת סוג גרף */}
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

      {/* כפתור */}
      <Button type="submit" disabled={loading}>
        {loading ? 'טוען...' : 'צור דוח'}
      </Button>

      {/* תוצאה */}
      {error && <p className="text-red-600">{error.message}</p>}

      {reportData && (
        <>
          {selectedType === 'REVENUE' && reportData.revenueData && (
            <ChartDisplay
              type={selectedChartType} // שינוי סוג הגרף כאן
              data={reportData.revenueData.breakdown.map((item) => ({
                label: item.date,
                value: item.totalRevenue,
              }))}
              title="דוח הכנסות"
            />
          )}

          {selectedType === 'EXPENSES' && reportData.expenseData && (
            <ChartDisplay
              type={selectedChartType} // שינוי סוג הגרף כאן
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
