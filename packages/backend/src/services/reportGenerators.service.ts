import { ReportParameters, ReportData, ExpenseCategory, ExpenseReportData } from 'shared-types';
import { ExpenseService } from './expense.services';
import { getRevenues } from './revenue.service';
import { groupByPeriod } from '../utils/groupingUtils.service';
import { Payment, Invoice, BillingItemType } from 'shared-types';
import { PaymentService } from '../services/payments.service';
import { serviceGetInvoiceById } from '../services/invoice.service';

export async function generateExpenseData(parameters: ReportParameters): Promise<ReportData | null> {
  const expenseService = new ExpenseService();
  const expenseCategories = parameters.categories as ExpenseCategory[] | undefined;

  const expenses = await expenseService.getExpenses({
    dateFrom: parameters.dateRange?.startDate,
    dateTo: parameters.dateRange?.endDate,
    category: expenseCategories,
    vendorId: parameters.customerIds?.at(0),
  });

  if (!expenses || expenses.length === 0) return null;

  const groupedByPeriod = groupByPeriod(expenses, parameters.groupBy, 'date', 'amount');

  const monthlyTrend = groupedByPeriod.map((group) => {
    const periodLabel = group.label;
    const expensesInPeriod = expenses.filter((e) => {
      const periodOfE = getPeriodLabel(e.date, parameters.groupBy);
      return periodOfE === periodLabel;
    });

    const sumsByCategory: Record<ExpenseCategory, number> = {} as any;
    for (const expense of expensesInPeriod) {
      const cat = (expense.category || 'OTHER') as ExpenseCategory;
      sumsByCategory[cat] = (sumsByCategory[cat] || 0) + expense.amount;
    }

    const topCategories = Object.entries(sumsByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
      }));

    return {
      month: periodLabel,
      totalExpenses: group.value,
      topCategories,
    };
  });

  const expenseData: ExpenseReportData = {
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    expensesByCategory: [],
    monthlyTrend,
  };

  const reportData: ReportData = {
    revenueData: {
      totalRevenue: 0,
      membershipRevenue: 0,
      meetingRoomRevenue: 0,
      loungeRevenue: 0,
      otherRevenue: 0,
      breakdown: [],
    },
    expenseData,
  };

  return reportData;
}

export async function generateRevenueDataFromPayments(parameters: ReportParameters): Promise<ReportData> {
  const paymentService = new PaymentService();

  const payments: Payment[] = await paymentService.getPaymentByDate({
    dateFrom: parameters.dateRange.startDate,
    dateTo: parameters.dateRange.endDate,
  });

  let membershipRevenue = 0;
  let meetingRoomRevenue = 0;
  let loungeRevenue = 0;
  let otherRevenue = 0;

  const groupedRaw: { date: string; amount: number; type: BillingItemType }[] = [];

  for (const payment of payments) {
    let type: BillingItemType = BillingItemType.OTHER;

    if (payment.invoice_id) {
      const invoice: Invoice | null = await serviceGetInvoiceById(payment.invoice_id);
      if (invoice?.items?.length) {
        const typeCounts: Record<BillingItemType, number> = {} as any;
        for (const item of invoice.items) {
          typeCounts[item.type] = (typeCounts[item.type] || 0) + item.total_price;
        }
        type = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0] as BillingItemType;
      }
    }

    switch (type) {
      case BillingItemType.WORKSPACE:
        membershipRevenue += payment.amount;
        break;
      case BillingItemType.MEETING_ROOM:
        meetingRoomRevenue += payment.amount;
        break;
      case BillingItemType.LOUNGE:
        loungeRevenue += payment.amount;
        break;
      default:
        otherRevenue += payment.amount;
        break;
    }

    groupedRaw.push({ date: payment.date, amount: payment.amount, type });
  }

  const grouped = groupByPeriod(groupedRaw, parameters.groupBy ?? 'month', 'date', 'amount');

  const breakdown = grouped.map((g) => ({
    date: g.label,
    totalRevenue: g.value,
    membershipRevenue: 0,
    meetingRoomRevenue: 0,
    loungeRevenue: 0,
  }));

  const reportData: ReportData = {
    revenueData: {
      totalRevenue: membershipRevenue + meetingRoomRevenue + loungeRevenue + otherRevenue,
      membershipRevenue,
      meetingRoomRevenue,
      loungeRevenue,
      otherRevenue,
      breakdown,
    },
    expenseData: {
      totalExpenses: 0,
      expensesByCategory: [],
      monthlyTrend: [],
    },
  };

  return reportData;
}

function getPeriodLabel(dateStr: string, groupBy: 'month' | 'quarter' | 'year' = 'month'): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();

  if (groupBy === 'year') return `${year}`;
  if (groupBy === 'quarter') {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `Q${quarter} ${year}`;
  }

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}
