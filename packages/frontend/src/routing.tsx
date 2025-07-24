
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
import { CreateExpenseForm } from './MainMenu/Billing/Components/expenseManagementSystem/expenseForm';
import { BillingRouting } from './MainMenu/Billing/Components/BillingRouting';
import MainLayout from './layout/MainLayout';
import { ExpenseList } from './MainMenu/Billing/Components/expenseManagementSystem/expenseList';
import { ExpenseDetails } from './MainMenu/Billing/Components/expenseManagementSystem/expenseDetails';
import PaymentForm from './MainMenu/Billing/Components/invoice-generation-engine/PaymentForm';
import { WorkspaceMap } from './MainMenu/Workspace/Components/workspaceMap';
import { BookingCalendar } from './MainMenu/Workspace/Components/bookingCalendar';
import { ManagementWorkspace } from './MainMenu/Workspace/Components/managementWorkspace';
import { AssignmentForm } from './MainMenu/Workspace/Components/assignmentForm';
import { Billing } from './MainMenu/Billing/Components/billing';
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
import { BookingTable } from './MainMenu/Workspace/Components/bookingTable';
import { UpdateBooking } from './MainMenu/Workspace/Components/updateBooking';
import { Report } from './MainMenu/Workspace/Components/report';
import { AssigmentTable } from './MainMenu/Workspace/Components/assigenmentTable';
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
        <Route path="leadAndCustomer" element={<LeadAndCustomer />} />
        <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
        <Route path="billing/*" element={<BillingRouting />} />
        <Route path="expenses" element={<ExpenseList />} />
        <Route path="expenses/expense-form" element={<CreateExpenseForm />} />
        <Route path="expenses/expense-form/:id" element={<CreateExpenseForm />} />
        <Route path="/workspaceMap" element={<WorkspaceMap />} />
        <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
        <Route path="assignmentForm" element={<AssigmentTable/>} />
        <Route path="bookings" element={<BookingTable />} />
        <Route path="updateBooking" element={<UpdateBooking />} />
        <Route path="bookingCalendar" element={<BookingCalendar roomId={""} roomName={""} />} />
        <Route path="payment" element={<PaymentForm />} />
        <Route path="vendors" element={<VendorsList vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/new" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/:id/edit" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/:id" element={<VendorSummary vendors={vendors} setVendors={setVendors} />} />
        <Route path="expense-form" element={<CreateExpenseForm />} />
        <Route path="billing/*" element={<Billing />} />
        <Route path="users" element={< UserTable />} />
        <Route path="meetingRooms" element={<RoomReservations />} />
        <Route path="UserActions" element={< AuditLogTable />} />
        <Route path="emailTemplate" element={< EmailTemplateTable />} />
        <Route path="sendEmails" element={< SendEmail />} />
        <Route path="/pricing" element={<PricingHomePage />} />
        <Route path="/pricing/workspace" element={<PricingSectionPage type="workspace" />} />
        <Route path="/pricing/meeting-room" element={<PricingSectionPage type="meeting-room" />} />
        <Route path="/pricing/lounge" element={<PricingSectionPage type="lounge" />} />
        <Route path="/managementWorkspace" element={<ManagementWorkspace />} />
        <Route path="/billing/invoiceManagement" element={< InvoiceManagement />} />
        <Route path="/occupancyReports" element={<Report  />} />
     
      </Route>
    </Routes>
  );
};
