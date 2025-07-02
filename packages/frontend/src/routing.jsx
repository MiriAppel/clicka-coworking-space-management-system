import { Route, Routes } from "react-router-dom"
import App from "./App"
import { WorkspaceMap } from "./MainMenu/Workspace/Components/workspaceMaps"
import { LeadAndCustomerRouting } from "./MainMenu/LeadAndCustomer/Components/LeadAndCustomerRouting"
import { UserTable } from './MainMenu/CoreAndIntegration/Components/User/ShowAllUsers';
import { Billing } from "./MainMenu/Billing/Components/Billing";


export const routing = () => {
    return <>
        <Routes>
            <Route path="*" element={<App />} />
            <Route path="leadAndCustomer/*" element={<LeadAndCustomerRouting />} />
            <Route path="workspaceMap" element={< WorkspaceMap />} />
            <Route path="users" element={< UserTable />} />
            <Route path="billing" element={< Billing />} />

        </Routes>
    </>
}