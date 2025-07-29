import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import { LeadAndCustomer } from './MainMenu/LeadAndCustomer/Components/leadAndCustomer';
import VendorsList from './MainMenu/Billing/Components/Vendor-management/VendorsList';
import VendorSummary from './MainMenu/Billing/Components/Vendor-management/VendorSummary';
import { LeadAndCustomerRouting } from './MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting';
import { Vendor } from 'shared-types';
import { VendorForm } from './MainMenu/Billing/Components/Vendor-management/VendorForm';
import { getAllVendors } from './Api/vendor-api'; // פונקציה שמבצעת קריאת axios למסד נתונים
import PaymentForm from './MainMenu/Billing/Components/invoice-generation-engine/PaymentForm';
import MainLayout from './layout/MainLayout';
import { WorkspaceMap } from './MainMenu/Workspace/Components/workspaceMap';
import { Billing } from './MainMenu/Billing/Components/Billing';
import { UserTable } from './MainMenu/CoreAndIntegration/Components/User/ShowAllUsers';
import { RoomReservations } from './MainMenu/Workspace/Components/RoomReservations';
import { EmailTemplateTable } from "./MainMenu/CoreAndIntegration/Components/EmailTemplate/ShowAllEmailTemplates";
import { SendEmail } from './MainMenu/CoreAndIntegration/Components/SendEmail/SendEmail';
// import EmailConfirmationPage from './MainMenu/LeadAndCustomer/Components/Leads/EmailConfirmationPage';
import AuditLogTable from './MainMenu/CoreAndIntegration/Components/User/AuditLogTable';
import { ExpensesPage } from './MainMenu/Billing/Components/expenseManagementSystem/ExpensesPage';
import PricingHomePage from './MainMenu/Billing/Components/Pricing/PricingHomePage';
import PricingSectionPage from './MainMenu/Billing/Components/Pricing/PricingSectionPage';
import { InvoiceManagement } from './MainMenu/Billing/Components/invoice-generation-engine/InvoiceManagement';
import DocumentTemplate from './MainMenu/DocumentManagement/Components/DocumentTemplate';
import AddDocumentTemplate from './MainMenu/DocumentManagement/Components/AddDocumentTemplate';
import { PreviewDocumentTemplate } from './MainMenu/DocumentManagement/Components/PreviewDocumentTemplate';
import ShowDocumentTemplate from './MainMenu/DocumentManagement/Components/ShowDocumentTemplate';
import { UpdateDocumentTemplate } from './MainMenu/DocumentManagement/Components/UpdateDocumentTemplate';

export const Routing = () => {
  // משתנה state שמכיל את כל הספקים שנשלפים מהמסד
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // משתנה שמייצג האם הנתונים עוד בטעינה
  const [loading, setLoading] = useState(true);

  // useEffect - רץ פעם אחת לאחר טעינת הקומפוננטה
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // קריאה לפונקציה שמביאה את רשימת הספקים מהשרת (API)
        const data = await getAllVendors();
        setVendors(data); // שומר את הנתונים ב-state
      } catch (err) {
        console.error("שגיאה בשליפת ספקים:", err); // הדפסת שגיאה אם השליפה נכשלה
      } finally {
        setLoading(false); // מסמן שהטעינה הסתיימה (בין אם הצליחה או נכשלה)
      }
    };

    fetchVendors(); // מפעיל את הפונקציה
  }, []); // [] אומר שה־useEffect ירוץ רק בפעם הראשונה

  // אם עדיין טוען – מציג הודעת טעינה למשתמש
  if (loading) return <div>טוען נתונים...</div>;

  // ברגע שהנתונים נטענו, מוצגים כל הראוטים של המערכת
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<App />} />
        <Route path="/" element={<App />} />
        <Route path="/workspaceMap" element={<WorkspaceMap />} />
        <Route path="leadAndCustomer" element={<LeadAndCustomer />} />
        <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
        <Route path="billing/*" element={<BillingRouting />} />
        <Route path="expenses" element={<ExpenseList />} />
        <Route path="expenses/expense-form" element={<CreateExpenseForm />} />
        <Route path="expenses/expense-form/:id" element={<CreateExpenseForm />} />
        <Route path="/workspaceMap" element={<WorkspaceMap />} />
        <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
        <Route path="assignmentForm" element={<AssignmentForm />} />
        <Route path="bookingCalendar" element={<BookingCalendar roomId={""} roomName={""} />} />
        <Route path="payments" element={<DocumentTemplate />} />
        <Route path="/document-templates" element={<DocumentTemplate />} />
        <Route path="document-templates/edit/:id" element={<UpdateDocumentTemplate />} />
        <Route path="document-templates/view/:id" element={<ShowDocumentTemplate />} />
        <Route path="document-templates/preview/:id" element={<PreviewDocumentTemplate />} />
        <Route path="document-templates/add" element={<AddDocumentTemplate />} />
        {/* <Route path="document-templates/preview/:id" element={<DocumentTemplate />} /> */}
        <Route path="payment" element={<PaymentForm />} />
        <Route path="vendors" element={<VendorsList vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/new" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/:id/edit" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/:id" element={<VendorSummary vendors={vendors} setVendors={setVendors} />} />
        <Route path="billing/*" element={<Billing />} />
        <Route path="users" element={< UserTable />} />
     
      </Route>
    </Routes>
  );
};
