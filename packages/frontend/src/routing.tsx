import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';  // אם App ישמש רק כרכיב בית, או ניתן להפריד
import { WorkspaceMap } from './MainMenu/Workspace/Components/workspaceMap';
import { Billing } from './MainMenu/Billing/Components/billing';
import { LeadAndCustomer } from './MainMenu/LeadAndCustomer/Components/leadAndCustomer';
import PaymentForm from './MainMenu/Workspace/Components/invoice-generation-engine/PaymentForm';
import VendorsList from './MainMenu/Billing/Components/Vendor-management/VendorsList';
import VendorSummary from './MainMenu/Billing/Components/Vendor-management/VendorSummary';
import { LeadAndCustomerRouting } from './MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting';
import { Vendor, VendorCategory } from 'shared-types';
import { VendorForm } from './MainMenu/Billing/Components/Vendor-management/VendorForm';

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'ספק א',
    category: VendorCategory.Equipment,
    phone: '050-1234567',
    email: 'a@example.com',
    address: 'רחוב הדוגמה 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'ספק ב',
    category: VendorCategory.Services,
    phone: '052-7654321',
    email: 'b@example.com',
    address: 'רחוב הדוגמה 2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const Routing = () => {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="leadAndCustomer" element={<LeadAndCustomer />} />
      <Route path="workspaceMap" element={<WorkspaceMap />} />
      <Route path="billing" element={<Billing />} />
      <Route path="payment" element={<PaymentForm />} />
      <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
      <Route path="vendors" element={<VendorsList vendors={vendors} setVendors={setVendors} />} />
      <Route path="vendors/new" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
      <Route path="vendors/:id/edit" element={<VendorForm vendors={vendors} setVendors={setVendors} />} />
      <Route path="vendors/:id" element={<VendorSummary vendors={vendors} setVendors={setVendors} />} />
    </Routes>
  );
};
