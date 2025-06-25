import React, { useState } from 'react'; // ייבוא React וניהול סטייט
import { useForm, FormProvider } from 'react-hook-form'; // ניהול טפסים
import { InputField } from '../../../../Common/Components/BaseComponents/Input'; // שדה טקסט מהקומפוננטות שלך
import { SelectField } from '../../../../Common/Components/BaseComponents/Select'; // שדה בחירה מהקומפוננטות שלך
import { Button } from '../../../../Common/Components/BaseComponents/Button'; // כפתור מהקומפוננטות שלך
import { useFinancialReportsStore } from '../../../../Stores/Billing/financialReports1'; // ה־Zustand Store
import { ReportType, ReportParameters } from 'shared-types'; // טיפוסים משותפים
import { ReportChart } from '../../../../Common/Components/BaseComponents/Chart'; // גרף
import { Table } from '../../../../Common/Components/BaseComponents/Table'; // טבלה

// אפשרויות סוגי דוחות
const reportTypes = [
  { label: 'Revenue', value: 'REVENUE' },
  { label: 'Expenses', value: 'EXPENSES' },
];

// אפשרויות groupBy
const groupByOptions = [
  { label: 'חודשי', value: 'month' },
  { label: 'רבעוני', value: 'quarter' },
  { label: 'שנתי', value: 'year' },
];

/**
 * קומפוננטה ראשית להצגת דוחות פיננסיים
 */
export const FinancialReportsDashboard: React.FC = () => {
  const methods = useForm<ReportParameters>(); // יצירת instance של react-hook-form
  const { fetchReport, reportData, loading, error } = useFinancialReportsStore(); // חיבור ל־Zustand
  const [selectedType, setSelectedType] = useState<ReportType>(ReportType.REVENUE); // אחסון סוג הדוח שנבחר

  // טיפול בשליחת הטופס
  const onSubmit = async (data: ReportParameters) => {
    await fetchReport(selectedType, data); // קריאה ל-API
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {/* בחירת סוג דוח */}
        <SelectField
          name="type"
          label="סוג דוח"
          options={reportTypes}
          required
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value as ReportType)}  // הוספת פונקציית onChange
        />

        {/* טווח תאריכים */}
        <InputField name="from" label="מתאריך (YYYY-MM-DD)" required />
        <InputField name="to" label="עד תאריך (YYYY-MM-DD)" required />

        {/* קיבוץ לפי */}
        <SelectField
          name="groupBy"
          label="קיבוץ לפי"
          options={groupByOptions}
          required
        />

        {/* כפתור שליחה */}
        <Button type="submit" disabled={loading}>
          {loading ? 'טוען...' : 'צור דוח'}
        </Button>
      </form>

      {/* הצגת שגיאות */}
      {error && <p className="text-red-500">אירעה שגיאה: {error.message}</p>}

      {/* הצגת הדוח */}
      {reportData && (
        <>
          {/* הצגת דוח הכנסות */}
          {selectedType === 'REVENUE' && reportData?.revenueData && (
  <ReportChart
    type="bar"
    data={reportData.revenueData.breakdown.map(item => ({
      label: item.date,  // תאריך
      value: item.totalRevenue,  // סכום כולל
    }))}
    title="דוח הכנסות"
  />
)}


          {/* הצגת דוח הוצאות */}
       {selectedType === 'EXPENSES' && reportData?.expenseData && (
  <ReportChart
    type="bar"
    data={reportData.expenseData.monthlyTrend.map(item => ({
      label: item.month,  // חודש
      value: item.totalExpenses,  // סכום כולל
    }))}
    title="דוח הוצאות"
  />
)}


          {/* טבלה */}
<Table
  columns={[
    { header: 'תאריך', accessor: 'date' },  // אם זה דוח הכנסות השתמש ב-'date', אם זה דוח הוצאות השתמש ב-'month'
    { header: 'סכום כולל', accessor: 'totalRevenue' },  // עבור דוח הכנסות השתמש ב-'totalRevenue', עבור הוצאות השתמש ב-'totalExpenses'
  ]}
  data={
    selectedType === 'REVENUE'
      ? reportData.revenueData.breakdown.map(item => ({
          date: item.date,  // עבור הכנסות, השתמש ב-'date'
          totalRevenue: item.totalRevenue,  // סכום מתוך breakdown
          membershipRevenue: item.membershipRevenue,
          meetingRoomRevenue: item.meetingRoomRevenue,
          loungeRevenue: item.loungeRevenue,
        }))
      : selectedType === 'EXPENSES'
      ? reportData.expenseData.monthlyTrend.map(item => ({
          date: item.month,  // עבור הוצאות, השתמש ב-'month'
          totalRevenue: item.totalExpenses,  // השתמש ב-'totalExpenses' במקום ב-'totalRevenue'
          membershipRevenue: 0,  // אין צורך בהכנסות עבור הוצאות, השתמש ב-0
          meetingRoomRevenue: 0,  // אין צורך בהכנסות עבור הוצאות, השתמש ב-0
          loungeRevenue: 0,  // אין צורך בהכנסות עבור הוצאות, השתמש ב-0
        }))
    //   : selectedType === 'PROFIT_LOSS'
    //   ? reportData.profitLossData.map(item => ({
    //       date: item.date,  // אם יש שדה תאריך עבור Profit_Loss
    //       totalRevenue: item.totalRevenue,  // אם יש שדה הכנסות עבור Profit_Loss
    //       totalExpenses: item.totalExpenses, // אם יש שדה הוצאות עבור Profit_Loss
    //       profitLoss: item.profitLoss, // אם יש שדה רווח/הפסד
    //     }))
    //   : selectedType === 'CASH_FLOW'
    //   ? reportData.cashFlowData.map(item => ({
    //       date: item.date,  // אם יש שדה תאריך עבור Cash_Flow
    //       cashInflow: item.cashInflow, // אם יש שדה תזרים מזומנים נכנס
    //       cashOutflow: item.cashOutflow, // אם יש שדה תזרים מזומנים יוצא
    //     }))
    //   : selectedType === 'CUSTOMER_AGING'
    //   ? reportData.customerAgingData.map(item => ({
    //       date: item.date, // אם יש שדה תאריך עבור Customer_Aging
    //       totalAmount: item.totalAmount, // סכום או מידע אחר
    //     }))
      : []
  }
/>


        </>
      )}
    </FormProvider>
  );
};
