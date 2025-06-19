import { Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import { WorkspaceMap } from './MainMenu/Workspace/Components/workspaceMap';
import { Billing } from './MainMenu/Billing/Components/billing';
import { LeadAndCustomer } from './MainMenu/LeadAndCustomer/Components/leadAndCustomer';
import App from './App';

export const routing = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<App />} />
        <Route path="/leadAndCustomer" element={<LeadAndCustomer />} />
        <Route path="/workspaceMap" element={<WorkspaceMap />} />
        <Route path="/billing" element={<Billing />} />
      </Route>
    </Routes>
  );
};
