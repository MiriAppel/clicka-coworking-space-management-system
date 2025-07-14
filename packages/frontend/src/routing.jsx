import { Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import { WorkspaceMap } from './MainMenu/Workspace/Components/workspaceMap';
// import { Billing } from './MainMenu/Billing/Components/billing';
import { LeadAndCustomerRouting } from './MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting'
import { UserTable } from './MainMenu/CoreAndIntegration/Components/User/ShowAllUsers';
import App from './App';
import { PaymentList } from './MainMenu/Billing/Components/paymentList';

export const routing = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<App />} />
        <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
        <Route path="/workspaceMap" element={<WorkspaceMap />} />
        <Route path="users" element={< UserTable />} />
        {/* <Route path="/billing" element={<Billing />} /> */}
      </Route>
    </Routes>
  );
};

