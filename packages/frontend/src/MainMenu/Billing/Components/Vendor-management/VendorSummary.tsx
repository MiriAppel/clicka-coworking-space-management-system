import { useEffect } from "react";
import { Table } from "../../../../Common/Components/BaseComponents/Table";
import VendorDocuments from "./VendorDocuments";
import { useNavigate } from "react-router-dom";
import { useVendorsStore } from "../../../../Stores/Billing/vendorsStore";
import { Vendor } from "shared-types";

type VendorSummaryProps = {
  vendor: Vendor;
};

export default function VendorSummary({ vendor }: VendorSummaryProps) {
  const navigate = useNavigate();
  const { fetchExpensesByVendorId, expenses, deleteVendor } = useVendorsStore();

  useEffect(() => {
    fetchExpensesByVendorId(vendor.id);
  }, [vendor.id, fetchExpensesByVendorId]);

  const vendorExpenses = expenses.filter((e) => e.vendor_id === vendor.id);
  const expenseCount = vendorExpenses.length;
  const totalExpenses = vendorExpenses.reduce((sum, e) => sum + e.amount, 0);
  const averageExpense = expenseCount > 0 ? parseFloat((totalExpenses / expenseCount).toFixed(2)) : 0;
  const lastExpenseDate = expenseCount > 0 ? vendorExpenses[expenseCount - 1].date : '-';

  const handleDeleteVendor = async () => {
    if (window.confirm('האם למחוק את הספק?')) {
      await deleteVendor(vendor.id);
      navigate('/vendors');
    }
  };

  return (
    <div className="p-4 border-t mt-4 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div><strong>שם:</strong> {vendor.name}</div>
        <div><strong>קטגוריה:</strong> {vendor.category}</div>
        <div><strong>טלפון:</strong> {vendor.phone}</div>
        <div><strong>אימייל:</strong> {vendor.email}</div>
        <div><strong>כתובת:</strong> {vendor.address}</div>
      </div>

      <VendorDocuments vendorId={vendor.id} />

      <div className="mt-4 space-y-2">
        <div><strong>סך הוצאות:</strong> {totalExpenses} ₪</div>
        <div><strong>מספר הוצאות:</strong> {expenseCount}</div>
        <div><strong>ממוצע הוצאה:</strong> {averageExpense} ₪</div>
        <div><strong>תאריך הוצאה אחרונה:</strong> {lastExpenseDate}</div>
      </div>

      {vendorExpenses.length > 0 && (
        <div className="mt-4">
          <Table
            columns={[
              { header: 'סכום', accessor: 'amount' },
              { header: 'קטגוריה', accessor: 'category' },
              { header: 'תיאור', accessor: 'description' },
              { header: 'תאריך', accessor: 'date' },
              { header: 'סטטוס', accessor: 'status' },
            ]}
            data={vendorExpenses}
            dir="rtl"
          />
        </div>
      )}
    </div>
  );
}
