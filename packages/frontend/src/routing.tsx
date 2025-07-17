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
import { AssignmentForm } from './MainMenu/Workspace/Components/assignmentForm';
import { BookingCalendar } from './MainMenu/Workspace/Components/bookingCalendar';
import { Billing } from './MainMenu/Billing/Components/billing';
import { UserTable } from './MainMenu/CoreAndIntegration/Components/User/ShowAllUsers';
import {RoomReservations} from './MainMenu/Workspace/Components/RoomReservations';import { EmailTemplateTable } from "./MainMenu/CoreAndIntegration/Components/EmailTemplate/ShowAllEmailTemplates";



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
        <Route path="/workspaceMap" element={<WorkspaceMap />} />
        <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
        <Route path="assignmentForm" element={<AssignmentForm />} />
        <Route path="bookingCalendar" element={<BookingCalendar roomId={""} roomName={""} />} />
        <Route path="payment" element={<PaymentForm />} />
        <Route path="vendors" element={<VendorsList vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/new" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/:id/edit" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
        <Route path="vendors/:id" element={<VendorSummary vendors={vendors} setVendors={setVendors} />} />

        <Route path="billing/*" element={<Billing />} />
        <Route path="users" element={< UserTable />} />
        <Route path="meetingRooms" element={<RoomReservations />} />  
        <Route path="emailTemplate" element={< EmailTemplateTable />} />
      </Route>
    </Routes>
  );
};