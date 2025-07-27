import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import { AuthenticationScreen } from './MainMenu/CoreAndIntegration/Components/Login/AuthenticationScreen';
import { ProtectedRoute } from './MainMenu/CoreAndIntegration/Components/Login/ProtectedRoute';

import { LeadAndCustomer } from './MainMenu/LeadAndCustomer/Components/leadAndCustomer';
import { LeadAndCustomerRouting } from './MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting';
import VendorsList from './MainMenu/Billing/Components/Vendor-management/VendorsList';
import { getAllVendors } from './Api/vendor-api';
import { Vendor } from 'shared-types';
import { BillingRouting } from './MainMenu/Billing/Components/BillingRouting';
import { ExpenseList } from './MainMenu/Billing/Components/expenseManagementSystem/expenseList';
import { CreateExpenseForm } from './MainMenu/Billing/Components/expenseManagementSystem/expenseForm';
import PaymentForm from './MainMenu/Billing/Components/invoice-generation-engine/PaymentForm';
import { WorkspaceMap } from './MainMenu/Workspace/Components/workspaceMap';
import { BookingCalendar } from './MainMenu/Workspace/Components/bookingCalendar';
import { ManagementWorkspace } from './MainMenu/Workspace/Components/managementWorkspace';
import { AssignmentForm } from './MainMenu/Workspace/Components/assignmentForm';
import { Billing } from './MainMenu/Billing/Components/billing';
import { UserTable } from './MainMenu/CoreAndIntegration/Components/User/ShowAllUsers';
import { RoomReservations } from './MainMenu/Workspace/Components/RoomReservations';
import { SendEmail } from './MainMenu/CoreAndIntegration/Components/SendEmail/SendEmail';
import { EmailTemplateTable } from './MainMenu/CoreAndIntegration/Components/EmailTemplate/ShowAllEmailTemplates';
import AuditLogTable from './MainMenu/CoreAndIntegration/Components/User/AuditLogTable';
import PricingHomePage from './MainMenu/Billing/Components/Pricing/PricingHomePage';
import PricingSectionPage from './MainMenu/Billing/Components/Pricing/PricingSectionPage';
import { InvoiceManagement } from './MainMenu/Billing/Components/invoice-generation-engine/InvoiceManagement';
import { VendorForm } from './MainMenu/Billing/Components/Vendor-management/VendorForm';
import MainLayout from './layout/MainLayout';

export const Routing = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getAllVendors();
        setVendors(data);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  if (loading) return <div>Loading vendors...</div>;

  return (
    <Routes>
    // ניתוב לרישום 
      <Route path="/auth" element={<AuthenticationScreen />} />

     // משתמש בקומפוננטה של החסימה שרק ישלח אותי לבית מתי שאני אהיה רשומה 
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >

     
        {/* <Route element={<MainLayout />}></Route> */}
        <Route path="leadAndCustomer" element={<LeadAndCustomer />} />
        <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
        <Route path="billing/*" element={<BillingRouting />} />
        <Route path="expenses" element={<ExpenseList />} />
        <Route path="expenses/expense-form" element={<CreateExpenseForm />} />
        <Route path="expenses/expense-form/:id" element={<CreateExpenseForm />} />
        <Route path="workspaceMap" element={<WorkspaceMap />} />
        <Route path="assignmentForm" element={<AssignmentForm />} />
        <Route path="bookingCalendar" element={<BookingCalendar roomId="" roomName="" />} />
        <Route path="payment" element={<PaymentForm />} />
        <Route path="vendors" element={<VendorsList vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/new" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/:id/edit" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
        <Route path="billing" element={<Billing />} />
        <Route path="users" element={<UserTable />} />
        <Route path="meetingRooms" element={<RoomReservations />} />
        <Route path="UserActions" element={<AuditLogTable />} />
        <Route path="emailTemplate" element={<EmailTemplateTable />} />
        <Route path="sendEmails" element={<SendEmail />} />
        <Route path="pricing" element={<PricingHomePage />} />
        <Route path="pricing/workspace" element={<PricingSectionPage type="workspace" />} />
        <Route path="pricing/meeting-room" element={<PricingSectionPage type="meeting-room" />} />
        <Route path="pricing/lounge" element={<PricingSectionPage type="lounge" />} />
        <Route path="managementWorkspace" element={<ManagementWorkspace />} />
        <Route path="billing/invoiceManagement" element={<InvoiceManagement />} />
      </Route>
      

  
      <Route path="*" element={<div>404 - Page not found</div>} />
    </Routes>
  );
};
