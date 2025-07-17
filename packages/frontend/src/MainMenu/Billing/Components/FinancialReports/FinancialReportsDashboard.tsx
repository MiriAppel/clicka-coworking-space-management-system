// עמוד דוחות פיננסיים הכולל טופס, גרף, שתי טבלאות וכפתורי ייצוא  

import React, { useEffect, useState, useRef } from 'react'; // שימוש ב־React ו־hooks
import { useForm } from 'react-hook-form'; // ניהול טפסים עם ספריית react-hook-form
import { z } from 'zod'; // ספריית סכימות ולידציה
import { zodResolver } from '@hookform/resolvers/zod'; // שילוב בין zod ל־react-hook-form
import { Form } from '../../../../Common/Components/BaseComponents/Form'; // קומפוננטת טופס מוכנה
import { InputField } from '../../../../Common/Components/BaseComponents/Input'; // שדה טקסט
import { Button } from '../../../../Common/Components/BaseComponents/Button'; // כפתור רגיל
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReports1'; // חיבור ל־store של דוחות
import { ReportType, ReportParameters, ExpenseCategory } from 'shared-types'; // טיפוסים משותפים
import { ChartDisplay } from '../../../../Common/Components/BaseComponents/Graph'; // קומפוננטת גרף
import { Table } from '../../../../Common/Components/BaseComponents/Table'; // טבלה כללית
import axios from 'axios'; // ספריית קריאות HTTP
import { ExportButtons } from '../../../../Common/Components/BaseComponents/ExportButtons'; // כפתורי ייצוא

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
export const FinancialReportsDashboard: React.FC = () => {
  const methods = useForm<ExtendedReportParameters>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      dateRange: { startDate: '', endDate: '' },
      categories: [],
      customerIds: [],
    },
  });
  const thStyle: React.CSSProperties = {
    border: '1px solid #ccc', padding: '8px', backgroundColor: '#f0f0f0', textAlign: 'left',
  };
  const tdStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '8px' };
  const trStyle: React.CSSProperties = {};
  const { fetchReport, reportData, loading, error } = useFinancialReportsStore(); // נתוני דוח מה־store
  const [selectedType, setSelectedType] = useState<ReportType>(ReportType.REVENUE); // סוג דוח נבחר
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'pie' | 'line'>('bar'); // סוג גרף
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]); // לקוחות
  const [vendors, setVendors] = useState<{ id: string; name: string }[]>([]); // ספקים
  const exportContentRef = useRef<HTMLDivElement>(null); // רפרנס לייצוא PDF
  useEffect(() => {
    async function fetchEntities() {
      try {
        const [customerRes, vendorRes] = await Promise.all([
          axios.get('http://localhost:3001/api/customers', { withCredentials: true }),
          axios.get('http://localhost:3001/vendor', { withCredentials: true }),
        ]);
        setCustomers(customerRes.data || []);
        setVendors(vendorRes.data || []);
      } catch (err) {
        console.error('שגיאה בטעינת נתונים:', err);
      }
    }
    fetchEntities();
  }, []);
  const onSubmit = async (data: ExtendedReportParameters) => {
    const transformed = {
      ...data,
      vendorId: selectedType === 'EXPENSES' ? data.customerIds?.[0] : undefined,
    };
    await fetchReport(selectedType, transformed);
  };
const exportTableData =
    selectedType === 'REVENUE'
      ? reportData?.revenueData?.breakdown?.map((item) => ({
          תאריך: item.date,
          'סה״כ הכנסות': item.totalRevenue,
        })) || []
      : reportData?.expenseData?.monthlyTrend?.map((item) => ({
          חודש: item.month,
          'סה״כ הוצאות': item.totalExpenses,
        })) || [];
  // טופס מלא + תצוגה וייצוא
   const exportFullTableData =
  selectedType === 'REVENUE'
    ? reportData?.revenueData?.breakdown?.map((item) => ({
        'תאריך': item.date,
        'סה״כ הכנסות': item.totalRevenue,
        'חברות': item.membershipRevenue,
        'ישיבות': item.meetingRoomRevenue,
        'לאונג׳': item.loungeRevenue,
        'אחר':
          item.totalRevenue -
          item.membershipRevenue -
          item.meetingRoomRevenue -
          item.loungeRevenue,
      })) || []
    : reportData?.expenseData?.monthlyTrend?.map((item) => ({
        'חודש': item.month,
        'סה״כ הוצאות': item.totalExpenses,
        'קטגוריה 1': item.topCategories[0]?.category || '',
        'סכום 1': item.topCategories[0]?.amount || '',
        'קטגוריה 2': item.topCategories[1]?.category || '',
        'סכום 2': item.topCategories[1]?.amount || '',
        'קטגוריה 3': item.topCategories[2]?.category || '',
        'סכום 3': item.topCategories[2]?.amount || '',
      })) || [];
  return (
    <Form<ExtendedReportParameters>
      label="טופס דוחות פיננסיים"
      schema={ReportFormSchema}
      onSubmit={onSubmit}
      methods={methods}
    >
      <div className="flex flex-col gap-4">
        {/* בחירת סוג דוח */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ReportType)}
          className="w-full px-2 py-1 border rounded"
        >
          <option value="REVENUE">הכנסות</option>
          <option value="EXPENSES">הוצאות</option>
        </select>
        {/* שדות תאריכים */}
        <InputField name="dateRange.startDate" label="מתאריך (YYYY-MM-DD)" required />
        <InputField name="dateRange.endDate" label="עד תאריך (YYYY-MM-DD)" required />
        {/* שדות מיוחדים לפי סוג הדוח */}
        {selectedType === 'REVENUE' && (
          <>
          <label className="block mb-2">בחר קיבוץ לפי :</label>
            <select  {...methods.register('groupBy')} className="w-full px-2 py-1 border rounded">
              <option value="month">חודשי</option>
              <option value="quarter">רבעוני</option>
              <option value="year">שנתי</option>
            </select>
          <label className="block mb-2">בחר לקוחות :</label>
            <select {...methods.register('customerIds')} multiple className="w-full px-2 py-1 border rounded">
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </>
        )}
        {selectedType === 'EXPENSES' && (
          <>
          <label className="block mb-2">בחר ספק :</label>
            <select  {...methods.register('customerIds')} multiple className="w-full px-2 py-1 border rounded">
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <label className="block mb-2">בחר סוג הוצאה :</label>
            <select {...methods.register('categories')} multiple className="w-full px-2 py-1 border rounded">
              {Object.values(ExpenseCategory).map((cat) => (
                <option key={cat} value={cat}>{expenseCategoryLabels[cat]}</option>
              ))}
            </select>
          </>
        )}

        {/* סוג גרף */}
        <label className="block mb-2">בחר סוג גרף :</label>
        <select
          value={selectedChartType}
          onChange={(e) => setSelectedChartType(e.target.value as 'bar' | 'pie' | 'line')}
          className="w-full px-2 py-1 border rounded"
        >
          <option value="bar">גרף עמודות</option>
          <option value="pie">גרף עוגה</option>
          <option value="line">גרף קו</option>
        </select>

        <Button type="submit" disabled={loading}>{loading ? 'טוען...' : 'צור דוח'}</Button>
        {error && <p className="text-red-600">{error.message}</p>}
      </div>

      {/* תצוגת גרף, טבלה וייצוא */}
      {reportData && (
        <div className="flex flex-col gap-8 mt-8" ref={exportContentRef}>
          {/* גרף */}
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

          {/* טבלה פשוטה */}
          <Table
            columns={[
              { header: 'תאריך', accessor: 'date' },
              { header: 'סכום כולל', accessor: 'total' },
            ]}
            data={
              selectedType === 'REVENUE'
                ? reportData.revenueData.breakdown.map((item) => ({
                    date: item.date,
                    total: item.totalRevenue,
                  }))
                : reportData.expenseData.monthlyTrend.map((item) => ({
                    date: item.month,
                    total: item.totalExpenses,
                  }))
            }
          />

          {/* טבלת עיצוב מותאמת */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {selectedType === 'REVENUE' ? (
                  <>
                    <th style={thStyle}>תאריך</th>
                    <th style={thStyle}>סה״כ הכנסות</th>
                    <th style={thStyle}>חברות</th>
                    <th style={thStyle}>ישיבות</th>
                    <th style={thStyle}>לאונג׳</th>
                    <th style={thStyle}>אחר</th>
                  </>
                ) : (
                  <>
                    <th style={thStyle}>חודש</th>
                    <th style={thStyle}>סה״כ הוצאות</th>
                    <th style={thStyle}>קטגוריה 1</th>
                    <th style={thStyle}>סכום 1</th>
                    <th style={thStyle}>קטגוריה 2</th>
                    <th style={thStyle}>סכום 2</th>
                    <th style={thStyle}>קטגוריה 3</th>
                    <th style={thStyle}>סכום 3</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {selectedType === 'REVENUE'
                ? reportData.revenueData.breakdown.map((item, i) => (
                    <tr key={i} style={trStyle}>
                      <td style={tdStyle}>{item.date}</td>
                      <td style={tdStyle}>{item.totalRevenue}</td>
                      <td style={tdStyle}>{item.membershipRevenue}</td>
                      <td style={tdStyle}>{item.meetingRoomRevenue}</td>
                      <td style={tdStyle}>{item.loungeRevenue}</td>
                      <td style={tdStyle}>{item.totalRevenue - item.membershipRevenue - item.meetingRoomRevenue - item.loungeRevenue}</td>
                    </tr>
                  ))
                : reportData.expenseData.monthlyTrend.map((item, i) => (
                    <tr key={i} style={trStyle}>
                      <td style={tdStyle}>{item.month}</td>
                      <td style={tdStyle}>{item.totalExpenses}</td>
                      <td style={tdStyle}>{item.topCategories[0]?.category || ''}</td>
                      <td style={tdStyle}>{item.topCategories[0]?.amount || ''}</td>
                      <td style={tdStyle}>{item.topCategories[1]?.category || ''}</td>
                      <td style={tdStyle}>{item.topCategories[1]?.amount || ''}</td>
                      <td style={tdStyle}>{item.topCategories[2]?.category || ''}</td>
                      <td style={tdStyle}>{item.topCategories[2]?.amount || ''}</td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {/* כפתורי ייצוא */}
          <ExportButtons
            title={selectedType === 'REVENUE' ? 'דוח הכנסות' : 'דוח הוצאות'}
            refContent={exportContentRef}
            exportData={exportFullTableData}
          />
        </div>
      )}
    </Form>
  );
};